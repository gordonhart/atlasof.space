import { Vector3 } from 'three';

export class PhysicallyModeled {
  readonly mass: number;
  readonly influencedBy: Array<string>;

  private position: Vector3;
  private velocity: Vector3;

  constructor(mass: number, influencedBy: Array<string>, position: Vector3, velocity: Vector3) {
    this.mass = mass;
    this.influencedBy = influencedBy;
    this.position = position.clone();
    this.velocity = velocity.clone();
  }

  // TODO: implement
  update() {
    this.position = this.position;
    this.velocity = this.velocity;
  }
}
