import {
  Material,
  Mesh,
  MeshBasicMaterial,
  Scene,
  TorusGeometry,
  CustomBlending,
  MaxEquation,
  OneFactor,
  DoubleSide,
} from 'three';
import { AppState } from '../state.ts';
import { Belt } from '../types.ts';
import { SCALE_FACTOR } from './constants.ts';

export class OrbitalRegime {
  readonly belt: Belt;
  readonly scene: Scene;
  readonly mesh: Mesh;

  constructor(scene: Scene, appState: AppState, belt: Belt) {
    this.belt = belt;
    this.scene = scene;

    const width = (belt.max - belt.min) / SCALE_FACTOR;
    const geometry = new TorusGeometry(belt.min / SCALE_FACTOR + width / 2, width / 2, 36, 100);
    const material = new MeshBasicMaterial({
      color: 0x111111,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
      blending: CustomBlending,
      blendEquation: MaxEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor,
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.visible = appState.visibleRegimes.has(belt.name);
    // TODO: flatten more for inner oort?
    this.mesh.scale.z = 0.1; // flatten the torus to be disk-shaped
    scene.add(this.mesh);
  }

  update(appState: AppState) {
    this.mesh.visible = appState.visibleRegimes.has(this.belt.name);
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as Material).dispose();
    this.scene.remove(this.mesh);
  }
}
