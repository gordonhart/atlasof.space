import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppState } from '../state.ts';
import { AU } from '../bodies.ts';
import { MeshType, SCALE_FACTOR } from './constants.ts';
import { AxesHelper, Color, Mesh, OrthographicCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { findCelestialBody } from '../utils.ts';
import { CelestialBodyState } from '../types.ts';
import { CelestialBody3D, createCelestialSystem } from './CelestialBody3D.ts';

export class SolarSystemRenderer {
  readonly scene: Scene;
  readonly camera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;
  readonly bodies: Array<CelestialBody3D>;

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

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    this.bodies = createCelestialSystem(this.scene, systemState, appState.visibleTypes);
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

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  getMetersPerPixel() {
    const visibleWidth = (this.camera.right - this.camera.left) / this.camera.zoom;
    return (SCALE_FACTOR * visibleWidth) / window.innerWidth;
  }

  update({ center, drawOrbit }: AppState, systemState: CelestialBodyState) {
    // TODO: avoid doing this if `drawOrbit` didn't change?
    this.scene.children
      .filter(({ userData }) => userData.type === MeshType.ELLIPSE)
      .forEach(ellipse => {
        ellipse.visible = drawOrbit;
      });
    if (center != null) {
      const mesh = this.scene.children.find(({ userData }) => userData?.name === center);
      const centerPoint: Vector3 | undefined = (mesh as Mesh | undefined)?.geometry?.boundingSphere?.center;
      if (centerPoint != null) {
        // this.camera.position.set(centerPoint.x, centerPoint.y, 1e3);
        // this.camera.updateProjectionMatrix();
        // console.log(`centering ${center}`, centerPoint);
      }
    }
    // Temporarily disable this until basic rendering works
    // const zoom = appState.metersPerPx;
    // this.camera.position.setZ(zoom * 1000);
    // this.camera.updateProjectionMatrix();

    this.bodies.forEach(body => {
      const bodyState = findCelestialBody(systemState, body.name);
      if (bodyState != null) {
        body.update(bodyState);
      }
    });
  }

  dispose() {
    const boundResizeHandler = this.onWindowResize.bind(this);
    window.removeEventListener('resize', boundResizeHandler);

    this.renderer.dispose();
    this.controls.dispose();
  }
}
