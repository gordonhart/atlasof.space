import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppState } from '../state.ts';
import { AU } from '../bodies.ts';
import { SCALE_FACTOR } from './constants.ts';
import { AxesHelper, Color, Mesh, OrthographicCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { findCelestialBody } from '../utils.ts';
import { CelestialBodyState, Point2 } from '../types.ts';
import { CelestialBody3D } from './CelestialBody3D.ts';
import { magnitude } from '../physics.ts';

export class SolarSystemRenderer {
  readonly scene: Scene;
  readonly camera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;
  private bodies: Array<CelestialBody3D>;

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
    this.renderer = new WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
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

    // Add helpers
    const axesHelper = new AxesHelper(AU / SCALE_FACTOR);
    axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff);
    this.scene.add(axesHelper);

    // Add bodies
    this.bodies = this.createBodiesRecursive(appState, null, systemState);

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
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

  render(ctx: CanvasRenderingContext2D) {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    if (ctx != null) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.bodies.forEach(body => {
        body.drawLabel(ctx, this.camera);
      });
    }
  }

  getMetersPerPixel() {
    const visibleWidth = (this.camera.right - this.camera.left) / this.camera.zoom;
    return (SCALE_FACTOR * visibleWidth) / window.innerWidth;
  }

  update(appState: AppState, systemState: CelestialBodyState) {
    if (appState.center != null) {
      const mesh = this.scene.children.find(({ userData }) => userData?.name === appState.center);
      const centerPoint: Vector3 | undefined = (mesh as Mesh | undefined)?.geometry?.boundingSphere?.center;
      if (centerPoint != null) {
        // this.camera.position.set(centerPoint.x, centerPoint.y, 1e3);
        // this.camera.updateProjectionMatrix();
        // console.log(`centering ${center}`, centerPoint);
      }
    }

    // TODO: this method of looping is not very efficient
    this.bodies.forEach(body => {
      const bodyState = findCelestialBody(systemState, body.name);
      if (bodyState != null) {
        const parentState = body.parentName != null ? findCelestialBody(systemState, body.parentName) : null;
        body.update(appState, parentState ?? null, bodyState);
      }
    });
  }

  dispose() {
    const boundResizeHandler = this.onWindowResize.bind(this);
    window.removeEventListener('resize', boundResizeHandler);

    this.bodies.forEach(body => body.dispose());
    this.renderer.dispose();
    this.controls.dispose();
  }

  private createBodiesRecursive(
    appState: AppState,
    parent: CelestialBodyState | null,
    body: CelestialBodyState
  ): Array<CelestialBody3D> {
    const thisBody = new CelestialBody3D(this.scene, parent, body);
    return appState.visibleTypes.has(body.type)
      ? [...body.satellites.flatMap(child => this.createBodiesRecursive(appState, body, child)), thisBody]
      : [];
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
