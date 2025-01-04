import { Color, Euler, Group, Material, Scene, Vector2, Vector3 } from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { degreesToRadians } from '../physics.ts';
import { HOVER_SCALE_FACTOR, SCALE_FACTOR } from './constants.ts';

export class AxisIndicator {
  private readonly scene: Scene;
  private readonly group: Group;
  private readonly line: LineSegments2;
  private readonly bodyRadius: number;

  private readonly rotationEuler: Euler;
  private readonly segments: [Vector3, Vector3, Vector3, Vector3];

  constructor(scene: Scene, resolution: Vector2, center: Vector3, axialTilt: number, bodyRadius: number, color: Color) {
    this.scene = scene;
    this.bodyRadius = bodyRadius;

    this.group = new Group();
    this.group.position.copy(center).divideScalar(SCALE_FACTOR);
    this.scene.add(this.group);

    this.rotationEuler = new Euler(degreesToRadians(axialTilt), 0, 0);
    this.segments = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];

    const geometry = new LineSegmentsGeometry();
    geometry.setPositions(this.calculatePositions());
    const material = new LineMaterial({ color, linewidth: 1, resolution, depthTest: true });
    material.depthTest = true;
    this.line = new LineSegments2(geometry, material);
    this.line.visible = false;
    this.line.renderOrder = 1;
    this.group.add(this.line);
  }

  update(position: Vector3, visible: boolean) {
    this.line.visible = visible;
    if (visible) {
      this.group.position.copy(position).divideScalar(SCALE_FACTOR);
      this.line.geometry.setPositions(this.calculatePositions());
    }
  }

  dispose() {
    this.line.geometry.dispose();
    (this.line.material as Material).dispose();
    this.scene.remove(this.group);
  }

  private calculatePositions() {
    this.segments[0].set(0, 0, this.bodyRadius * HOVER_SCALE_FACTOR).applyEuler(this.rotationEuler);
    this.segments[1].set(0, 0, this.bodyRadius * HOVER_SCALE_FACTOR * 1.5).applyEuler(this.rotationEuler);
    this.segments[2].set(0, 0, -this.bodyRadius * HOVER_SCALE_FACTOR).applyEuler(this.rotationEuler);
    this.segments[3].set(0, 0, -this.bodyRadius * HOVER_SCALE_FACTOR * 1.5).applyEuler(this.rotationEuler);
    return this.segments.flatMap(p => [p.x, p.y, p.z]).map(p => p / SCALE_FACTOR);
  }
}
