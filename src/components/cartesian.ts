import {Body, GRAVITATIONAL_CONSTANT, Point, TIME_STEP_S} from "./constants.ts";

function calculateDistance(a: Point, b: Point): number {
  return (((a.x - b.x) ** 2) + ((a.y - b.y) ** 2)) ** 0.5;
}

function calculatePosition(p0: number, v: number, a: number, t: number) {
  return p0 + (v * t) + (0.5 * a * (t ** 2));
}

// TODO: this assumes that the reference will not move, probably not entirely correct
export function incrementBody(target: Body, reference: Body, timeStep: number = TIME_STEP_S) {
  const masses = reference.mass * target.mass;
  const distance = calculateDistance(reference.curr, target.curr);
  const force = GRAVITATIONAL_CONSTANT * Number(masses) / (distance ** 2);
  const accelMagnitude = force / Number(target.mass);
  const accel = { // multiply by unit vector
    x: accelMagnitude * (reference.curr.x - target.curr.x) / distance,
    y: accelMagnitude * (reference.curr.y - target.curr.y) / distance,
  }
  const velocity = {
    x: (target.curr.x - target.prev.x) / timeStep,
    y: (target.curr.y - target.prev.y) / timeStep,
  }
  target.prev = {...target.curr};
  target.curr = {
    x: calculatePosition(target.curr.x, velocity.x, accel.x, timeStep),
    y: calculatePosition(target.curr.y, velocity.y, accel.y, timeStep),
  }
}
