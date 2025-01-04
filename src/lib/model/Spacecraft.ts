import { OrthographicCamera, Vector2, Vector3 } from 'three';
import { Settings } from '../state.ts';
import { CelestialBody, Point2, Spacecraft as SpacecraftType } from '../types.ts';
import {
  drawDotAtLocation,
  drawLabelAtLocation,
  drawOffscreenIndicator,
  getCanvasPixels,
  LABEL_FONT_FAMILY,
} from './canvas.ts';
import { SCALE_FACTOR } from './constants.ts';
import { KeplerianBody } from './KeplerianBody.ts';
import { KinematicBody } from './KinematicBody.ts';
import { isOffScreen } from './utils.ts';

export class Spacecraft extends KinematicBody {
  private readonly spacecraft: SpacecraftType;
  private readonly startOn: KeplerianBody;
  private readonly resolution: Vector2;

  private screenPosition: Vector3 = new Vector3();
  private launched: boolean = false;

  constructor(spacecraft: SpacecraftType, bodies: Array<CelestialBody>, startOn: KeplerianBody, resolution: Vector2) {
    const influencedBy = bodies.map(({ name }) => name);
    super(influencedBy, undefined, startOn.position, startOn.velocity);
    this.spacecraft = spacecraft;
    this.startOn = startOn;
    this.resolution = resolution;
  }

  increment(parents: Array<{ position: Vector3; velocity: Vector3; mass: number }>, dt: number) {
    if (!this.launched) return;
    super.increment(parents, dt);
  }

  update(settings: Settings) {
    if (settings.spacecraft == null) return;
    const { controls } = settings.spacecraft;
    const { launch, fire } = controls;
    if (launch && !this.launched) {
      console.log(`launching from ${this.startOn.body.name}`);
      this.launch();
    }
    if (fire) {
      console.log(`firing with ${this.spacecraft.thrust} N`);
    }
  }

  private launch() {
    const launchDirection = new Vector3(...this.spacecraft.launchDirection);
    const launchPositionOffset = launchDirection.clone().multiplyScalar(this.startOn.body.radius);
    this.position.copy(this.startOn.position).add(launchPositionOffset);
    const launchVelocity = launchDirection.clone().multiplyScalar(this.spacecraft.launchVelocity);
    this.velocity.copy(this.startOn.velocity).add(launchVelocity);
    this.launched = true;
  }

  dispose() {
    // TODO
  }

  // TODO: this is mostly posta from KeplerianBody
  private getScreenPosition(camera: OrthographicCamera): Point2 {
    this.screenPosition.copy(this.position).divideScalar(SCALE_FACTOR).project(camera);
    const pixelX = ((this.screenPosition.x + 1) * this.resolution.x) / 2;
    const pixelY = ((1 - this.screenPosition.y) * this.resolution.y) / 2;
    return [pixelX, pixelY]; // return pixel values
  }

  drawAnnotations(ctx: CanvasRenderingContext2D, camera: OrthographicCamera, drawLabel = true) {
    if (!this.launched) return;

    const [bodyXpx, bodyYpxInverted] = this.getScreenPosition(camera);
    const bodyYpx = this.resolution.y - bodyYpxInverted;

    const label = this.spacecraft.name;
    const fontSize = '12px';
    ctx.font = `${fontSize} ${LABEL_FONT_FAMILY}`;
    const { width: textWidthPx, actualBoundingBoxAscent: textHeightPx } = ctx.measureText(label);
    const textPx: Point2 = [textWidthPx, textHeightPx];
    const canvasPx = getCanvasPixels(ctx);

    // body is off-screen; draw a pointer
    if (isOffScreen([bodyXpx, bodyYpx], [this.resolution.x, this.resolution.y])) {
      drawOffscreenIndicator(ctx, this.spacecraft.color, canvasPx, [bodyXpx, bodyYpx]);
    } else {
      const dotRadius = 5;
      drawDotAtLocation(ctx, this.spacecraft.color, [bodyXpx, bodyYpx], dotRadius);
      if (drawLabel) {
        drawLabelAtLocation(ctx, label, this.spacecraft.color, [bodyXpx, bodyYpx], textPx, dotRadius + 5);
      }
    }
  }
}
