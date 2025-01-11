import { OrthographicCamera, Vector2, Vector3 } from 'three';
import { G } from '../physics.ts';
import { Point2 } from '../types.ts';
import { SCALE_FACTOR } from './constants.ts';

export class KinematicBody {
  readonly influencedBy: Array<string>;
  readonly rotationPeriod: number | undefined;

  readonly position: Vector3; // in "real-world" units, i.e. meters
  readonly velocity: Vector3;
  readonly acceleration: Vector3;
  rotation: number;

  private readonly tmp; // reuse for memory efficiency

  constructor(influencedBy: Array<string>, rotationPeriod: number | undefined, position: Vector3, velocity: Vector3) {
    this.influencedBy = influencedBy;
    this.rotationPeriod = rotationPeriod;
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.rotation = 0; // TODO: initial state? hard to find
    this.acceleration = new Vector3();
    this.tmp = new Vector3();
  }

  // semi-implicit Euler integration
  increment(parents: Array<{ position: Vector3; mass: number }>, dt: number) {
    this.acceleration.set(0, 0, 0);
    parents.forEach(parent => {
      this.tmp.copy(this.position).sub(parent.position); // position delta
      const distance = this.tmp.length();
      this.tmp // gravitational acceleration from parent
        .multiplyScalar(-G * parent.mass)
        .divideScalar(distance) // apply as three separate operations to avoid very large r^3 value
        .divideScalar(distance)
        .divideScalar(distance);
      this.acceleration.add(this.tmp);
    });
    this.velocity.add(this.tmp.copy(this.acceleration).multiplyScalar(dt));
    this.position.add(this.tmp.copy(this.velocity).multiplyScalar(dt));
    if (this.rotationPeriod != null) {
      this.rotation = (this.rotation + (360 * dt) / this.rotationPeriod) % 360;
    }
  }

  getScreenPosition(camera: OrthographicCamera, resolution: Vector2): Point2 {
    this.tmp.copy(this.position).divideScalar(SCALE_FACTOR).project(camera);
    const pixelX = ((this.tmp.x + 1) * resolution.x) / 2;
    const pixelY = ((1 - this.tmp.y) * resolution.y) / 2;
    return [pixelX, pixelY]; // return pixel values
  }
}
