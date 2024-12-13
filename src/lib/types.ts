export type Point2 = [number, number];
export type Point3 = [number, number, number];
export type CartesianState = {
  position: Point3; // meters
  velocity: Point3; // meters per second
};

export type CelestialBodyName =
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

export type CelestialBody = KeplerianElements & {
  mass: number; // kg
  radius: number; // m
  color: `#${string}`; // hex
  // TODO: union type for name?
  moons?: Record<string, CelestialBody>; // keplerian elements in reference to main body
};
