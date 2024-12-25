import { Vector3 } from 'three';
import { G } from '../bodies.ts';

export class KinematicBody {
  readonly mass: number;
  readonly influencedBy: Array<string>;
  readonly rotationPeriod: number | undefined;

  position: Vector3; // in "real-world" units, i.e. meters
  velocity: Vector3;
  rotation: number;

  constructor(
    mass: number,
    influencedBy: Array<string>,
    rotationPeriod: number | undefined,
    position: Vector3,
    velocity: Vector3
  ) {
    this.mass = mass;
    this.influencedBy = influencedBy;
    this.rotationPeriod = rotationPeriod;
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.rotation = 0; // TODO: initial state? hard to find
  }

  // TODO: subdivide dt to a safe value
  increment(parents: Array<Pick<KinematicBody, 'position' | 'velocity' | 'mass'>>, dt: number) {
    const acceleration = new Vector3(0, 0, 0);
    parents.forEach(parent => {
      const positionDelta = this.position.clone().sub(parent.position);
      acceleration.add(positionDelta.multiplyScalar((-G * parent.mass) / positionDelta.length() ** 3));
    });
    this.velocity.add(acceleration.multiplyScalar(dt));
    this.position.add(this.velocity.clone().multiplyScalar(dt));
    if (this.rotationPeriod != null) {
      this.rotation = (this.rotation + (360 * dt) / this.rotationPeriod) % 360;
    }
  }
}
