import { OrthographicCamera, Vector2, Vector3 } from 'three';
import { radiansToDegrees } from '../physics.ts';
import { Settings } from '../state.ts';
import { CelestialBody, Point2, Point3, Spacecraft as SpacecraftType } from '../types.ts';
import {
  drawLabelAtLocation,
  drawOffscreenIndicator,
  drawSpacecraftAtLocation,
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
  private readonly orientation: Vector3; // unit vector

  private screenPosition: Vector3 = new Vector3();
  private launched: boolean = false;

  constructor(spacecraft: SpacecraftType, bodies: Array<CelestialBody>, startOn: KeplerianBody, resolution: Vector2) {
    const influencedBy = bodies.map(({ name }) => name);
    super(influencedBy, undefined, startOn.position, startOn.velocity);
    this.spacecraft = spacecraft;
    this.startOn = startOn;
    this.resolution = resolution;
    this.orientation = new Vector3(...spacecraft.launchDirection);
  }

  increment(parents: Array<{ position: Vector3; velocity: Vector3; mass: number }>, dt: number) {
    if (!this.launched) return;
    super.increment(parents, dt);
  }

  update(settings: Settings) {
    if (settings.spacecraft == null || !settings.play) return;
    const { controls } = settings.spacecraft;
    const { launch, fire, rotate } = controls;
    if (launch && !this.launched) {
      console.log(`launching from ${this.startOn.body.name}`);
      this.launch();
    }
    if (rotate != null && this.launched) {
      const direction: Point3 =
        rotate === 'east' ? [1, 0, 0] : rotate === 'north' ? [0, 1, 0] : rotate === 'west' ? [-1, 0, 0] : [0, -1, 0];
      this.orientation.set(...direction);
    }
    if (fire && this.launched) {
      const thrustAcceleration = this.spacecraft.thrust / this.spacecraft.mass;
      console.log(`firing with ${thrustAcceleration} m/s2`);
      const thrustVector = this.orientation.clone();
      this.velocity.add(thrustVector.multiplyScalar(thrustAcceleration * settings.dt));
      this.position.add(thrustVector.multiplyScalar(settings.dt));
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
      const rotationAngle = radiansToDegrees(Math.atan2(this.orientation.y, this.orientation.x));
      drawSpacecraftAtLocation(ctx, this.spacecraft.color, [bodyXpx, bodyYpx], rotationAngle);
      if (drawLabel) {
        drawLabelAtLocation(ctx, label, this.spacecraft.color, [bodyXpx, bodyYpx], textPx, 10);
      }
    }
  }
}
