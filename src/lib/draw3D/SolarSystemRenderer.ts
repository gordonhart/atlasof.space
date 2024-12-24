import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppState } from '../state.ts';
import { AU } from '../bodies.ts';
import { SCALE_FACTOR } from './constants.ts';
import { AxesHelper, Color, GridHelper, OrthographicCamera, Scene, WebGLRenderer } from 'three';
import { findCelestialBody } from '../utils.ts';
import { CelestialBodyState, Point2 } from '../types.ts';
import { CelestialBody3D } from './CelestialBody3D.ts';
import { magnitude } from '../physics.ts';
import { Belt3D } from './Belt3D.ts';

export class SolarSystemRenderer {
  readonly scene: Scene;
  readonly camera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;
  readonly bodies: Array<CelestialBody3D>;
  readonly belts: Array<Belt3D>;

  readonly debug = false;

  constructor(container: HTMLElement, appState: AppState, systemState: CelestialBodyState) {
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);

    // Create and position camera using container dimensions
    const [w, h] = [window.innerWidth, window.innerHeight];
    this.camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0, SCALE_FACTOR * 10);
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(0, 0, 1e9);
    this.camera.lookAt(0, 0, 0);
    this.camera.zoom = 1; // TODO: parameterize?
    this.camera.updateProjectionMatrix();

    // Create renderer with container dimensions
    this.renderer = new WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    this.renderer.setSize(w, h);
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
    this.controls.maxZoom = 1000;

    this.bodies = this.createBodiesRecursive(appState, null, systemState);
    // TODO: enable if we can get the belts to look better; not great currently
    this.belts = [].map(belt => new Belt3D(this.scene, appState, belt));
    window.addEventListener('resize', this.onWindowResize.bind(this));

    if (this.debug) {
      this.addHelpers();
    }
  }

  private onWindowResize() {
    const [w, h] = [window.innerWidth, window.innerHeight];
    this.camera.left = -w;
    this.camera.right = w;
    this.camera.top = h;
    this.camera.bottom = -h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  getMetersPerPixel() {
    const visibleWidth = (this.camera.right - this.camera.left) / this.camera.zoom;
    return (SCALE_FACTOR * visibleWidth) / window.innerWidth;
  }

  update(ctx: CanvasRenderingContext2D, appState: AppState, systemState: CelestialBodyState) {
    this.controls.update();

    /* TODO: this doesn't work well, need to think through desired behavior
    if (appState.center != null) {
      const centerBody = this.bodies.find(({ body }) => body.name === appState.center);
      if (centerBody != null) {
        this.camera.position.x = centerBody.dotPosition.array[0];
        this.camera.position.y = centerBody.dotPosition.array[1];
      }
    }
     */

    // TODO: this method of looping is not very efficient
    this.bodies.forEach(body => {
      const bodyState = findCelestialBody(systemState, body.body.name);
      if (bodyState != null) {
        const parentState = body.parentName != null ? findCelestialBody(systemState, body.parentName) : null;
        body.update(appState, parentState ?? null, bodyState);
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

  private createBodiesRecursive(
    appState: AppState,
    parent: CelestialBodyState | null,
    body: CelestialBodyState
  ): Array<CelestialBody3D> {
    const thisBody = new CelestialBody3D(this.scene, appState, parent, body);
    return [...body.satellites.flatMap(child => this.createBodiesRecursive(appState, body, child)), thisBody];
  }

  // TODO: this greedily takes the first match; should find the closest within threshold, prioritizing a parent
  //  (planet) over any of its children (moons)
  findCloseBody([xPx, yPx]: Point2, threshold = 10): CelestialBody3D | undefined {
    for (const body of [...this.bodies].reverse()) {
      const [bodyXpx, bodyYpx] = body.getScreenPosition(this.camera);
      if (magnitude([xPx - bodyXpx, yPx - bodyYpx, 0]) < threshold) {
        return body;
      }
    }
  }
}
