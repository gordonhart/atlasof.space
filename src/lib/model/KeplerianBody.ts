import { Box2, OrthographicCamera, Scene, Vector2, Vector3 } from 'three';
import { isXs } from '../../hooks/useDisplaySize.ts';
import {
  drawDotAtLocation,
  drawLabelAtLocation,
  drawOffscreenIndicator,
  isLabelFontAvailable,
  isOffScreen,
  LABEL_FONT_FAMILY,
} from '../canvas.ts';
import { magnitude } from '../physics.ts';
import { Settings } from '../state.ts';
import { CelestialBody, CelestialBodyType, Point2 } from '../types.ts';
import { AxisIndicator } from './AxisIndicator.ts';
import { HOVER_SCALE_FACTOR, MIN_ORBIT_PX_LABEL_VISIBLE } from './constants.ts';
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
  private readonly labelBox = new Box2();
  private readonly screenPoint = new Vector2(); // reuse for efficiency
  private readonly labelSize: Record<string /* font */, [number, number] /* w, h */> = {}; // cache for efficiency

  private visible: boolean = false;
  private hovered: boolean = false;
  private focused: boolean = false;

  constructor(
    scene: Scene,
    resolution: Vector2,
    settings: Settings,
    parent: KeplerianBody | null,
    body: CelestialBody,
    position: Vector3,
    velocity: Vector3
  ) {
    super(body.influencedBy, position, velocity, body.elements.rotation);
    this.body = body;
    this.resolution = resolution;
    this.visible = this.isVisible(settings);
    this.ellipse = new OrbitalEllipse(scene, resolution, body, parent?.position ?? null, position);
    this.radius = new FocalRadius(scene, resolution, body, parent?.position ?? new Vector3(), position);
    this.sphere = new SphericalBody(scene, body, position);
    this.dotRadius = KeplerianBody.getDotRadius(body);
    if (body.elements.rotation != null) {
      this.axis = new AxisIndicator(scene, resolution, body, this.position);
    }
  }

  update(settings: Settings, parent: this | null) {
    this.visible = this.isVisible(settings);
    this.focused = settings.center === this.body.id;
    this.sphere.update(this.position, this.rotation, this.visible);
    this.ellipse.update(parent?.position ?? null, this.visible && settings.drawOrbit);

    // apply hover effects (scale body, bold ellipse, etc.)
    const thisIsHovered = settings.hover === this.body.id;
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
  drawAnnotations(
    ctx: CanvasRenderingContext2D,
    camera: OrthographicCamera,
    metersPerPx: number,
    canvasPx: Point2,
    drawLabel = true
  ) {
    if (!this.visible) return;

    const [bodyXpx, bodyYpxInverted] = this.getScreenPosition(camera, this.resolution);
    const bodyPx: Point2 = [bodyXpx, this.resolution.y - bodyYpxInverted];

    const label = this.body.shortName ?? this.body.name;
    const fontSize = this.hovered ? '14px' : '12px';
    ctx.font = `${fontSize} ${LABEL_FONT_FAMILY}`;
    let textPx = this.labelSize[ctx.font];
    if (textPx == null) {
      const { width: textWidthPx, actualBoundingBoxAscent: textHeightPx } = ctx.measureText(label);
      // ensure we are only caching once the primary label font becomes available
      if (isLabelFontAvailable(ctx)) this.labelSize[ctx.font] = [textWidthPx, textHeightPx];
      textPx = [textWidthPx, textHeightPx];
    }

    const textColor = this.body.style.fgColor;
    const strokeColor = this.body.style.bgColor ?? this.body.style.fgColor;

    // body is off-screen; draw a pointer
    if (isOffScreen(bodyPx, [this.resolution.x, this.resolution.y])) {
      // TODO: how to always draw moon offscreen indicators underneath parent? better yet, don't draw offscreen
      //  indicators for moons when the parent isn't visible
      if (!isXs()) {
        drawOffscreenIndicator(ctx, strokeColor, canvasPx, bodyPx);
      }
    } else {
      const baseRadius = this.body.radius / metersPerPx;
      const bodyRadius = this.hovered ? baseRadius * HOVER_SCALE_FACTOR : baseRadius;
      if (bodyRadius < this.dotRadius && this.shouldDrawDot(metersPerPx)) {
        drawDotAtLocation(ctx, textColor, bodyPx, this.dotRadius);
      } else {
        this.sphere.ensureTextureLoaded(); // since the body is visible, ensure that its texture is loaded
      }
      if ((drawLabel || this.hovered) && this.shouldDrawLabel(metersPerPx)) {
        const labelRadius = Math.max(bodyRadius, 1) + 5;
        const [p0, p1] = drawLabelAtLocation(ctx, label, textColor, strokeColor, bodyPx, textPx, labelRadius);
        this.labelBox.min.x = Math.min(p0[0], p1[0]);
        this.labelBox.min.y = Math.min(p0[1], p1[1]);
        this.labelBox.max.x = Math.max(p0[0], p1[0]);
        this.labelBox.max.y = Math.max(p0[1], p1[1]);
      }
    }
  }

  isNearCursor(
    [xPx, yPx]: Point2,
    camera: OrthographicCamera,
    includeLabel: boolean,
    threshold = 10
  ): [number, boolean] {
    const [bodyXpx, bodyYpx] = this.getScreenPosition(camera, this.resolution);
    const distance = magnitude([xPx - bodyXpx, yPx - bodyYpx]);
    const bodyIsNear = distance < threshold;
    // TODO: labels are slightly non-rectangular -- check the actual label polygon if the pointer is within the box?
    // TODO: when you hover over a body, its radius grows and the label can be offset -- can lead to flickeriness
    const labelIsNear = includeLabel && this.labelBox.containsPoint(this.screenPoint.set(xPx, yPx));
    return [distance, bodyIsNear || labelIsNear];
  }

  // TODO: hide moons of hidden types (e.g. Pluto's moons should only be visible if dwarf planets are visible)
  isVisible(settings: Settings) {
    const id = this.body.id;
    return settings.hover === id || settings.center === id || settings.visibleTypes.has(this.body.type);
  }

  // show dot only when the orbit is larger than the dot itself; helps selectively hide moons until zoomed
  private shouldDrawDot(metersPerPx: number) {
    const longAxisPx = (this.body.elements.semiMajorAxis * 2) / metersPerPx;
    const isStar = this.body.type === CelestialBodyType.STAR; // always draw for stars
    return this.focused || this.hovered || isStar || (this.visible && longAxisPx > this.dotRadius);
  }

  // progressively hide labels as you zoom out, prioritizing certain types (e.g. planets) over others (e.g. asteroids)
  private shouldDrawLabel(metersPerPx: number) {
    const longAxisPx = (this.body.elements.semiMajorAxis * 2) / metersPerPx;
    const minLongAxisPx = MIN_ORBIT_PX_LABEL_VISIBLE[this.body.type];
    return this.focused || this.hovered || (this.visible && longAxisPx > minLongAxisPx);
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
