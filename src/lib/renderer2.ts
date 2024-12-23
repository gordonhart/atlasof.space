import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppState } from './state';
import { AU } from './constants.ts';

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
      AU * 1e3
    );
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(0, 1e6, 1e6);
    this.camera.lookAt(0, 0, 0);

    // Create renderer with container dimensions
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
      // alpha: true, // Allow transparency if needed
    });
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

    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1000000.0);
    this.scene.add(ambientLight);

    // Add hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(hemisphereLight);

    /*
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Add point light near camera
    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.position.copy(this.camera.position);
    this.scene.add(pointLight);
     */

    // Add helpers
    // this.scene.add(new THREE.GridHelper(AU, 100));
    const axesHelper = new THREE.AxesHelper(AU);
    axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff);
    this.scene.add(axesHelper);
    // this.scene.add(new THREE.DirectionalLightHelper(directionalLight));
    // this.scene.add(new THREE.PointLightHelper(pointLight));

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
