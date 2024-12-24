export type Point2 = [number, number];
export type Point3 = [number, number, number];
export type CartesianState = {
  position: Point3; // meters
  velocity: Point3; // meters per second
};

export type KeplerianElements = {
  epoch: string; // e.g. 'J2000'
  eccentricity: number; // ratio
  semiMajorAxis: number; // meters
  inclination: number; // degrees
  longitudeAscending: number; // degrees
  argumentOfPeriapsis: number; // degrees
  // true anomaly is almost never provided; derive from mean anomaly + eccentricity
  meanAnomaly: number; // degrees
};

export type CelestialBodyType =
  | 'star'
  | 'planet'
  | 'moon'
  | 'dwarf-planet'
  | 'asteroid'
  | 'comet'
  | 'belt'
  | 'trans-neptunian-object';
export const CelestialBodyTypes: Array<CelestialBodyType> = [
  'star',
  'planet',
  'moon',
  'dwarf-planet',
  'asteroid',
  'comet',
  // 'belt',
  'trans-neptunian-object',
];

export type CelestialBody = {
  name: string;
  shortName?: string;
  mass: number; // kg
  radius: number; // m
  elements: KeplerianElements;
  // TODO: initial rotation?
  // TODO: axial tilt?
  siderealRotationPeriod?: number; // seconds, leave empty to omit spin indicator
  color: `#${string}`; // hex
  satellites: Array<CelestialBody>; // keplerian elements in reference to parent body
  type: CelestialBodyType;
};

export type CelestialBodyState = Omit<CelestialBody, 'satellites'> &
  CartesianState & {
    rotation: number; // degrees
    satellites: Array<CelestialBodyState>;
  };

export type Belt = {
  min: number;
  max: number;
};
