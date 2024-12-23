import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppState } from './state';

export class SolarSystemRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  constructor(container: HTMLElement) {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0000ff);

    // Create and position camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000000000000);
    this.camera.position.set(0, 0, 1000000000); // Start zoomed out to see the whole system
    this.camera.lookAt(0, 0, 0);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // handle double effects from strict mode
    if (container.childNodes.length === 0) {
      container.appendChild(this.renderer.domElement);
    }

    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private onWindowResize() {
    const container = this.renderer.domElement.parentElement;
    if (!container) return;

    const aspect = container.clientWidth / container.clientHeight;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  // Get scene for creating celestial bodies
  getScene(): THREE.Scene {
    return this.scene;
  }

  // Update and render the scene
  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // Clean up resources
  dispose() {
    this.renderer.dispose();
    this.controls.dispose();
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  // Update camera based on app state
  updateFromAppState(appState: AppState) {
    // Update camera zoom based on metersPerPx
    const zoom = appState.metersPerPx;
    this.camera.position.setZ(zoom * 1000); // Adjust multiplier as needed
    this.camera.updateProjectionMatrix();

    // If there's a center object specified, update camera target
    if (appState.center) {
      // You'll need to implement this based on your needs
      // this.controls.target.set(centerX, centerY, 0);
    }
  }
}
