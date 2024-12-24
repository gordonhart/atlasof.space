import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppState } from '../state.ts';
import { AU, SOL } from '../bodies.ts';
import { SCALE_FACTOR } from './constants.ts';
import { AxesHelper, Color, GridHelper, OrthographicCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { CelestialBodyState, CelestialBodyType, Point2, Point3 } from '../types.ts';
import { KeplerianBody3D } from './KeplerianBody3D.ts';
import { Belt3D } from './Belt3D.ts';

import { isOffScreen } from './utils.ts';

export class SolarSystemRenderer {
  readonly scene: Scene;
  readonly camera: OrthographicCamera;
  readonly renderer: WebGLRenderer;
  readonly controls: OrbitControls;
  private bodies: Array<KeplerianBody3D>;
  readonly belts: Array<Belt3D>;

  readonly debug = false;

  constructor(container: HTMLElement, appState: AppState, systemState: Record<string, CelestialBodyState>) {
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);

    const [w, h] = [window.innerWidth, window.innerHeight];
    this.camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0, SCALE_FACTOR * 10);
    this.setupCamera();

    this.renderer = new WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Clear existing content and append renderer
    while (container.firstChild != null) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(this.renderer.domElement);

    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.minZoom = 0.001;
    this.controls.maxZoom = 10000;
    this.controls.zoomToCursor = true;

    this.bodies = Object.values(systemState).map(body => new KeplerianBody3D(this.scene, appState, body));
    // TODO: enable if we can get the belts to look better; not great currently
    this.belts = [].map(belt => new Belt3D(this.scene, appState, belt));
    window.addEventListener('resize', this.onWindowResize.bind(this));

    if (this.debug) {
      this.addHelpers();
    }
  }

  private onWindowResize() {
    this.camera.left = -window.innerWidth;
    this.camera.right = window.innerWidth;
    this.camera.top = window.innerHeight;
    this.camera.bottom = -window.innerHeight;
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

  update(ctx: CanvasRenderingContext2D, appState: AppState, systemState: Record<string, CelestialBodyState>) {
    this.controls.update();

    if (appState.center != null && appState.center != SOL.name) {
      const centerBody = this.bodies.find(({ body }) => body.name === appState.center);
      if (centerBody != null) {
        const [x, y] = centerBody.dotPosition.array;
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = 1e9;
        this.camera.lookAt(x, y, 0);
        this.camera.up.set(0, 1, 0);
        this.camera.updateProjectionMatrix();
      }
    }

    // TODO: this method of looping is not very efficient
    this.bodies.forEach(body => {
      const bodyState = systemState[body.body.name];
      if (bodyState != null) {
        body.update(appState, bodyState);
      }
    });

    this.renderer.render(this.scene, this.camera);

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (appState.drawLabel) {
      const metersPerPx = this.getMetersPerPixel();
      this.bodies.forEach(body => {
        body.drawLabel(ctx, this.camera, metersPerPx);
      });
    }
  }

  /*
  add(appState: AppState, parent: CelestialBodyState | null, body: CelestialBodyState) {
    for (const body3d of this.createBodies(appState, parent, body)) {
      this.bodies.push(body3d);
    }
  }
  */

  reset(appState: AppState, systemState: Record<string, CelestialBodyState>) {
    this.setupCamera();
    this.controls.reset();
    this.bodies.forEach(body => body.dispose());
    this.bodies = Object.values(systemState).map(body => new KeplerianBody3D(this.scene, appState, body));
  }

  dispose() {
    const boundResizeHandler = this.onWindowResize.bind(this);
    window.removeEventListener('resize', boundResizeHandler);

    this.bodies.forEach(body => body.dispose());
    this.belts.forEach(belt => belt.dispose());
    this.renderer.dispose();
    this.controls.dispose();
  }

  private addHelpers() {
    const axesHelper = new AxesHelper(AU / SCALE_FACTOR);
    axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff);
    this.scene.add(axesHelper);
    const gridHelper = new GridHelper((AU * 1000) / SCALE_FACTOR, 100);
    gridHelper.rotateX(Math.PI / 2);
    this.scene.add(gridHelper);
  }

  findCloseBody([xPx, yPx]: Point2, visibleTypes: Set<CelestialBodyType>, threshold = 10): KeplerianBody3D | undefined {
    let closest: KeplerianBody3D | undefined = undefined;
    let closestDistance = threshold;
    for (const body of [...this.bodies].reverse()) {
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
