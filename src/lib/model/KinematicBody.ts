import { Vector3 } from 'three';
import { G } from '../bodies.ts';

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
    this.position.add(this.velocity.clone().multiplyScalar(dt));
    if (this.rotationPeriod != null) {
      this.rotation = (this.rotation + (360 * dt) / this.rotationPeriod) % 360;
    }
  }

  /**
   * Increments the simulation by the time step `dt` using Velocity Verlet integration.
   */
  /*
  increment(parents: Array<{ position: Vector3; velocity: Vector3; mass: number }>, dt: number): void {
    // Step 1: Update position using current velocity and acceleration
    this.position
      .add(this.velocity.clone().multiplyScalar(dt))
      .add(this.acceleration.clone().multiplyScalar(0.5 * dt * dt));

    // Step 2: Calculate the new acceleration at the updated position
    const previousAcceleration = this.acceleration.clone();
    this.acceleration.set(0, 0, 0); // Reset acceleration
    parents.forEach(parent => {
      this.tmp.copy(this.position).sub(parent.position); // position delta
      const distance = this.tmp.length();
      this.tmp
        .multiplyScalar(-G * parent.mass)
        .divideScalar(distance)
        .divideScalar(distance)
        .divideScalar(distance);
      this.acceleration.add(this.tmp);
    });

    // Step 3: Update velocity using the average of the previous and new accelerations
    this.velocity.add(previousAcceleration.add(this.acceleration).multiplyScalar(0.5 * dt));

    // Step 4: Update rotation, if applicable
    if (this.rotationPeriod != null) {
      this.rotation = (this.rotation + (360 * dt) / this.rotationPeriod) % 360;
    }
  }
   */

  /**
   * Increments the simulation by the time step `dt` using Velocity Verlet integration.
   */
  /*
  increment(parents: Array<{ position: Vector3; velocity: Vector3; mass: number }>, dt: number): void {
    // Step 1: Update position using current velocity and acceleration
    // x(t + dt) = x(t) + v(t)dt + (1/2)a(t)dt²
    this.position
      .add(this.velocity.clone().multiplyScalar(dt))
      .add(this.acceleration.clone().multiplyScalar(0.5 * dt * dt));

    // Step 2: Calculate the new acceleration at the updated position
    const previousAcceleration = this.acceleration.clone();
    this.acceleration.set(0, 0, 0); // Reset acceleration

    parents.forEach(parent => {
      this.tmp.copy(this.position).sub(parent.position); // position delta
      const distance = this.tmp.length();

      // Calculate gravitational acceleration: a = -GM * r̂/r²
      // We divide by distanceCubed because we need both the 1/r² factor
      // and to normalize the direction vector
      this.tmp.multiplyScalar((-G * parent.mass) / distance / distance / distance);
      this.acceleration.add(this.tmp);
    });

    // Step 3: Update velocity using the average of the previous and new accelerations
    // v(t + dt) = v(t) + (1/2)(a(t) + a(t + dt))dt
    const averageAcceleration = previousAcceleration.clone().add(this.acceleration).multiplyScalar(0.5);
    this.velocity.add(averageAcceleration.multiplyScalar(dt));

    // Step 4: Update rotation, if applicable
    if (this.rotationPeriod != null) {
      this.rotation = (this.rotation + (360 * dt) / this.rotationPeriod) % 360;
    }
  }
   */

  /**
   * First pass of Velocity Verlet integration: Update position
   * This should be called for all bodies before doing the second pass
   */
  incrementPositions(dt: number): void {
    // Step 1: Update position using current velocity and acceleration
    // x(t + dt) = x(t) + v(t)dt + (1/2)a(t)dt²
    this.position
      .add(this.velocity.clone().multiplyScalar(dt))
      .add(this.acceleration.clone().multiplyScalar(0.5 * dt * dt));

    // Update rotation, if applicable
    if (this.rotationPeriod != null) {
      this.rotation = (this.rotation + (360 * dt) / this.rotationPeriod) % 360;
    }
  }

  /**
   * Second pass of Velocity Verlet integration: Update acceleration and velocity
   * This should only be called after all bodies have had their positions updated
   */
  incrementVelocities(parents: Array<{ position: Vector3; velocity: Vector3; mass: number }>, dt: number): void {
    // Store previous acceleration
    const previousAcceleration = this.acceleration.clone();

    // Calculate the new acceleration at the updated position
    this.acceleration.set(0, 0, 0); // Reset acceleration

    parents.forEach(parent => {
      this.tmp.copy(this.position).sub(parent.position); // position delta
      const distance = this.tmp.length();
      const distanceCubed = distance * distance * distance;

      // Calculate gravitational acceleration: a = -GM * r̂/r²
      this.tmp.multiplyScalar((-G * parent.mass) / distanceCubed);
      this.acceleration.add(this.tmp);
    });

    // Update velocity using the average of the previous and new accelerations
    // v(t + dt) = v(t) + (1/2)(a(t) + a(t + dt))dt
    const averageAcceleration = previousAcceleration.clone().add(this.acceleration).multiplyScalar(0.5);
    this.velocity.add(averageAcceleration.multiplyScalar(dt));
  }

  // semi-implicit Euler
  incrementSemiImplicitEuler(parents: Array<{ position: Vector3; velocity: Vector3; mass: number }>, dt: number): void {
    // First calculate acceleration at current position
    this.acceleration.set(0, 0, 0);
    parents.forEach(parent => {
      this.tmp.copy(this.position).sub(parent.position);
      const distance = this.tmp.length();
      const distanceCubed = distance * distance * distance;
      this.tmp.multiplyScalar((-G * parent.mass) / distanceCubed);
      this.acceleration.add(this.tmp);
    });

    // First update velocity using current acceleration
    // v(t + dt) = v(t) + a(t)dt
    this.velocity.add(this.acceleration.clone().multiplyScalar(dt));

    // Then update position using new velocity
    // x(t + dt) = x(t) + v(t + dt)dt
    this.position.add(this.velocity.clone().multiplyScalar(dt));

    // Update rotation, if applicable
    if (this.rotationPeriod != null) {
      this.rotation = (this.rotation + (360 * dt) / this.rotationPeriod) % 360;
    }
  }
}
