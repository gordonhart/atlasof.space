import { CelestialBody, Point2 } from '../types.ts';
import { HOVER_SCALE_FACTOR, MIN_SIZE, SCALE_FACTOR } from './constants.ts';
import { mul3 } from '../physics.ts';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Material,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Vector3,
} from 'three';
import { AppState } from '../state.ts';
import { drawLabelAtLocation, drawOffscreenLabel, getCanvasPixels } from './canvas.ts';
import { getCircleTexture, isOffScreen } from './utils.ts';
import { KinematicBody } from './KinematicBody.ts';
import { OrbitalEllipse } from './OrbitalEllipse.ts';

// body that follows an elliptical orbit around a parent described by Keplerian elements
export class KeplerianBody3D extends KinematicBody {
  public readonly body: CelestialBody;
  private readonly scene: Scene;
  private readonly sphere: Mesh;
  private readonly dot: Points;
  private readonly ellipse: OrbitalEllipse;
  public readonly dotPosition: BufferAttribute;
  private readonly screenPosition: Vector3;

  private visible: boolean = false;
  private hovered: boolean = false;
  private readonly spherePoints: number = 36;

  constructor(
    scene: Scene,
    appState: AppState,
    parent: KeplerianBody3D | null,
    body: CelestialBody,
    position: Vector3,
    velocity: Vector3
  ) {
    const { mass, influencedBy, siderealRotationPeriod } = body;
    super(mass, influencedBy, siderealRotationPeriod, position, velocity);

    this.body = body;
    this.scene = scene;
    this.screenPosition = new Vector3();
    this.visible = appState.visibleTypes.has(body.type);
    const color = new Color(body.color);

    // Create the main sphere geometry for the celestial body
    const sphereGeometry = new SphereGeometry(body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
    const sphereMaterial = new MeshBasicMaterial({ color });
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    const positionScaled = mul3(1 / SCALE_FACTOR, position.toArray());
    this.sphere.position.set(...positionScaled);
    scene.add(this.sphere);

    // add a fixed-size (in display-space) dot to ensure body is always visible, event at far zooms
    const dotGeometry = new BufferGeometry();
    this.dotPosition = new BufferAttribute(new Float32Array(positionScaled), 3);
    dotGeometry.setAttribute('position', this.dotPosition);
    const map = getCircleTexture(body.color);
    const dotMaterial = new PointsMaterial({ size: MIN_SIZE, color, map, sizeAttenuation: false });
    // TODO: debug issue where these points mysteriously disappear at certain zooms (sphere+ellipse are still visible)
    dotMaterial.depthTest = true;
    this.dot = new Points(dotGeometry, dotMaterial);
    scene.add(this.dot);

    // add the orbital ellipse
    this.ellipse = new OrbitalEllipse(this.scene, body.elements, parent?.position ?? null, color);
  }

  update(appState: AppState, parent: this | null) {
    this.visible = appState.visibleTypes.has(this.body.type);
    this.sphere.position.set(...this.position.toArray()).multiplyScalar(1 / SCALE_FACTOR);
    this.sphere.visible = this.visible;
    this.dotPosition.array[0] = this.sphere.position.x;
    this.dotPosition.array[1] = this.sphere.position.y;
    this.dotPosition.array[2] = this.sphere.position.z;
    this.dotPosition.needsUpdate = true;
    this.dot.visible = this.visible;
    this.ellipse.update(this.visible && appState.drawOrbit, parent?.position ?? null);

    // scale body based on hover state
    if (appState.hover === this.body.name && !this.hovered) {
      this.sphere.geometry.dispose(); // toggle hover on
      const radius = (HOVER_SCALE_FACTOR * this.body.radius) / SCALE_FACTOR;
      this.sphere.geometry = new SphereGeometry(radius, this.spherePoints, this.spherePoints);
      this.ellipse.focus();
      this.hovered = true;
    } else if (appState.hover !== this.body.name && this.hovered) {
      this.sphere.geometry.dispose(); // toggle hover off
      this.sphere.geometry = new SphereGeometry(this.body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
      this.ellipse.blur();
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
    this.ellipse.dispose();
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
