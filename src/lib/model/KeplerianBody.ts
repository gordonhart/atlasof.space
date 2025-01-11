import { Color, OrthographicCamera, Scene, Vector2, Vector3 } from 'three';
import { Settings } from '../state.ts';
import { CelestialBody, CelestialBodyType, Point2 } from '../types.ts';
import { AxisIndicator } from './AxisIndicator.ts';
import {
  drawDotAtLocation,
  drawLabelAtLocation,
  drawOffscreenIndicator,
  getCanvasPixels,
  isOffScreen,
  LABEL_FONT_FAMILY,
} from './canvas.ts';
import { HOVER_SCALE_FACTOR } from './constants.ts';
import { FocalRadius } from './FocalRadius.ts';
import { KinematicBody } from './KinematicBody.ts';
import { OrbitalEllipse } from './OrbitalEllipse.ts';
import { SphericalBody } from './SphericalBody.ts';

// body that follows an elliptical orbit around a parent described by Keplerian elements
export class KeplerianBody extends KinematicBody {
  public readonly body: CelestialBody;
  private readonly resolution: Vector2;
  private readonly sphere: SphericalBody;
  private readonly ellipse: OrbitalEllipse;
  private readonly radius: FocalRadius;
  private readonly axis: AxisIndicator | null = null;
  private readonly dotRadius: number;

  private visible: boolean = false;
  private hovered: boolean = false;

  constructor(
    scene: Scene,
    resolution: Vector2,
    settings: Settings,
    parent: KeplerianBody | null,
    body: CelestialBody,
    position: Vector3,
    velocity: Vector3
  ) {
    super(body.influencedBy, body.rotation?.siderealPeriod, position, velocity);
    this.body = body;
    this.resolution = resolution;
    this.visible = this.isVisible(settings);
    const color = new Color(body.color);
    this.ellipse = new OrbitalEllipse(scene, resolution, body.elements, parent?.position ?? null, position, color);
    this.radius = new FocalRadius(scene, resolution, parent?.position ?? new Vector3(), position, color);
    this.sphere = new SphericalBody(scene, body, position);
    this.dotRadius = KeplerianBody.getDotRadius(body);
    if (body.rotation != null) {
      this.axis = new AxisIndicator(scene, resolution, this.position, body.rotation.axialTilt, body.radius, color);
    }
  }

  update(settings: Settings, parent: this | null) {
    this.visible = this.isVisible(settings);
    this.sphere.update(this.position, this.rotation, this.visible);
    this.ellipse.update(parent?.position ?? null, this.visible && settings.drawOrbit);

    // apply hover effects (scale body, bold ellipse, etc.)
    const thisIsHovered = settings.hover === this.body.name;
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

  // draw the dot and label for this body
  drawAnnotations(ctx: CanvasRenderingContext2D, camera: OrthographicCamera, metersPerPx: number, drawLabel = true) {
    if (!this.visible) return;

    const [bodyXpx, bodyYpxInverted] = this.getScreenPosition(camera, this.resolution);
    const bodyYpx = this.resolution.y - bodyYpxInverted;

    const label = this.body.shortName ?? this.body.name;
    const fontSize = this.hovered ? '14px' : '12px';
    ctx.font = `${fontSize} ${LABEL_FONT_FAMILY}`;
    const { width: textWidthPx, actualBoundingBoxAscent: textHeightPx } = ctx.measureText(label);
    const textPx: Point2 = [textWidthPx, textHeightPx];
    const canvasPx = getCanvasPixels(ctx);

    // body is off-screen; draw a pointer
    if (isOffScreen([bodyXpx, bodyYpx], [this.resolution.x, this.resolution.y])) {
      drawOffscreenIndicator(ctx, this.body.color, canvasPx, [bodyXpx, bodyYpx]);
    } else {
      const baseRadius = this.body.radius / metersPerPx;
      const bodyRadius = this.hovered ? baseRadius * HOVER_SCALE_FACTOR : baseRadius;
      if (bodyRadius < this.dotRadius) {
        drawDotAtLocation(ctx, this.body.color, [bodyXpx, bodyYpx], this.dotRadius);
      }
      if (drawLabel) {
        const labelRadius = Math.max(bodyRadius, 1) + 5;
        drawLabelAtLocation(ctx, label, this.body.color, [bodyXpx, bodyYpx], textPx, labelRadius);
      }
    }
  }

  // TODO: hide moons of hidden types (e.g. Pluto's moons should only be visible if dwarf planets are visible)
  isVisible(settings: Settings) {
    return (
      settings.hover === this.body.name ||
      settings.center === this.body.name ||
      settings.visibleTypes.has(this.body.type)
    );
  }

  // TODO: dynamically size by actual radius? log scale between ~1-4?
  private static getDotRadius(body: CelestialBody) {
    switch (body.type) {
      case CelestialBodyType.STAR:
        return 3;
      case CelestialBodyType.PLANET:
        return 2.5;
      case CelestialBodyType.MOON:
      case CelestialBodyType.DWARF_PLANET:
        return 2;
      default:
        return 1.5;
    }
  }
}
