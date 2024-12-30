import { Vector3 } from 'three';
import { create, all, BigNumber, MathJsInstance, Matrix } from 'mathjs';
import { G } from '../bodies.ts';

const math: MathJsInstance = create(all, { precision: 128 });

export class KinematicBody {
  readonly mass: number;
  readonly influencedBy: Array<string>;
  readonly rotationPeriod: number | undefined;

  position: Vector3; // in "real-world" units, i.e. meters
  velocity: Vector3;
  rotation: number;

  massB: BigNumber;
  positionB: Matrix;
  velocityB: Matrix;

  private readonly acceleration;
  private readonly tmp; // reuse for memory efficiency

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
    this.acceleration = new Vector3();
    this.tmp = new Vector3();

    this.massB = math.bignumber(mass);
    this.positionB = math.matrix(position.toArray().map(n => math.bignumber(n)));
    this.velocityB = math.matrix(velocity.toArray().map(n => math.bignumber(n)));
  }

  increment(parents: Array<Pick<KinematicBody, 'position' | 'velocity' | 'mass'>>, dt: number) {
    this.acceleration.set(0, 0, 0);
    parents.forEach(parent => {
      this.tmp.copy(this.position).sub(parent.position); // position delta
      this.tmp.multiplyScalar((-G * parent.mass) / this.tmp.length() ** 3); // gravitational acceleration from parent
      this.acceleration.add(this.tmp);
    });
    this.velocity.add(this.acceleration.multiplyScalar(dt));
    this.position.add(this.velocity.clone().multiplyScalar(dt));
    if (this.rotationPeriod != null) {
      this.rotation = (this.rotation + (360 * dt) / this.rotationPeriod) % 360;
    }
  }

  incrementBig(parents: Array<Pick<KinematicBody, 'positionB' | 'velocityB' | 'massB'>>, dt: number) {
    const gBig = math.bignumber(-G);
    const acceleration = parents.reduce(
      (acc, parent) => {
        const distance = math.subtract(this.positionB, parent.positionB);
        const denominator = math.pow(math.norm(distance), math.bignumber(3));
        const accel = math.divide(math.multiply(gBig, parent.massB), denominator);
        return math.add(acc, math.multiply(distance, accel));
      },
      math.matrix([math.bignumber(0), math.bignumber(0), math.bignumber(0)])
    );
    this.velocityB = math.add(this.velocityB, math.multiply(acceleration, math.bignumber(dt)));
    this.positionB = math.add(this.positionB, math.multiply(this.velocityB, math.bignumber(dt)));

    this.velocity.set(this.velocityB.get([0]), this.velocityB.get([1]), this.velocityB.get([2]));
    this.position.set(this.positionB.get([0]), this.positionB.get([1]), this.positionB.get([2]));
    if (this.rotationPeriod != null) {
      this.rotation = (this.rotation + (360 * dt) / this.rotationPeriod) % 360;
    }
  }
}
