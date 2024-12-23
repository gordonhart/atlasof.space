import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppState } from './state';

export class SolarSystemRenderer {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  constructor(container: HTMLElement) {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Create and position camera using container dimensions
    this.camera = new THREE.OrthographicCamera(
      -window.innerWidth,
      window.innerWidth,
      window.innerHeight,
      -window.innerHeight,
      0.1,
      1e15
    );
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    // Create renderer with container dimensions
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Allow transparency if needed
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Clear existing content and append renderer
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // this.renderer.domElement.style = { position: 'absolute', top: 0, left: 0 };
    container.appendChild(this.renderer.domElement);

    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(gridHelper);

    // Add ambient light
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // this.scene.add(ambientLight);

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private onWindowResize() {
    const container = this.renderer.domElement.parentElement;
    if (!container) return;

    // Update sizes
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Update camera
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(width, height);
  }

  getScene(): THREE.Scene {
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
