import { CelestialBody, Point2 } from '../types.ts';
import { HOVER_SCALE_FACTOR, SCALE_FACTOR } from './constants.ts';
import { Color, OrthographicCamera, Scene, Vector3 } from 'three';
import { AppState } from '../state.ts';
import { drawLabelAtLocation, drawOffscreenLabel, getCanvasPixels } from './canvas.ts';
import { isOffScreen } from './utils.ts';
import { KinematicBody } from './KinematicBody.ts';
import { OrbitalEllipse } from './OrbitalEllipse.ts';
import { SphericalBody } from './SphericalBody.ts';
import { FocalRadius } from './FocalRadius.ts';

// body that follows an elliptical orbit around a parent described by Keplerian elements
export class KeplerianBody extends KinematicBody {
  public readonly body: CelestialBody;
  private readonly scene: Scene;
  private readonly sphere: SphericalBody;
  private readonly ellipse: OrbitalEllipse;
  private readonly radius: FocalRadius;
  private readonly screenPosition: Vector3;

  private visible: boolean = false;
  private hovered: boolean = false;

  constructor(
    scene: Scene,
    appState: AppState,
    parent: KeplerianBody | null,
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
    this.ellipse = new OrbitalEllipse(this.scene, body.elements, parent?.position ?? null, color);
    this.radius = new FocalRadius(this.scene, parent?.position ?? new Vector3(), position, color);
    this.sphere = new SphericalBody(this.scene, body, position, color);
  }

  update(appState: AppState, parent: this | null) {
    this.visible = appState.visibleTypes.has(this.body.type);
    this.sphere.update(this.position, this.rotation, this.visible);
    this.ellipse.update(this.visible && appState.drawOrbit, parent?.position ?? null);

    // scale body based on hover state
    const thisIsHovered = appState.hover === this.body.name;
    if (thisIsHovered !== this.hovered) {
      this.sphere.setFocus(thisIsHovered);
      this.ellipse.setFocus(thisIsHovered);
      this.hovered = thisIsHovered;
    }
    this.radius.update(parent?.position ?? null, this.position, thisIsHovered);
  }

  getScreenPosition(camera: OrthographicCamera): Point2 {
    this.screenPosition.set(this.position.x, this.position.y, this.position.z);
    this.screenPosition.multiplyScalar(1 / SCALE_FACTOR).project(camera);
    const pixelX = ((this.screenPosition.x + 1) * window.innerWidth) / 2;
    const pixelY = ((1 - this.screenPosition.y) * window.innerHeight) / 2;
    return [pixelX, pixelY]; // return pixel values
  }

  dispose() {
    this.sphere.dispose();
    this.ellipse.dispose();
    this.radius.dispose();
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
