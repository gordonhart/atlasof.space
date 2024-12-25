import { Vector3 } from 'three';
import { Point3 } from '../types.ts';
import { G } from '../bodies.ts';
import { add3, gravitationalAcceleration, mul3 } from '../physics.ts';

export class PhysicsBody {
  readonly mass: number;
  readonly influencedBy: Array<string>;

  position: Vector3; // in "real-world" units, i.e. meters
  velocity: Vector3;

  constructor(mass: number, influencedBy: Array<string>, position: Vector3, velocity: Vector3) {
    this.mass = mass;
    this.influencedBy = influencedBy;
    this.position = position.clone();
    this.velocity = velocity.clone();
  }

  // TODO: deal with friction between Vector3/Point3 math
  // TODO: subdivide dt to a safe value
  increment(parents: Array<Pick<PhysicsBody, 'position' | 'velocity' | 'mass'>>, dt: number) {
    const acceleration = parents.reduce<Point3>(
      (acc, parent) =>
        add3(acc, gravitationalAcceleration(this.position.clone().sub(parent.position).toArray(), G * parent.mass)),
      [0, 0, 0] as Point3
    );
    console.log(parents, acceleration);
    this.velocity.set(...add3(this.velocity.toArray(), mul3(dt, acceleration)));
    this.position.set(...add3(this.position.toArray(), mul3(dt, this.velocity.toArray())));
    // TODO: enable rotation
    // const rotation = applyRotation(thisCartesian, dt);
  }
}
