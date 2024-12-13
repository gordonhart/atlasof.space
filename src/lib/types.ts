export type Point2 = [number, number];
export type Point3 = [number, number, number];
export type CartesianState = {
  position: Point3; // meters
  velocity: Point3; // meters per second
};

export type KeplerianElements = {
  eccentricity: number; // ratio
  semiMajorAxis: number; // meters
  inclination: number; // degrees
  longitudeAscending: number; // degrees
  argumentOfPeriapsis: number; // degrees
  trueAnomaly: number; // degrees
};

export type CelestialBody = KeplerianElements & {
  name: string;
  mass: number; // kg
  radius: number; // m
  color: `#${string}`; // hex
  satellites: Array<CelestialBody>; // keplerian elements in reference to parent body
};

export type CelestialBodyState = Omit<CelestialBody, 'satellites'> &
  CartesianState & { satellites: Array<CelestialBodyState> };
