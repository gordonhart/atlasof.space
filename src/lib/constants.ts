import { orbitalPeriod } from './formulas.ts';
import { CelestialObject, KeplerianElements } from './types.ts';
import { keys, map } from 'ramda';

export const G = 6.6743e-11; // gravitational constant, N⋅m2⋅kg−2
export const DT = 60 * 60 * 6; // time step -- 6 hours
export const AU = 1.496e11; // meters

export const ELEMENTS: Record<
  CelestialObject,
  KeplerianElements & {
    mass: number; // kg
    radius: number; // m
    color: `#${string}`; // hex
  }
> = {
  sol: {
    eccentricity: 0,
    semiMajorAxis: 0,
    inclination: 0,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    trueAnomaly: 0,
    mass: 1.9885e30,
    radius: 6.957e8,
    color: '#fa0',
  },
  mercury: {
    eccentricity: 0.2056,
    semiMajorAxis: 57909050e3, // meters
    inclination: 7.005, // degrees
    longitudeAscending: 48.331, // degrees
    argumentOfPeriapsis: 29.124, // degrees
    trueAnomaly: 0, // degrees (choose initial position as desired)
    mass: 3.3011e23,
    radius: 2439.7e3,
    color: '#888',
  },
  venus: {
    eccentricity: 0.006772,
    semiMajorAxis: 108208000e3,
    inclination: 3.39458,
    longitudeAscending: 76.6799,
    argumentOfPeriapsis: 54.884,
    trueAnomaly: 0,
    mass: 4.8675e24,
    radius: 6051.8e3,
    color: '#fe8',
  },
  earth: {
    eccentricity: 0.0167086,
    semiMajorAxis: 149597870.7e3, // 1 AU
    inclination: 0.00005,
    longitudeAscending: -11.26064,
    argumentOfPeriapsis: 114.20783,
    trueAnomaly: 0,
    mass: 5.972168e24,
    radius: 6371e3,
    color: '#3fb',
  },
  mars: {
    eccentricity: 0.0935,
    semiMajorAxis: 227939200e3,
    inclination: 1.85,
    longitudeAscending: 49.558,
    argumentOfPeriapsis: 286.502,
    trueAnomaly: 0,
    mass: 6.4171e23,
    radius: 3389.5e3,
    color: '#f53',
  },
  ceres: {
    eccentricity: 0.075823,
    semiMajorAxis: 413690250e3,
    inclination: 10.594,
    longitudeAscending: 80.305,
    argumentOfPeriapsis: 73.597,
    trueAnomaly: 0,
    mass: 9.3839e20,
    radius: 966.2e3,
    color: '#bbb',
  },
  jupiter: {
    eccentricity: 0.0489,
    semiMajorAxis: 778340821e3,
    inclination: 1.305,
    longitudeAscending: 100.556,
    argumentOfPeriapsis: 14.753,
    trueAnomaly: 0,
    mass: 1.8982e27,
    radius: 69911e3,
    color: '#fa2',
  },
  saturn: {
    eccentricity: 0.0565,
    semiMajorAxis: 1433449370e3,
    inclination: 2.485,
    longitudeAscending: 113.715,
    argumentOfPeriapsis: 92.431,
    trueAnomaly: 0,
    mass: 5.6834e26,
    radius: 58232e3,
    color: '#faa',
  },
  uranus: {
    eccentricity: 0.0457,
    semiMajorAxis: 2876679082e3,
    inclination: 0.772,
    longitudeAscending: 74.006,
    argumentOfPeriapsis: 170.964,
    trueAnomaly: 0,
    mass: 8.681e25,
    radius: 25362e3,
    color: '#fec',
  },
  neptune: {
    eccentricity: 0.0086,
    semiMajorAxis: 4503443661e3,
    inclination: 1.77,
    longitudeAscending: 131.784,
    argumentOfPeriapsis: 44.971,
    trueAnomaly: 0,
    mass: 1.02409e26,
    radius: 24622e3,
    color: '#2bc',
  },
  pluto: {
    eccentricity: 0.2488,
    semiMajorAxis: 5906440628e3,
    inclination: 17.16,
    longitudeAscending: 110.299,
    argumentOfPeriapsis: 113.834,
    trueAnomaly: 0,
    mass: 1.3025e22,
    radius: 1188.3e3,
    color: '#ddd',
  },
};

export const CELESTIAL_OBJECTS: Array<CelestialObject> = keys(ELEMENTS);
export const ORBITAL_PERIODS: Record<CelestialObject, number> = map(
  (e: KeplerianElements) => orbitalPeriod(e.semiMajorAxis, ELEMENTS.sol.mass),
  ELEMENTS
);

export const MU_SUN = ELEMENTS.sol.mass * G; // 1.32712440018e20; // m^3/s^2, gravitational parameter for the Sun
