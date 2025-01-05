import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Euler,
  Line,
  LineBasicMaterial,
  Material,
  OrthographicCamera,
  Scene,
  Vector2,
  Vector3,
} from 'three';
import { Time } from '../epoch.ts';
import { degreesToRadians, radiansToDegrees } from '../physics.ts';
import { Settings, SpacecraftModelState } from '../state.ts';
import { CelestialBody, Point2, Spacecraft as SpacecraftType, SpacecraftControls } from '../types.ts';
import {
  drawLabelAtLocation,
  drawOffscreenIndicator,
  drawSpacecraftAtLocation,
  getCanvasPixels,
  LABEL_FONT_FAMILY,
} from './canvas.ts';
import { KeplerianBody } from './KeplerianBody.ts';
import { KinematicBody } from './KinematicBody.ts';
import { isOffScreen, vernalEquinox } from './utils.ts';

export class Spacecraft extends KinematicBody {
  private readonly scene: Scene;
  public readonly spacecraft: SpacecraftType;
  private readonly startOn: KeplerianBody;
  private readonly resolution: Vector2;
  private readonly path: Line;

  private readonly orientation: Vector3; // unit vector
  private launched: number | null = null;
  private lastRotation: SpacecraftControls['rotate'] = null;
  private displaySize = 5;

  constructor(
    scene: Scene,
    spacecraft: SpacecraftType,
    bodies: Array<CelestialBody>,
    startOn: KeplerianBody,
    resolution: Vector2
  ) {
    const influencedBy = bodies.map(({ name }) => name);
    super(influencedBy, undefined, startOn.position, startOn.velocity);
    this.scene = scene;
    this.spacecraft = spacecraft;
    this.startOn = startOn;
    this.resolution = resolution;
    this.orientation = new Vector3(...spacecraft.launchDirection);
    // TODO: project path out N days into the future to show trajectory?
    //  - Hard mode: create an ellipse from the current position and velocity
    //  - Easy mode: treat spacecraft as a Sun-dependent body (the Sun doesn't move in this reference system) and
    //     forward propagate the state N times to get future points, then plot those on a spline

    const nPoints = 24 * 30;
    const dt = Time.HOUR;
    const pathPoints = this.projectPathPoints(nPoints, dt);
    const pathSpline = new CatmullRomCurve3(pathPoints, true, 'catmullrom', 0.5);
    const pathSplinePoints = pathSpline.getPoints(nPoints * 2); // 2x points for smoother interpolation
    const pathGeometry = new BufferGeometry().setFromPoints(pathSplinePoints);
    const pathMaterial = new LineBasicMaterial({ color: new Color(spacecraft.color) });
    this.path = new Line(pathGeometry, pathMaterial);
    this.scene.add(this.path);
  }

  increment(parents: Array<{ position: Vector3; velocity: Vector3; mass: number }>, dt: number) {
    if (!this.launched) return;
    super.increment(parents, dt);
  }

  update(time: number, settings: Settings) {
    this.displaySize = settings.hover === this.spacecraft.name ? 10 : 5;
    if (settings.spacecraft == null || !settings.play) return;
    const { controls } = settings.spacecraft;
    const { launch, fire, rotate } = controls;
    if (launch && this.launched == null) {
      this.launch(time);
    }
    if (this.launched == null) return;

    // apply rotation
    const prevRotation = this.lastRotation;
    this.lastRotation = rotate;
    if (rotate != null && prevRotation != rotate) {
      const direction = rotate === 'port' ? 1 : -1;
      const rotation = 30;
      console.log(`rotating ${rotate} by ${rotation * direction}`);
      this.orientation.applyEuler(new Euler(0, 0, degreesToRadians(rotation * direction)));
    }

    // apply thrust
    if (fire) {
      const thrustAcceleration = this.spacecraft.thrust / this.spacecraft.mass;
      const thrustVector = this.orientation.clone();
      this.acceleration.add(thrustVector.multiplyScalar(thrustAcceleration));
      this.velocity.add(thrustVector.multiplyScalar(settings.dt));
      this.position.add(thrustVector.multiplyScalar(settings.dt));
    }
  }

  private launch(time: number) {
    console.log(`launching from ${this.startOn.body.name} at ${time}`);
    const launchDirection = new Vector3(...this.spacecraft.launchDirection);
    // need to start far enough away from the starting body that the initial acceleration from its gravity is reasonable
    const launchPositionOffset = launchDirection.clone().multiplyScalar(this.spacecraft.launchAltitude);
    this.position.copy(this.startOn.position).add(launchPositionOffset);
    const launchVelocity = launchDirection.clone().multiplyScalar(this.spacecraft.launchVelocity);
    this.velocity.copy(this.startOn.velocity).add(launchVelocity);
    this.orientation.copy(this.startOn.velocity).normalize();
    this.launched = time;
  }

  getModelState(): SpacecraftModelState {
    return {
      launchTime: this.launched,
      position: this.position.toArray(),
      velocity: this.velocity.toArray(),
      acceleration: this.acceleration.toArray(),
      orientation: this.orientation.toArray(),
    };
  }

  isVisible() {
    return this.launched != null;
  }

  dispose() {
    this.path.geometry.dispose();
    (this.path.material as Material).dispose();
    this.scene.remove(this.path);
  }

  drawAnnotations(ctx: CanvasRenderingContext2D, camera: OrthographicCamera, drawLabel = true) {
    if (!this.launched) return;

    const [bodyXpx, bodyYpxInverted] = this.getScreenPosition(camera, this.resolution);
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
      const vernalEquinoxVec = vernalEquinox(camera);
      const vernalEquinoxAngle = radiansToDegrees(Math.atan2(vernalEquinoxVec.y, vernalEquinoxVec.x));
      const angle = rotationAngle - vernalEquinoxAngle;
      drawSpacecraftAtLocation(ctx, this.spacecraft.color, [bodyXpx, bodyYpx], angle, this.displaySize);
      if (drawLabel) {
        drawLabelAtLocation(ctx, label, this.spacecraft.color, [bodyXpx, bodyYpx], textPx, this.displaySize + 2);
      }
    }
  }

  private projectPathPoints(nPoints: number, dt: number): Array<Vector3> {
    return [];
  }
}
