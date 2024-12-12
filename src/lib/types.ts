export type Point2 = [number, number];
export type Point3 = [number, number, number];

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

export type CartesianState = {
  position: Point3; // meters
  velocity: Point3; // meters per second
};
