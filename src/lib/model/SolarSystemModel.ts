import { map } from 'ramda';
import {
  AmbientLight,
  AxesHelper,
  GridHelper,
  Light,
  OrthographicCamera,
  PointLight,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { AU, SOL } from '../bodies.ts';
import { Time } from '../epoch.ts';
import { convertToEpoch, G, keplerianToCartesian } from '../physics.ts';
import { ORBITAL_REGIMES } from '../regimes.ts';
import { Settings } from '../state.ts';
import { CelestialBody, CelestialBodyType, Point2, Point3 } from '../types.ts';
import { notNullish } from '../utils.ts';
import { CAMERA_INIT, SCALE_FACTOR, SUNLIGHT_COLOR } from './constants.ts';
import { Firmament } from './Firmament.ts';
import { KeplerianBody } from './KeplerianBody.ts';
import { OrbitalRegime } from './OrbitalRegime.ts';
import { isOffScreen } from './utils.ts';

export class SolarSystemModel {
  private readonly scene: Scene;
  private readonly resolution: Vector2;
  private readonly camera: OrthographicCamera;
  private readonly controls: OrbitControls;
  private readonly renderer: WebGLRenderer;
  private readonly composer: EffectComposer;
  private bodies: Record<string, KeplerianBody>;
  private readonly firmament: Firmament;
  private readonly regimes: Array<OrbitalRegime>;
  private readonly lights: Array<Light>;

  private readonly debug = false;
  private readonly maxSafeDt = Time.MINUTE * 15;

  constructor(container: HTMLElement, settings: Settings) {
    this.scene = new Scene();
    this.resolution = new Vector2(container.clientWidth, container.clientHeight);

    const sunLight = new PointLight(SUNLIGHT_COLOR, 1e5); // high intensity manually tuned
    sunLight.position.set(0, 0, 0);
    this.lights = [new AmbientLight(SUNLIGHT_COLOR, 0.5), sunLight];
    this.lights.forEach(light => this.scene.add(light));

    this.renderer = new WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    this.renderer.setSize(this.resolution.x, this.resolution.y);
    this.setupRenderer(container);

    const [w, h] = [this.resolution.x, this.resolution.y];
    this.camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0, SCALE_FACTOR * 10);
    this.setupCamera();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.minZoom = 1e-3;
    this.controls.maxZoom = 1e4;
    this.controls.zoomToCursor = true;

    this.bodies = this.createBodies(settings);
    this.firmament = new Firmament(this.resolution);
    this.regimes = ORBITAL_REGIMES.map(regime => new OrbitalRegime(this.scene, settings, regime));

    const renderScene = new RenderPass(this.scene, this.camera);
    renderScene.clear = false;
    const bloomPass = new UnrealBloomPass(this.resolution, 1, 1, 0);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.firmament.renderPass);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);

    if (this.debug) {
      this.addHelpers();
    }
  }

  resize(container: HTMLElement) {
    this.setupRenderer(container);
    const [width, height] = [container.clientWidth, container.clientHeight];
    this.composer.setSize(width, height);
    this.resolution.set(width, height);
    this.firmament.resize(width, height);
    this.camera.left = -width / 2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = -height / 2;
    this.camera.updateProjectionMatrix();
  }

  private setupCamera() {
    this.camera.clearViewOffset();
    this.camera.up.set(...CAMERA_INIT.up);
    this.camera.position.set(...CAMERA_INIT.position);
    this.camera.lookAt(...CAMERA_INIT.lookAt);
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();
  }

  getMetersPerPixel() {
    const visibleWidth = (this.camera.right - this.camera.left) / this.camera.zoom;
    return (SCALE_FACTOR * visibleWidth) / this.resolution.width;
  }

  getVernalEquinox(): Point3 {
    // the Vernal Equinox is the direction of +X; find by applying matrix transformations from camera
    const localX = new Vector3(1, 0, 0); // TODO: no new allocation
    return localX.applyMatrix4(this.camera.matrixWorld).sub(this.camera.position).normalize().toArray();
  }

  update(ctx: CanvasRenderingContext2D, settings: Settings) {
    if (settings.play) this.incrementKinematics(settings.dt);
    this.updateCenter(settings); // NOTE: must happen after kinematics are incremented and before controls are updated
    this.controls.update();
    this.firmament.update(this.camera.position, this.controls.target);
    this.regimes.forEach(regime => regime.update(settings));
    Object.values(this.bodies).forEach(body => {
      const parentState = body.body.elements.wrt != null ? this.bodies[body.body.elements.wrt] : undefined;
      body.update(settings, parentState ?? null);
    });
    this.composer.render();
    this.drawAnnotations(ctx, settings);
  }

  add(settings: Settings, body: CelestialBody) {
    if (Object.keys(this.bodies).some(name => name === body.name)) return; // already exists, don't re-add
    const parents = body.influencedBy.map(name => this.bodies[name]).filter(notNullish);
    this.bodies[body.name] = this.createBodyWithParents(settings, parents, body);
  }

  remove(name: string) {
    const toRemove: KeplerianBody | undefined = this.bodies[name];
    if (name == null || toRemove == null) return; // nothing to do
    delete this.bodies[name];
    toRemove.dispose();
  }

  reset(settings: Settings) {
    this.setupCamera();
    this.controls.reset();
    Object.values(this.bodies).forEach(body => body.dispose());
    this.bodies = this.createBodies(settings);
  }

  dispose() {
    Object.values(this.bodies).forEach(body => body.dispose());
    this.lights.forEach(light => light.dispose());
    this.firmament.dispose();
    this.regimes.forEach(regime => regime.dispose());
    this.renderer.dispose();
    this.controls.dispose();
  }

  private createBodies(settings: Settings) {
    const initialState: Record<string, KeplerianBody> = {};
    const toInitialize = [...settings.bodies];
    // note that this will loop indefinitely if there are any cycles in the graph described by body.influencedBy
    while (toInitialize.length > 0) {
      const body = toInitialize.shift()!;
      const parents = body.influencedBy.map(name => initialState[name]);
      if (parents.some(p => p == null)) {
        toInitialize.push(body);
        continue;
      }
      initialState[body.name] =
        parents.length > 0
          ? this.createBodyWithParents(settings, parents, body)
          : new KeplerianBody(this.scene, this.resolution, settings, null, body, new Vector3(), new Vector3());
    }
    // reverse creation order; first objects created are the highest up in the hierarchy, model them last (on top)
    return Object.fromEntries(Object.entries(initialState).reverse());
  }

  private createBodyWithParents(settings: Settings, parents: Array<KeplerianBody>, body: CelestialBody) {
    const mainParent = parents.find(p => p.body.name === body.elements.wrt) ?? null;
    const mainParentMass = mainParent?.body?.mass ?? 1;
    const elementsInEpoch =
      mainParent != null ? convertToEpoch(body.elements, mainParentMass, settings.epoch) : body.elements;
    const cartesian = keplerianToCartesian(elementsInEpoch, G * mainParentMass);
    const position = parents.reduce((acc, { position }) => acc.add(position), new Vector3(...cartesian.position));
    const velocity = parents.reduce((acc, { velocity }) => acc.add(velocity), new Vector3(...cartesian.velocity));
    // TODO: conditionally excluding the sun is a little gross
    const parent = mainParent?.body?.name === SOL.name ? null : mainParent;
    return new KeplerianBody(this.scene, this.resolution, settings, parent, body, position, velocity);
  }

  private incrementKinematics(dt: number) {
    // subdivide dt to a 'safe' value -- orbits with smaller periods can fall apart at high dt
    // TODO: this algorithm could be improved; 1 hour is not always safe for e.g. LEO satellites of Earth, which have
    //  orbital periods of ~90 minutes. It is also overzealous to subdivide like this for orbits with longer periods
    const nIterations = Math.ceil(dt / this.maxSafeDt);
    const safeDt = dt / nIterations;
    Array(nIterations)
      .fill(null)
      .forEach(() => this.incrementKinematicsSafe(safeDt));
  }

  private incrementKinematicsSafe(dt: number) {
    // TODO: improve performance by removing cloning; can achieve by incrementing children before parents, running the
    //  opposite algorithm to the one performed during initialization
    const parentStates = map(
      ({ position, velocity, body }) => ({ position: position.clone(), velocity: velocity.clone(), mass: body.mass }),
      this.bodies
    );
    Object.values(this.bodies).forEach(body => {
      const parents = body.influencedBy.map(name => parentStates[name]);
      body.increment(parents, dt);
    });
  }

  private drawAnnotations(ctx: CanvasRenderingContext2D, { hover, drawLabel }: Settings) {
    ctx.clearRect(0, 0, this.resolution.x, this.resolution.y);
    const metersPerPx = this.getMetersPerPixel();
    Object.values(this.bodies).forEach(body => {
      body.drawAnnotations(ctx, this.camera, metersPerPx, drawLabel);
    });
    const hoverBody = this.bodies[hover ?? ''];
    if (hoverBody != null) {
      hoverBody.drawAnnotations(ctx, this.camera, metersPerPx);
    }
  }

  private updateCenter({ center }: Settings) {
    if (center == null) return;
    const centerBody = this.bodies[center];
    if (centerBody == null) return;
    this.controls.target.copy(centerBody.position).divideScalar(SCALE_FACTOR);
  }

  private addHelpers() {
    const axesHelper = new AxesHelper(AU / SCALE_FACTOR);
    axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff);
    this.scene.add(axesHelper);
    const gridHelper = new GridHelper((AU * 1000) / SCALE_FACTOR, 100);
    gridHelper.rotateX(Math.PI / 2);
    this.scene.add(gridHelper);
  }

  findCloseBody([xPx, yPx]: Point2, visibleTypes: Set<CelestialBodyType>, threshold = 10): KeplerianBody | undefined {
    const metersPerPx = this.getMetersPerPixel();
    let closest: KeplerianBody | undefined = undefined;
    let closestDistance = Infinity;
    for (const body of Object.values(this.bodies).reverse()) {
      // account for the displayed size of the body
      const bodyThreshold = threshold + body.body.radius / metersPerPx;

      // ignore invisible types and offscreen bodies
      if (!visibleTypes.has(body.body.type)) continue;
      const [bodyXpx, bodyYpx] = body.getScreenPosition(this.camera);
      if (isOffScreen([bodyXpx, bodyYpx], [this.resolution.x, this.resolution.y], bodyThreshold)) continue;

      // always give precedence to the sun
      const distance = Math.sqrt((xPx - bodyXpx) ** 2 + (yPx - bodyYpx) ** 2);
      if (distance < bodyThreshold && body.body.type === 'star') return body;

      // only give precedence to non-moons, but still select moons if there are no other options
      const bodyIsMoon = body.body.type === 'moon';
      const closestIsMoon = closest?.body?.type === 'moon';
      if (distance < bodyThreshold && distance < closestDistance && (!bodyIsMoon || closestIsMoon || closest == null)) {
        closest = body;
        closestDistance = distance;
      }
    }
    return closest;
  }

  private setupRenderer(container: HTMLElement) {
    const [width, height] = [container.clientWidth, container.clientHeight];
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    while (container.firstChild != null) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(this.renderer.domElement);
  }
}
