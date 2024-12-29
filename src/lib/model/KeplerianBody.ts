import { CelestialBody, Point2 } from '../types.ts';
import { HOVER_SCALE_FACTOR, SCALE_FACTOR } from './constants.ts';
import { Color, OrthographicCamera, Scene, Vector2, Vector3 } from 'three';
import { AppState } from '../state.ts';
import { drawLabelAtLocation, drawOffscreenIndicator, getCanvasPixels } from './canvas.ts';
import { isOffScreen } from './utils.ts';
import { KinematicBody } from './KinematicBody.ts';
import { OrbitalEllipse } from './OrbitalEllipse.ts';
import { SphericalBody } from './SphericalBody.ts';
import { FocalRadius } from './FocalRadius.ts';
import { AxisIndicator } from './AxisIndicator.ts';

// body that follows an elliptical orbit around a parent described by Keplerian elements
export class KeplerianBody extends KinematicBody {
  public readonly body: CelestialBody;
  private readonly resolution: Vector2;
  private readonly sphere: SphericalBody;
  private readonly ellipse: OrbitalEllipse;
  private readonly radius: FocalRadius;
  private readonly axis: AxisIndicator | null = null;
  private readonly screenPosition: Vector3;

  private visible: boolean = false;
  private hovered: boolean = false;

  constructor(
    scene: Scene,
    resolution: Vector2,
    appState: AppState,
    parent: KeplerianBody | null,
    body: CelestialBody,
    position: Vector3,
    velocity: Vector3
  ) {
    const { mass, influencedBy, rotation } = body;
    super(mass, influencedBy, rotation?.siderealPeriod, position, velocity);
    this.body = body;
    this.resolution = resolution;
    this.screenPosition = new Vector3();
    this.visible = appState.visibleTypes.has(body.type);
    const color = new Color(body.color);
    this.ellipse = new OrbitalEllipse(scene, resolution, body.elements, parent?.position ?? null, color);
    this.radius = new FocalRadius(scene, resolution, parent?.position ?? new Vector3(), position, color);
    this.sphere = new SphericalBody(scene, body, position, color);
    if (body.rotation != null) {
      this.axis = new AxisIndicator(scene, resolution, this.position, body.rotation.axialTilt, body.radius, color);
    }
  }

  update(appState: AppState, parent: this | null) {
    this.visible = appState.visibleTypes.has(this.body.type);
    this.sphere.update(this.position, this.rotation, this.visible);
    this.ellipse.update(this.visible && appState.drawOrbit, parent?.position ?? null);

    // scale body based on hover state
    const thisIsHovered = appState.hover === this.body.name;
    if (thisIsHovered !== this.hovered) {
      this.sphere.setHover(thisIsHovered);
      this.ellipse.setHover(thisIsHovered);
      this.hovered = thisIsHovered;
    }
    this.radius.update(parent?.position ?? null, this.position, thisIsHovered);
    this.axis?.update(this.position, thisIsHovered);
  }

  dispose() {
    this.sphere.dispose();
    this.ellipse.dispose();
    this.radius.dispose();
    this.axis?.dispose();
  }

  getScreenPosition(camera: OrthographicCamera): Point2 {
    this.screenPosition.copy(this.position).divideScalar(SCALE_FACTOR).project(camera);
    const pixelX = ((this.screenPosition.x + 1) * this.resolution.x) / 2;
    const pixelY = ((1 - this.screenPosition.y) * this.resolution.y) / 2;
    return [pixelX, pixelY]; // return pixel values
  }

  drawLabel(ctx: CanvasRenderingContext2D, camera: OrthographicCamera, metersPerPx: number) {
    if (!this.visible) return;

    const [bodyXpx, bodyYpxInverted] = this.getScreenPosition(camera);
    const bodyYpx = this.resolution.y - bodyYpxInverted;

    const label = this.body.shortName ?? this.body.name;
    ctx.font = '12px Electrolize, Arial'; // TODO: better font
    const { width: textWidthPx, actualBoundingBoxAscent: textHeightPx } = ctx.measureText(label);
    const textPx: Point2 = [textWidthPx, textHeightPx];
    const canvasPx = getCanvasPixels(ctx);

    // body is off-screen; draw a pointer
    if (isOffScreen([bodyXpx, bodyYpx], [this.resolution.x, this.resolution.y])) {
      drawOffscreenIndicator(ctx, this.body.color, canvasPx, [bodyXpx, bodyYpx]);
    } else {
      const baseRadius = this.body.radius / metersPerPx;
      const radius = this.hovered ? baseRadius * HOVER_SCALE_FACTOR : baseRadius;
      const radiusPx = Math.max(radius, 1) + 5;
      drawLabelAtLocation(ctx, label, this.body.color, [bodyXpx, bodyYpx], textPx, radiusPx);
    }
  }
}
