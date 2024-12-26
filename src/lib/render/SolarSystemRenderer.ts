import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppState } from '../state.ts';
import { AU, G, SOL, Time } from '../bodies.ts';
import { SCALE_FACTOR } from './constants.ts';
import {
  AmbientLight,
  AxesHelper,
  Color,
  GridHelper,
  OrthographicCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { CelestialBody, CelestialBodyType, Point2, Point3 } from '../types.ts';
import { KeplerianBody } from './KeplerianBody.ts';
import { Belt3D } from './Belt3D.ts';
import { isOffScreen } from './utils.ts';
import { keplerianToCartesian } from '../physics.ts';
import { map } from 'ramda';
import { notNullish } from '../utils.ts';

export class SolarSystemRenderer {
  private readonly scene: Scene;
  private readonly camera: OrthographicCamera;
  private readonly renderer: WebGLRenderer;
  private readonly controls: OrbitControls;
  public bodies: Record<string, KeplerianBody>;
  private readonly belts: Array<Belt3D>;

  private readonly debug = false;
  private readonly maxSafeDt = Time.HOUR;

  constructor(container: HTMLElement, appState: AppState) {
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);

    const ambientLight = new AmbientLight(0x404040); // soft white light
    this.scene.add(ambientLight);
    const sunLight = new PointLight(0xfffff0, 1e5); // slight yellow, high intensity manually tuned
    sunLight.position.set(0, 0, 0); // Position it wherever your sun is
    this.scene.add(sunLight);

    const [w, h] = [window.innerWidth, window.innerHeight];
    this.camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0, SCALE_FACTOR * 10);
    this.setupCamera();

    this.renderer = new WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    while (container.firstChild != null) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.minZoom = 0.001;
    this.controls.maxZoom = 10000;
    this.controls.zoomToCursor = true;

    this.bodies = this.createBodies(appState);

    // TODO: enable if we can get the belts to look better; not great currently
    this.belts = [].map(belt => new Belt3D(this.scene, appState, belt));
    window.addEventListener('resize', this.onWindowResize.bind(this));

    if (this.debug) {
      this.addHelpers();
    }
  }

  // TODO: this doesn't work well currently
  private onWindowResize() {
    this.camera.left = -window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = -window.innerHeight / 2;
    this.camera.updateProjectionMatrix();
  }

  private setupCamera() {
    this.camera.clearViewOffset();
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(0, 0, 1e9);
    this.camera.lookAt(0, 0, 0);
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();
  }

  getMetersPerPixel() {
    const visibleWidth = (this.camera.right - this.camera.left) / this.camera.zoom;
    return (SCALE_FACTOR * visibleWidth) / window.innerWidth;
  }

  getVernalEquinox(): Point3 {
    // the Vernal Equinox is the direction of +X; find by applying matrix transformations from camera
    const localX = new Vector3(1, 0, 0);
    return localX.applyMatrix4(this.camera.matrixWorld).sub(this.camera.position).normalize().toArray();
  }

  update(ctx: CanvasRenderingContext2D, appState: AppState) {
    if (appState.play) this.incrementKinematics(appState.dt);
    this.controls.update();
    this.updateCenter(appState);
    Object.values(this.bodies).forEach(body => {
      const parentState = body.body.elements.wrt != null ? this.bodies[body.body.elements.wrt] : undefined;
      body.update(appState, parentState ?? null);
    });
    this.renderer.render(this.scene, this.camera);
    this.drawLabels(ctx, appState);
  }

  add(appState: AppState, body: CelestialBody) {
    if (Object.keys(this.bodies).some(name => name === body.name)) return; // already exists, don't re-add
    const parents = body.influencedBy.map(name => this.bodies[name]).filter(notNullish);
    // TODO: map into consistent epoch
    this.bodies[body.name] = this.createBodyWithParents(appState, parents, body);
  }

  remove(name: string) {
    const toRemove: KeplerianBody | undefined = this.bodies[name];
    if (name == null || toRemove == null) return; // nothing to do
    delete this.bodies[name];
    toRemove.dispose();
  }

  reset(appState: AppState) {
    this.setupCamera();
    this.controls.reset();
    Object.values(this.bodies).forEach(body => body.dispose());
    this.bodies = this.createBodies(appState);
  }

  dispose() {
    const boundResizeHandler = this.onWindowResize.bind(this);
    window.removeEventListener('resize', boundResizeHandler);

    Object.values(this.bodies).forEach(body => body.dispose());
    this.belts.forEach(belt => belt.dispose());
    this.renderer.dispose();
    this.controls.dispose();
  }

  private createBodies(appState: AppState) {
    const initialState: Record<string, KeplerianBody> = {};
    const toInitialize = [...appState.bodies];
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
          ? this.createBodyWithParents(appState, parents, body)
          : new KeplerianBody(this.scene, appState, null, body, new Vector3(), new Vector3());
    }
    // reverse creation order; first objects created are the highest up in the hierarchy, render them last (on top)
    return Object.fromEntries(Object.entries(initialState).reverse());
  }

  private createBodyWithParents(appState: AppState, parents: Array<KeplerianBody>, body: CelestialBody) {
    const mainParent = parents.find(p => p.body.name === body.elements.wrt) ?? null;
    const mainParentMass = mainParent?.mass ?? 1;
    const cartesian = keplerianToCartesian(body.elements, G * mainParentMass);
    const position = parents.reduce((acc, { position }) => acc.add(position), new Vector3(...cartesian.position));
    const velocity = parents.reduce((acc, { velocity }) => acc.add(velocity), new Vector3(...cartesian.velocity));
    return new KeplerianBody(this.scene, appState, mainParent, body, position, velocity);
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
      body => ({ position: body.position.clone(), velocity: body.velocity.clone(), mass: body.mass }),
      this.bodies
    );
    Object.values(this.bodies).forEach(body => {
      const parents = body.influencedBy.map(name => parentStates[name]);
      body.increment(parents, dt);
    });
  }

  private drawLabels(ctx: CanvasRenderingContext2D, { drawLabel }: AppState) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (drawLabel) {
      const metersPerPx = this.getMetersPerPixel();
      Object.values(this.bodies).forEach(body => {
        body.drawLabel(ctx, this.camera, metersPerPx);
      });
    }
  }

  private updateCenter({ center }: AppState) {
    if (center == null || center == SOL.name) return;
    const centerBody = this.bodies[center];
    if (centerBody != null) {
      const { position } = centerBody;
      const { x, y, z } = position;
      this.controls.target.set(x / SCALE_FACTOR, y / SCALE_FACTOR, z / SCALE_FACTOR);
    }
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
    let closest: KeplerianBody | undefined = undefined;
    let closestDistance = threshold;
    for (const body of Object.values(this.bodies).reverse()) {
      // ignore invisible types and offscreen bodies
      if (!visibleTypes.has(body.body.type)) continue;
      const [bodyXpx, bodyYpx] = body.getScreenPosition(this.camera);
      if (isOffScreen(bodyXpx, bodyYpx, threshold)) continue;

      // always give precedence to the sun
      const distance = Math.sqrt((xPx - bodyXpx) ** 2 + (yPx - bodyYpx) ** 2);
      if (distance < threshold && body.body.type === 'star') return body;

      // only give precedence to non-moons, but still select moons if there are no other options
      const bodyIsMoon = body.body.type === 'moon';
      const closestIsMoon = closest?.body?.type === 'moon';
      if (distance < closestDistance && (!bodyIsMoon || closestIsMoon || closest == null)) {
        closest = body;
        closestDistance = distance;
      }
    }
    return closest;
  }
}
