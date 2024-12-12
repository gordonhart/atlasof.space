import {orbitalPeriod} from "./formulas.ts";
import { mapValues } from "./utils.ts";

// gravitational constant
export const G = 6.6743e-11; // N⋅m2⋅kg−2
export const DT = 60 * 60 * 6; // time step -- 6 hours
export const AU = 1.496e+11; // meters
export const BODY_SCALE_FACTOR = 5;

export type Point = {
  x: number;
  y: number;
}
export type CelestialObject =
  | 'sol'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'earth'
  | 'ceres'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export type KeplerianElements = {
  eccentricity: number; // ratio
  semiMajorAxis: number; // meters
  inclination: number; // degrees
  longitudeAscending: number; // degrees
  argumentOfPeriapsis: number; // degrees
  trueAnomaly: number; // degrees
};
export const ELEMENTS: Record<Exclude<CelestialObject, 'sol'>, KeplerianElements> = {
  mercury: {
    eccentricity: 0.2056,
    semiMajorAxis: 57909050e3, // meters
    inclination: 7.005, // degrees
    longitudeAscending: 48.331, // degrees
    argumentOfPeriapsis: 29.124, // degrees
    trueAnomaly: 0, // degrees (choose initial position as desired)
  },
  venus: {
    eccentricity: 0.006772, // ratio
    semiMajorAxis: 108208000e3, // meters (1 AU = 149,597,870.7 km)
    inclination: 3.39458, // degrees
    longitudeAscending: 76.6799, // degrees
    argumentOfPeriapsis: 54.884, // degrees
    trueAnomaly: 0, // degrees
  },
  earth: {
    eccentricity: 0.0167086, // ratio
    semiMajorAxis: 149597870.7e3, // meters (1 AU)
    inclination: 0.00005, // degrees
    longitudeAscending: -11.26064, // degrees
    argumentOfPeriapsis: 114.20783, // degrees
    trueAnomaly: 0, // degrees
  },
  mars: {
    eccentricity: 0.0935, // ratio
    semiMajorAxis: 227939200e3, // meters
    inclination: 1.850, // degrees
    longitudeAscending: 49.558, // degrees
    argumentOfPeriapsis: 286.502, // degrees
    trueAnomaly: 0, // degrees
  },
  ceres: {
    eccentricity: 0.075823, // ratio
    semiMajorAxis: 413690250e3, // meters
    inclination: 10.594, // degrees
    longitudeAscending: 80.305, // degrees
    argumentOfPeriapsis: 73.597, // degrees
    trueAnomaly: 0, // degrees
  },
  jupiter: {
    eccentricity: 0.0489, // ratio
    semiMajorAxis: 778340821e3, // meters
    inclination: 1.305, // degrees
    longitudeAscending: 100.556, // degrees
    argumentOfPeriapsis: 14.753, // degrees
    trueAnomaly: 0, // degrees
  },
  saturn: {
    eccentricity: 0.0565, // ratio
    semiMajorAxis: 1433449370e3, // meters
    inclination: 2.485, // degrees
    longitudeAscending: 113.715, // degrees
    argumentOfPeriapsis: 92.431, // degrees
    trueAnomaly: 0, // degrees
  },
  uranus: {
    eccentricity: 0.0457, // ratio
    semiMajorAxis: 2876679082e3, // meters
    inclination: 0.772, // degrees
    longitudeAscending: 74.006, // degrees
    argumentOfPeriapsis: 170.964, // degrees
    trueAnomaly: 0, // degrees
  },
  neptune: {
    eccentricity: 0.0086, // ratio
    semiMajorAxis: 4503443661e3, // meters
    inclination: 1.770, // degrees
    longitudeAscending: 131.784, // degrees
    argumentOfPeriapsis: 44.971, // degrees
    trueAnomaly: 0, // degrees
  },
  pluto: {
    eccentricity: 0.2488, // ratio
    semiMajorAxis: 5906440628e3, // meters
    inclination: 17.16, // degrees
    longitudeAscending: 110.299, // degrees
    argumentOfPeriapsis: 113.834, // degrees
    trueAnomaly: 0, // degrees
  },
}

export const COLORS: Record<CelestialObject, string> = {
  sol: '#fa0',
  mercury: '#888',
  venus: '#fe8',
  earth: '#3fb',
  mars: '#f53',
  ceres: '#bbb',
  jupiter: '#fa2',
  saturn: '#faa',
  uranus: '#fec',
  neptune: '#2bc',
  pluto: '#ddd',
}
export const RADII: Record<CelestialObject, number> = { // m
  sol: 6.957e8,
  mercury: 2439.7e3,
  venus: 6051.8e3,
  earth: 6371e3,
  mars: 3389.5e3,
  ceres: 966.2e3,
  jupiter: 69911e3,
  saturn: 58232e3,
  uranus: 25362e3,
  neptune: 24622e3,
  pluto: 1188.3e3,
}
export const MASSES: Record<CelestialObject, number> = { // kg
  sol: 1.9885e30,
  mercury: 3.3011e23,
  venus: 4.8675e24,
  earth: 5.972168e24,
  mars: 6.4171e23,
  ceres: 9.3839e20,
  jupiter: 1.8982e27,
  saturn: 5.6834e26,
  uranus: 8.6810e25,
  neptune: 1.02409e26,
  pluto: 1.3025e22,
}

export const ORBITAL_PERIODS: Record<Exclude<CelestialObject, 'sol'>, number> =
  mapValues(ELEMENTS, e => orbitalPeriod(e.semiMajorAxis, MASSES['sol']));

export const MU_SUN = MASSES['sol'] * G;  // 1.32712440018e20; // m^3/s^2, gravitational parameter for the Sun
