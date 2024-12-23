import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppState } from '../state.ts';
import { AU } from '../bodies.ts';
import { SCALE_FACTOR } from './constants.ts';
import { AxesHelper, Color, OrthographicCamera, Scene, WebGLRenderer } from 'three';

export class SolarSystemRenderer {
  readonly scene: Scene;
  readonly camera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;

  constructor(container: HTMLElement) {
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);

    // Create and position camera using container dimensions
    const [w, h] = [window.innerWidth, window.innerHeight];
    this.camera = new OrthographicCamera(-w, w, h, -h, 1, SCALE_FACTOR);
    this.camera.up.set(0, 0, 1);
    // this.camera.position.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
    this.camera.position.set(0, 0, 1e3);
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

    // Add helpers
    const axesHelper = new AxesHelper(AU / SCALE_FACTOR);
    axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff);
    this.scene.add(axesHelper);

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

  getScene(): Scene {
    return this.scene;
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    const boundResizeHandler = this.onWindowResize.bind(this);
    window.removeEventListener('resize', boundResizeHandler);

    this.renderer.dispose();
    this.controls.dispose();
  }

  updateFromAppState(appState: AppState) {
    // Temporarily disable this until basic rendering works
    // const zoom = appState.metersPerPx;
    // this.camera.position.setZ(zoom * 1000);
    // this.camera.updateProjectionMatrix();
  }
}
