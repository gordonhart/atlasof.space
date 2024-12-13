import { G } from './constants.ts';
import { Point3 } from './types.ts';

// TODO: use proper vector/matrix library?
export function add3([a1, a2, a3]: Point3, [b1, b2, b3]: Point3): Point3 {
  return [a1 + b1, a2 + b2, a3 + b3];
}
export function subtract3([a1, a2, a3]: Point3, [b1, b2, b3]: Point3): Point3 {
  return [a1 - b1, a2 - b2, a3 - b3];
}
export function mul3(s: number, [a, b, c]: Point3): Point3 {
  return [s * a, s * b, s * c];
}

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

// kepler's third law
export function orbitalPeriod(semiMajorAxis: number, centralMass: number) {
  return Math.PI * 2 * Math.sqrt(Math.pow(semiMajorAxis, 3) / (G * centralMass));
}
