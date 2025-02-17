import {
  CustomBlending,
  DoubleSide,
  Material,
  MaxEquation,
  Mesh,
  MeshBasicMaterial,
  OneFactor,
  Scene,
  SphereGeometry,
  Vector3,
} from 'three';
import { SCALE_FACTOR } from './constants.ts';

export class HillSphere {
  private readonly scene: Scene;
  private readonly mesh: Mesh;

  constructor(scene: Scene, radius: number, position: Vector3) {
    this.scene = scene;

    const material = new MeshBasicMaterial({
      // normal opacity controls don't work with this custom blending; set a very dark value to get the right opacity
      color: 0x222222,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
      // special blending to ensure only a single layer of material is shaded, even if the camera pokes through multiple
      blending: CustomBlending,
      blendEquation: MaxEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor,
    });
    const geometry = new SphereGeometry(radius / SCALE_FACTOR);
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.copy(position).divideScalar(SCALE_FACTOR);
    this.scene.add(this.mesh);
  }

  update(position: Vector3) {
    this.mesh.position.copy(position).divideScalar(SCALE_FACTOR);
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as Material).dispose();
    this.scene.remove(this.mesh);
  }
}
