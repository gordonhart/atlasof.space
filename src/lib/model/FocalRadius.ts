import { Color, Group, Material, Scene, Vector2, Vector3 } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { CelestialBody } from '../types.ts';
import { SCALE_FACTOR } from './constants.ts';

export class FocalRadius {
  private readonly scene: Scene;
  private readonly group: Group;
  private readonly line: Line2;

  constructor(scene: Scene, resolution: Vector2, body: CelestialBody, parentPosition: Vector3, bodyPosition: Vector3) {
    this.scene = scene;

    this.group = new Group();
    this.group.position.copy(bodyPosition).divideScalar(SCALE_FACTOR);
    this.scene.add(this.group);

    const geometry = new LineGeometry();
    const { x: px, y: py, z: pz } = bodyPosition.clone().sub(parentPosition).divideScalar(SCALE_FACTOR);
    geometry.setPositions([0, 0, 0, px, py, pz]);
    const color = new Color(body.style.fgColor);
    const material = new LineMaterial({ color, linewidth: 1, resolution, depthTest: true });
    this.line = new Line2(geometry, material);
    this.line.visible = false;
    this.line.renderOrder = 0;
    this.group.add(this.line);
  }

  update(parentPosition: Vector3 | null, bodyPosition: Vector3, visible: boolean) {
    this.line.visible = visible;
    if (visible) {
      this.group.position.copy(bodyPosition).divideScalar(SCALE_FACTOR);
      const parentRelativePositions = [
        ((parentPosition?.x ?? 0) - bodyPosition.x) / SCALE_FACTOR,
        ((parentPosition?.y ?? 0) - bodyPosition.y) / SCALE_FACTOR,
        ((parentPosition?.z ?? 0) - bodyPosition.z) / SCALE_FACTOR,
      ];
      // the target body is always at the origin in the group geometry, with parent offset from there
      this.line.geometry.setPositions([0, 0, 0, ...parentRelativePositions]);
    }
  }

  dispose() {
    this.line.geometry.dispose();
    (this.line.material as Material).dispose();
    this.scene.remove(this.group);
  }
}
