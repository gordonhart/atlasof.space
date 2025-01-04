import { Vector3 } from 'three';

import { G } from '../physics.ts';

export class KinematicBody {
  readonly influencedBy: Array<string>;
  readonly rotationPeriod: number | undefined;

  position: Vector3; // in "real-world" units, i.e. meters
  velocity: Vector3;
  rotation: number;

  private readonly acceleration;
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
  increment(parents: Array<{ position: Vector3; velocity: Vector3; mass: number }>, dt: number) {
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
    this.velocity.add(this.acceleration.multiplyScalar(dt));
    this.position.add(this.tmp.copy(this.velocity).multiplyScalar(dt));
    if (this.rotationPeriod != null) {
      this.rotation = (this.rotation + (360 * dt) / this.rotationPeriod) % 360;
    }
  }
}
