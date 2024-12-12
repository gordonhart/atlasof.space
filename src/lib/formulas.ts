import { G } from './constants.ts';

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

// kepler's third law
export function orbitalPeriod(semiMajorAxis: number, centralMass: number) {
  return Math.PI * 2 * Math.sqrt(Math.pow(semiMajorAxis, 3) / (G * centralMass));
}
