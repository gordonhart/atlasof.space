import { Color, Material, Scene, Vector2, Vector3 } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { SCALE_FACTOR } from './constants.ts';

export class FocalRadius {
  private readonly scene: Scene;
  private readonly line: Line2;

  constructor(scene: Scene, start: Vector3, end: Vector3, color: Color) {
    this.scene = scene;

    const geometry = new LineGeometry();
    geometry.setPositions([start, end].flatMap(p => [p.x / SCALE_FACTOR, p.y / SCALE_FACTOR, p.z / SCALE_FACTOR]));
    const resolution = new Vector2(window.innerWidth, window.innerHeight);
    const material = new LineMaterial({ color, linewidth: 2, resolution });
    material.depthTest = false;
    this.line = new Line2(geometry, material);
    this.line.visible = false;
    this.scene.add(this.line);
  }

  update(start: Vector3 | null, end: Vector3, visible: boolean) {
    this.line.visible = visible;
    if (visible) {
      const positions = [start?.x ?? 0, start?.y ?? 0, start?.z ?? 0, end.x, end.y, end.z];
      this.line.geometry.setPositions(positions.map(p => p / SCALE_FACTOR));
    }
  }

  dispose() {
    this.line.geometry.dispose();
    (this.line.material as Material).dispose();
    this.scene.remove(this.line);
  }
}
