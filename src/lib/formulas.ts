import {G} from "./constants.ts";

export function keplersThirdLaw(semiMajorAxis: number, centralMass: number) {
  // calculate the period of an orbit based on its Keplerian parameters
  return Math.PI * 2 * Math.sqrt(Math.pow(semiMajorAxis, 3) / (G * centralMass));
}

export function radialDistance() {
  // distance in meters from the center of the orbital ellipse
}

/*
export function trueAnomaly(meanAnomaly: number, semiMajorAxis: number, eccentricity: number) {}
 */