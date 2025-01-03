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
import { OrbitalRegime as OrbitalRegimeType } from '../types.ts';
import { SCALE_FACTOR } from './constants.ts';

export class OrbitalRegime {
  readonly regime: OrbitalRegimeType;
  readonly scene: Scene;
  readonly mesh: Mesh;

  constructor(scene: Scene, appState: AppState, regime: OrbitalRegimeType) {
    this.regime = regime;
    this.scene = scene;

    const width = (regime.max - regime.min) / SCALE_FACTOR;
    const geometry = new TorusGeometry(regime.min / SCALE_FACTOR + width / 2, width / 2, 36, 100);
    const material = new MeshBasicMaterial({
      // normal opacity controls don't work with this custom blending; set a very dark value to get the right opacity
      color: 0x111111,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
      // special blending to ensure only a single layer of material is shaded, even if the camera pokes through multiple
      blending: CustomBlending,
      blendEquation: MaxEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor,
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.visible = appState.visibleRegimes.has(regime.name);
    this.mesh.scale.z = regime.roundness; // flatten or stretch torus
    scene.add(this.mesh);
  }

  update(appState: AppState) {
    this.mesh.visible = appState.visibleRegimes.has(this.regime.name);
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as Material).dispose();
    this.scene.remove(this.mesh);
  }
}
