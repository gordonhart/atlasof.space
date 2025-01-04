import {
  BackSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ECLIPTIC_TILT } from '../bodies.ts';
import { Textures } from '../images.ts';
import { degreesToRadians } from '../physics.ts';
import { CAMERA_INIT } from './constants.ts';

export class Firmament {
  private readonly scene: Scene;
  private readonly camera: PerspectiveCamera;
  private readonly skybox: Mesh;
  public readonly renderPass: RenderPass;

  constructor(resolution: Vector2) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, resolution.x / resolution.y, 1, 3e6);
    this.camera.up.set(...CAMERA_INIT.up);
    this.camera.position.set(...CAMERA_INIT.position);
    this.camera.lookAt(...CAMERA_INIT.lookAt);

    const geometry = new SphereGeometry(2e6, 32, 32);
    const texture = new TextureLoader().load(Textures.FIRMAMENT);
    const material = new MeshBasicMaterial({
      map: texture,
      side: BackSide,
      transparent: true,
      opacity: 0.2,
    });
    // material.depthTest = false;
    this.skybox = new Mesh(geometry, material);
    this.skybox.rotateX(Math.PI / 2 - degreesToRadians(ECLIPTIC_TILT));
    this.skybox.renderOrder = -1;
    this.scene.add(this.skybox);
    this.renderPass = new RenderPass(this.scene, this.camera);
  }

  update(center: Vector3, target: Vector3) {
    this.camera.position.copy(center);
    this.camera.lookAt(target);
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    this.skybox.geometry.dispose();
    (this.skybox.material as Material).dispose();
    this.scene.remove(this.skybox);
  }
}
