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
import { Settings } from '../state.ts';
import { isOrbitalRegimeId, OrbitalRegime as OrbitalRegimeType } from '../types.ts';
import { SCALE_FACTOR } from './constants.ts';

export class OrbitalRegime {
  readonly regime: OrbitalRegimeType;
  readonly scene: Scene;
  readonly mesh: Mesh;

  constructor(scene: Scene, settings: Settings, regime: OrbitalRegimeType) {
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
    this.mesh.visible = this.isVisible(settings);
    this.mesh.scale.z = regime.roundness; // flatten or stretch torus
    scene.add(this.mesh);
  }

  update(settings: Settings) {
    this.mesh.visible = this.isVisible(settings);
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as Material).dispose();
    this.scene.remove(this.mesh);
  }

  private isVisible(settings: Settings) {
    return (
      settings.hover === this.regime.id ||
      settings.center === this.regime.id ||
      // TODO: can remove visibleRegimes -- the options are gone from the visibility menu
      (isOrbitalRegimeId(this.regime.id) && settings.visibleRegimes.has(this.regime.id))
    );
  }
}
