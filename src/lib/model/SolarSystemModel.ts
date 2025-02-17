import { map } from 'ramda';
import { AmbientLight, Light, OrthographicCamera, PointLight, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { getCanvasPixels, isOffScreen } from '../canvas.ts';
import { ORBITAL_REGIMES } from '../data/regimes.ts';
import { SPACECRAFT_BY_ID } from '../data/spacecraft/spacecraft.ts';
import { Time } from '../epoch.ts';
import { convertToEpoch, G, keplerianToCartesian } from '../physics.ts';
import { ModelState, Settings } from '../state.ts';
import {
  CelestialBody,
  CelestialBodyId,
  CelestialBodyType,
  isCelestialBodyId,
  isSpacecraftId,
  Point2,
  Point3,
} from '../types.ts';
import { notNullish } from '../utils.ts';
import { CAMERA_INIT, SCALE_FACTOR, SUNLIGHT_COLOR } from './constants.ts';
import { Firmament } from './Firmament.ts';
import { FrameRateCounter } from './FrameRateCounter.ts';
import { KeplerianBody } from './KeplerianBody.ts';
import { OrbitalRegime } from './OrbitalRegime.ts';

export class SolarSystemModel {
  private readonly scene: Scene;
  private readonly resolution: Vector2;
  private readonly camera: OrthographicCamera;
  private readonly controls: OrbitControls;
  private readonly renderer: WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly lights: Array<Light>;
  private readonly firmament: Firmament;
  private readonly regimes: Array<OrbitalRegime>;
  private readonly fpsCounter: FrameRateCounter;
  private time: number = 0;
  private bodies: Record<CelestialBodyId, KeplerianBody>;

  private tmp: Vector3 = new Vector3(); // reuse for efficiency
  private lockedCenter: string | null = null;
  private readonly maxSafeDt = Time.MINUTE * 15;

  constructor(container: HTMLElement, settings: Settings) {
    this.scene = new Scene();
    this.resolution = new Vector2(container.clientWidth, container.clientHeight);
    this.fpsCounter = new FrameRateCounter();

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
    this.controls.keyPanSpeed = 10; // pixels per second
    this.controls.listenToKeyEvents(window);

    this.bodies = this.createBodies(settings);
    this.firmament = new Firmament(this.resolution);
    this.regimes = Object.values(ORBITAL_REGIMES).map(regime => new OrbitalRegime(this.scene, settings, regime));

    const renderScene = new RenderPass(this.scene, this.camera);
    renderScene.clear = false;
    const bloomPass = new UnrealBloomPass(this.resolution, 1, 1, 0);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.firmament.renderPass);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
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

  getMetersPerPixel() {
    const visibleWidth = (this.camera.right - this.camera.left) / this.camera.zoom;
    return (SCALE_FACTOR * visibleWidth) / this.resolution.width;
  }

  getVernalEquinox(): Point3 {
    // the Vernal Equinox is the direction of +X; find by applying matrix transformations from camera
    return this.tmp.set(1, 0, 0).applyMatrix4(this.camera.matrixWorld).sub(this.camera.position).normalize().toArray();
  }

  getModelState(): ModelState {
    return {
      time: this.time,
      fps: this.fpsCounter.fps(),
      metersPerPx: this.getMetersPerPixel(),
      vernalEquinox: this.getVernalEquinox(),
    };
  }

  update(settings: Settings, ctx: CanvasRenderingContext2D) {
    this.fpsCounter.update();
    const fps = this.fpsCounter.fps();
    if (fps == null) return; // still initializing
    if (settings.play) this.incrementKinematics((1 / fps) * settings.speed);
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
    if (Object.keys(this.bodies).some(s => s === body.id)) return; // already exists, don't re-add
    const parents = body.influencedBy.map(id => this.bodies[id]).filter(notNullish);
    this.bodies[body.id] = this.createBodyWithParents(settings, parents, body);
  }

  remove(id: CelestialBodyId): void {
    const toRemove: KeplerianBody | undefined = this.bodies[id];
    if (id == null || toRemove == null) return; // nothing to do
    delete this.bodies[id];
    toRemove.dispose();
  }

  reset(settings: Settings, camera = true) {
    this.time = 0;
    if (camera) {
      this.setupCamera();
      this.controls.reset();
    }
    Object.values(this.bodies).forEach(body => body.dispose());
    this.bodies = this.createBodies(settings);
  }

  dispose() {
    Object.values(this.bodies).forEach(body => body.dispose());
    this.lights.forEach(light => light.dispose());
    this.firmament.dispose();
    this.regimes.forEach(regime => regime.dispose());
    this.renderer.dispose();
    this.controls.stopListenToKeyEvents();
    this.controls.dispose();
  }

  findCloseBody([xPx, yPx]: Point2, settings: Settings, threshold = 10) {
    const metersPerPx = this.getMetersPerPixel();
    let closest: KeplerianBody | undefined = undefined;
    let closestDistance = Infinity;
    for (const body of Object.values(this.bodies).reverse()) {
      // account for the displayed size of the body
      const bodyThreshold = threshold + body.body.radius / metersPerPx;

      // ignore invisible types and offscreen bodies
      if (!body.isVisible(settings)) continue;
      const [bodyXpx, bodyYpx] = body.getScreenPosition(this.camera, this.resolution);
      if (isOffScreen([bodyXpx, bodyYpx], [this.resolution.x, this.resolution.y], bodyThreshold)) continue;

      // only give precedence to non-moons, but still select moons if there are no other options
      const [distance, isNear] = body.isNearCursor([xPx, yPx], this.camera, settings.drawLabel, bodyThreshold);
      const bodyIsMoon = body.body.type === CelestialBodyType.MOON;
      const closestIsMoon = closest?.body?.type === CelestialBodyType.MOON;
      if (isNear && distance < closestDistance && (!bodyIsMoon || closestIsMoon || closest == null)) {
        closest = body;
        closestDistance = distance;
      }
    }
    return closest;
  }

  private createBodies(settings: Settings) {
    const initialState: Record<string, KeplerianBody> = {};
    const toInitialize = [...settings.bodies];
    // note that this will loop indefinitely if there are any cycles in the graph described by body.influencedBy
    while (toInitialize.length > 0) {
      const body = toInitialize.shift()!;
      const parents = body.influencedBy.map(id => initialState[id]);
      if (parents.some(p => p == null)) {
        toInitialize.push(body);
        continue;
      }
      initialState[body.id] =
        parents.length > 0
          ? this.createBodyWithParents(settings, parents, body)
          : new KeplerianBody(this.scene, this.resolution, settings, null, body, new Vector3(), new Vector3());
    }
    // reverse creation order; first objects created are the highest up in the hierarchy, model them last (on top)
    return Object.fromEntries(Object.entries(initialState).reverse());
  }

  private createBodyWithParents(settings: Settings, parents: Array<KeplerianBody>, body: CelestialBody) {
    const mainParent = parents.find(p => p.body.id === body.elements.wrt) ?? null;
    const mainParentMass = mainParent?.body?.mass ?? 1;
    const elementsInEpoch =
      mainParent != null ? convertToEpoch(body.elements, mainParentMass, settings.epoch) : body.elements;
    const cartesian = keplerianToCartesian(elementsInEpoch, G * mainParentMass);
    const position = parents.reduce((acc, { position }) => acc.add(position), new Vector3(...cartesian.position));
    const velocity = parents.reduce((acc, { velocity }) => acc.add(velocity), new Vector3(...cartesian.velocity));
    const bodyInEpoch = { ...body, elements: elementsInEpoch };
    return new KeplerianBody(this.scene, this.resolution, settings, mainParent, bodyInEpoch, position, velocity);
  }

  private incrementKinematics(dt: number) {
    // subdivide dt to a 'safe' value -- orbits with smaller periods can fall apart at high dt
    // TODO: this algorithm could be improved; 1 hour is not always safe for e.g. LEO satellites of Earth, which have
    //  orbital periods of ~90 minutes. It is also overzealous to subdivide like this for orbits with longer periods
    this.time += dt;
    const nIterations = Math.ceil(Math.abs(dt) / this.maxSafeDt);
    const safeDt = dt / nIterations;
    Array(nIterations)
      .fill(null)
      .forEach(() => this.incrementKinematicsSafe(safeDt));
  }

  private incrementKinematicsSafe(dt: number) {
    // TODO: improve performance by removing cloning; can achieve by incrementing children before parents, running the
    //  opposite algorithm to the one performed during initialization
    const parentStates = map(({ position, body }) => ({ position: position.clone(), mass: body.mass }), this.bodies);
    Object.values(this.bodies).forEach(body => {
      const parents = body.influencedBy.map(id => parentStates[id]);
      body.increment(parents, dt);
    });
  }

  private drawAnnotations(ctx: CanvasRenderingContext2D, settings: Settings) {
    ctx.clearRect(0, 0, this.resolution.x, this.resolution.y);
    const metersPerPx = this.getMetersPerPixel();
    const canvasPx = getCanvasPixels(ctx);
    Object.values(this.bodies)
      .map<[KeplerianBody, number]>(body => {
        const distance = !body.isVisible(settings)
          ? -1 // skip invisible bodies
          : body.body.id === settings.center
            ? 2 // center body should be drawn near top
            : body.body.id === settings.hover
              ? 1 // hover body should be always top
              : this.tmp.copy(body.position).divideScalar(SCALE_FACTOR).sub(this.camera.position).length(); // use distance to camera
        return [body, distance];
      })
      .filter(([, distance]) => distance > 0)
      .sort(([, aDistance], [, bDistance]) => bDistance - aDistance)
      .forEach(([body]) => {
        body.drawAnnotations(ctx, this.camera, metersPerPx, canvasPx, settings.drawLabel);
      });
  }

  private updateCenter(settings: Settings) {
    // special handling for spacecraft -- center on the specified focusId when present
    const center = isSpacecraftId(settings.center)
      ? SPACECRAFT_BY_ID[settings.center]?.focusId
      : isCelestialBodyId(settings.center)
        ? settings.center
        : undefined;
    this.controls.zoomToCursor = center == null; // when center is set, zoom to body instead of cursor
    if (center == null) {
      this.lockedCenter = null;
      return;
    }
    const centerBody = this.bodies[center];
    if (centerBody == null) return;
    const vector = this.controls.target.clone().multiplyScalar(SCALE_FACTOR).sub(centerBody.position);
    const distance = vector.length();
    const metersPerPx = this.getMetersPerPixel();
    const travel = Math.max(5 * metersPerPx, 0.1 * distance); // travel 5px or 10% of the distance each step
    if (center === this.lockedCenter || distance < travel) {
      this.controls.target.copy(centerBody.position).divideScalar(SCALE_FACTOR);
      this.lockedCenter = center; // once we've reached the body, "lock" to it to avoid chasing it if it moves quickly
    } else {
      this.controls.target.add(vector.normalize().multiplyScalar(-travel / SCALE_FACTOR));
    }
  }

  private setupCamera() {
    this.camera.clearViewOffset();
    this.camera.up.set(...CAMERA_INIT.up);
    this.camera.position.set(...CAMERA_INIT.position);
    this.camera.lookAt(...CAMERA_INIT.lookAt);
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();
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
