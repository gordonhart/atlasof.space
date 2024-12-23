import { CelestialBodyState, Point2 } from '../types.ts';
import { HOVER_SCALE_FACTOR, MeshType, MIN_SIZE, SCALE_FACTOR } from './constants.ts';
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

export class CelestialBody3D {
  readonly name: string;
  readonly parentName: string | null;
  readonly scene: Scene;
  readonly color: Color;

  // main objects
  readonly body: Mesh;
  readonly dot: Points;
  readonly ellipse: Line2;

  // for memory efficiency
  readonly dotPosition: BufferAttribute;
  readonly screenPosition: Vector3;

  private hovered: boolean = false;
  readonly spherePoints: number = 32;
  readonly ellipsePoints: number = 360;

  constructor(scene: Scene, parent: CelestialBodyState | null, body: CelestialBodyState) {
    this.name = body.name;
    this.parentName = parent?.name ?? null;
    this.scene = scene;
    this.color = new Color(body.color);
    this.screenPosition = new Vector3();

    // Create the main sphere geometry for the celestial body
    const sphereGeometry = new SphereGeometry(body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
    const sphereMaterial = new MeshBasicMaterial({ color: this.color });
    this.body = new Mesh(sphereGeometry, sphereMaterial);
    const position = mul3(1 / SCALE_FACTOR, body.position);
    this.body.position.set(...position);
    this.body.userData = { name: this.name, type: MeshType.BODY };
    scene.add(this.body);

    // add a fixed-size (in display-space) dot to ensure body is always visible, event at far zooms
    const dotGeometry = new BufferGeometry();
    this.dotPosition = new BufferAttribute(new Float32Array(position), 3);
    dotGeometry.setAttribute('position', this.dotPosition);
    // TODO: smaller dot size
    const dotMaterial = new PointsMaterial({ size: MIN_SIZE, color: this.color });
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
    const ellipseMaterial = new LineMaterial({ color: this.color, linewidth: 1, resolution });
    this.ellipse = new Line2(ellipseGeometry, ellipseMaterial);
    if (parent != null) {
      this.ellipse.translateX(parent.position[0] / SCALE_FACTOR);
      this.ellipse.translateY(parent.position[1] / SCALE_FACTOR);
      this.ellipse.translateZ(parent.position[2] / SCALE_FACTOR);
    }
    this.ellipse.rotateZ(degreesToRadians(OmegaDeg));
    this.ellipse.rotateX(degreesToRadians(iDeg));
    this.ellipse.userData = { name: this.name, type: MeshType.ELLIPSE };
    scene.add(this.ellipse);
  }

  update(appState: AppState, parent: CelestialBodyState | null, body: CelestialBodyState) {
    const position = mul3(1 / SCALE_FACTOR, body.position);
    this.body.position.set(...position);
    this.dotPosition.array[0] = position[0];
    this.dotPosition.array[1] = position[1];
    this.dotPosition.array[2] = position[2];
    this.dotPosition.needsUpdate = true;
    this.ellipse.visible = appState.drawOrbit;

    // move ellipse based on position of parent
    if (parent != null) {
      // TODO: do these ever rotate relative to the sun?
      this.ellipse.translateX(parent.position[0] / SCALE_FACTOR - this.ellipse.position.x);
      this.ellipse.translateY(parent.position[1] / SCALE_FACTOR - this.ellipse.position.y);
      this.ellipse.translateZ(parent.position[2] / SCALE_FACTOR - this.ellipse.position.z);
    }

    // scale body based on hover state
    if (appState.hover === this.name && !this.hovered) {
      this.body.geometry.dispose(); // toggle hover on
      const radius = (HOVER_SCALE_FACTOR * body.radius) / SCALE_FACTOR;
      this.body.geometry = new SphereGeometry(radius, this.spherePoints, this.spherePoints);
      this.ellipse.material.linewidth = 3;
      this.hovered = true;
    } else if (appState.hover !== this.name && this.hovered) {
      this.body.geometry.dispose(); // toggle hover off
      this.body.geometry = new SphereGeometry(body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
      this.ellipse.material.linewidth = 1;
      this.hovered = false;
    }
  }

  getScreenPosition(camera: OrthographicCamera): Point2 {
    this.body.updateWorldMatrix(true, false);
    this.screenPosition.setFromMatrixPosition(this.body.matrixWorld); // get world position
    this.screenPosition.project(camera); // project into screen space
    const pixelX = ((this.screenPosition.x + 1) * window.innerWidth) / 2;
    const pixelY = ((-this.screenPosition.y + 1) * window.innerHeight) / 2;
    return [pixelX, pixelY]; // return pixel values
  }

  dispose() {
    this.body.geometry.dispose();
    (this.body.material as Material).dispose();
    this.dot.geometry.dispose();
    (this.dot.material as Material).dispose();
    this.ellipse.geometry.dispose();
    (this.ellipse.material as Material).dispose();
    this.scene.remove(this.body);
  }

  drawLabel(ctx: CanvasRenderingContext2D, camera: OrthographicCamera) {
    const [bodyXpx, bodyYpxInverted] = this.getScreenPosition(camera);
    const bodyYpx = window.innerHeight - bodyYpxInverted;

    const label = this.name; // TODO: shortName?
    ctx.font = '12px Arial';
    const { width: textWidthPx, actualBoundingBoxAscent: textHeightPx } = ctx.measureText(label);
    const textPx: Point2 = [textWidthPx, textHeightPx];
    const canvasPx = getCanvasPixels(ctx);
    const color = `#${this.color.getHexString()}`;

    // body is off-screen; draw a pointer
    if (isOffScreen(bodyXpx, bodyYpx)) {
      drawOffscreenLabel(ctx, label, color, canvasPx, [bodyXpx, bodyYpx], textPx);
    } else {
      // TODO
      // const [offsetXpx, offsetYpx] = [textWidthPx / 2, Math.max(radius / metersPerPx, 1) + 10];
      const [offsetXpx, offsetYpx] = [textWidthPx / 2, 10];
      drawLabelAtLocation(ctx, label, color, [bodyXpx - offsetXpx, bodyYpx + offsetYpx], textPx);
    }
  }
}
