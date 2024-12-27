import {
  BackSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector3,
} from 'three';
import { Textures } from '../images.ts';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { CAMERA_INIT } from './constants.ts';

export class Firmament {
  private readonly scene: Scene;
  private readonly camera: PerspectiveCamera;
  private readonly skybox: Mesh;
  public readonly renderPass: RenderPass;

  constructor() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3e6);
    this.camera.up.set(...CAMERA_INIT.up);
    this.camera.position.set(...CAMERA_INIT.position);
    this.camera.lookAt(...CAMERA_INIT.lookAt);

    const geometry = new SphereGeometry(2e6, 32, 32); // Create a large sphere for the skybox
    // geometry.scale(-1, 1, 1); // Flip the geometry inside out

    const texture = new TextureLoader().load(Textures.FIRMAMENT);
    const material = new MeshBasicMaterial({
      map: texture,
      side: BackSide,
      transparent: true,
      opacity: 0.2,
    });
    this.skybox = new Mesh(geometry, material);
    this.skybox.rotateX(Math.PI / 2);
    this.skybox.renderOrder = -1;
    this.scene.add(this.skybox);
    this.renderPass = new RenderPass(this.scene, this.camera);
  }

  update(center: Vector3, target: Vector3) {
    this.camera.position.set(center.x, center.y, center.z);
    this.camera.lookAt(target);
  }

  dispose() {
    this.skybox.geometry.dispose();
    (this.skybox.material as Material).dispose();
    this.scene.remove(this.skybox);
  }
}
