import { CelestialBody, CelestialBodyState, Point2 } from '../types.ts';
import { HOVER_SCALE_FACTOR, MIN_SIZE, SCALE_FACTOR } from './constants.ts';
import { degreesToRadians, mul3, semiMinorAxis } from '../physics.ts';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  EllipseCurve,
  Material,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
} from 'three';
import { AppState } from '../state.ts';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { drawLabelAtLocation, drawOffscreenLabel, getCanvasPixels, isOffScreen } from '../draw.ts';
import { getCircleTexture } from './utils.ts';

export class CelestialBody3D {
  readonly body: CelestialBody;
  readonly parentName: string | null;
  readonly scene: Scene;

  // main objects
  readonly sphere: Mesh;
  readonly dot: Points;
  readonly ellipse: Line2;

  // for memory efficiency
  readonly dotPosition: BufferAttribute;
  readonly screenPosition: Vector3;

  private visible: boolean = false;
  private hovered: boolean = false;
  readonly spherePoints: number = 36;
  readonly ellipsePoints: number = 3600;

  constructor(scene: Scene, appState: AppState, parent: CelestialBodyState | null, body: CelestialBodyState) {
    this.body = body;
    this.parentName = parent?.name ?? null;
    this.scene = scene;
    this.screenPosition = new Vector3();
    this.visible = appState.visibleTypes.has(body.type);
    const color = new Color(body.color);

    // Create the main sphere geometry for the celestial body
    const sphereGeometry = new SphereGeometry(body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
    const sphereMaterial = new MeshBasicMaterial({ color });
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    const position = mul3(1 / SCALE_FACTOR, body.position);
    this.sphere.position.set(...position);
    scene.add(this.sphere);

    // add a fixed-size (in display-space) dot to ensure body is always visible, event at far zooms
    const dotGeometry = new BufferGeometry();
    this.dotPosition = new BufferAttribute(new Float32Array(position), 3);
    dotGeometry.setAttribute('position', this.dotPosition);
    const map = getCircleTexture(body.color);
    const dotMaterial = new PointsMaterial({ size: MIN_SIZE, color, map, transparent: true, sizeAttenuation: false });
    // TODO: debug issue where these points mysteriously disappear at certain zooms (sphere+ellipse are still visible)
    dotMaterial.depthTest = true;
    this.dot = new Points(dotGeometry, dotMaterial);
    scene.add(this.dot);

    // add the orbital ellipse
    const { elements } = body;
    const {
      semiMajorAxis: a,
      eccentricity: e,
      longitudeAscending: OmegaDeg,
      argumentOfPeriapsis: omegaDeg,
      inclination: iDeg,
    } = elements;
    const b = semiMinorAxis(a, e);
    const focusDistance = Math.sqrt(a ** 2 - b ** 2);
    const omega = degreesToRadians(omegaDeg);
    const ellipseCurve = new EllipseCurve(
      -(Math.cos(omega) * focusDistance) / SCALE_FACTOR, // not sure why the sign is negative, seems consistent
      -(Math.sin(omega) * focusDistance) / SCALE_FACTOR,
      a / SCALE_FACTOR,
      b / SCALE_FACTOR,
      0,
      Math.PI * 2,
      false,
      omega
    );
    // const ellipseMaterial = new MeshBasicMaterial({ color });
    const ellipsePoints = ellipseCurve.getPoints(this.ellipsePoints);
    const ellipseGeometry = new LineGeometry();
    ellipseGeometry.setPositions(ellipsePoints.flatMap(p => [p.x, p.y, 0]));
    // const ellipseMaterial = new LineBasicMaterial({ color });
    const resolution = new Vector2(window.innerWidth, window.innerHeight);
    const ellipseMaterial = new LineMaterial({ color, linewidth: 1, resolution });
    ellipseMaterial.depthTest = false;
    this.ellipse = new Line2(ellipseGeometry, ellipseMaterial);
    if (parent != null) {
      this.ellipse.translateX(parent.position[0] / SCALE_FACTOR);
      this.ellipse.translateY(parent.position[1] / SCALE_FACTOR);
      this.ellipse.translateZ(parent.position[2] / SCALE_FACTOR);
    }
    this.ellipse.rotateZ(degreesToRadians(OmegaDeg));
    this.ellipse.rotateX(degreesToRadians(iDeg));
    scene.add(this.ellipse);
  }

  update(appState: AppState, parent: CelestialBodyState | null, body: CelestialBodyState) {
    this.visible = appState.visibleTypes.has(this.body.type);
    const position = mul3(1 / SCALE_FACTOR, body.position);
    this.sphere.position.set(...position);
    this.sphere.visible = this.visible;
    this.dotPosition.array[0] = position[0];
    this.dotPosition.array[1] = position[1];
    this.dotPosition.array[2] = position[2];
    this.dotPosition.needsUpdate = true;
    this.dot.visible = this.visible;
    this.ellipse.visible = this.visible && appState.drawOrbit;

    // move ellipse based on position of parent
    if (parent != null) {
      // TODO: do these ever rotate relative to the sun?
      this.ellipse.translateX(parent.position[0] / SCALE_FACTOR - this.ellipse.position.x);
      this.ellipse.translateY(parent.position[1] / SCALE_FACTOR - this.ellipse.position.y);
      this.ellipse.translateZ(parent.position[2] / SCALE_FACTOR - this.ellipse.position.z);
    }

    // scale body based on hover state
    if (appState.hover === this.body.name && !this.hovered) {
      this.sphere.geometry.dispose(); // toggle hover on
      const radius = (HOVER_SCALE_FACTOR * body.radius) / SCALE_FACTOR;
      this.sphere.geometry = new SphereGeometry(radius, this.spherePoints, this.spherePoints);
      this.ellipse.material.linewidth = 3;
      this.hovered = true;
    } else if (appState.hover !== this.body.name && this.hovered) {
      this.sphere.geometry.dispose(); // toggle hover off
      this.sphere.geometry = new SphereGeometry(body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
      this.ellipse.material.linewidth = 1;
      this.hovered = false;
    }
  }

  getScreenPosition(camera: OrthographicCamera): Point2 {
    this.sphere.updateWorldMatrix(true, false);
    this.screenPosition.setFromMatrixPosition(this.sphere.matrixWorld); // get world position
    this.screenPosition.project(camera); // project into screen space
    const pixelX = ((this.screenPosition.x + 1) * window.innerWidth) / 2;
    const pixelY = ((-this.screenPosition.y + 1) * window.innerHeight) / 2;
    return [pixelX, pixelY]; // return pixel values
  }

  dispose() {
    this.sphere.geometry.dispose();
    (this.sphere.material as Material).dispose();
    this.scene.remove(this.sphere);
    this.dot.geometry.dispose();
    (this.dot.material as Material).dispose();
    this.scene.remove(this.dot);
    this.ellipse.geometry.dispose();
    (this.ellipse.material as Material).dispose();
    this.scene.remove(this.ellipse);
  }

  drawLabel(ctx: CanvasRenderingContext2D, camera: OrthographicCamera, metersPerPx: number) {
    if (!this.visible) return;

    const [bodyXpx, bodyYpxInverted] = this.getScreenPosition(camera);
    const bodyYpx = window.innerHeight - bodyYpxInverted;

    const label = this.body.shortName ?? this.body.name;
    ctx.font = '12px Arial';
    const { width: textWidthPx, actualBoundingBoxAscent: textHeightPx } = ctx.measureText(label);
    const textPx: Point2 = [textWidthPx, textHeightPx];
    const canvasPx = getCanvasPixels(ctx);

    // body is off-screen; draw a pointer
    if (isOffScreen(bodyXpx, bodyYpx)) {
      drawOffscreenLabel(ctx, label, this.body.color, canvasPx, [bodyXpx, bodyYpx], textPx);
    } else {
      const baseRadius = this.body.radius / metersPerPx;
      const radius = this.hovered ? baseRadius * HOVER_SCALE_FACTOR : baseRadius;
      const [offsetXpx, offsetYpx] = [textWidthPx / 2, Math.max(radius, 1) + 10];
      drawLabelAtLocation(ctx, label, this.body.color, [bodyXpx - offsetXpx, bodyYpx + offsetYpx], textPx);
    }
  }
}
