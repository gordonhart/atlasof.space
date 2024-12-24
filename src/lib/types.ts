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

export enum CelestialBodyType {
  STAR = 'star',
  PLANET = 'planet',
  MOON = 'moon',
  DWARF_PLANET = 'dwarf-planet',
  ASTEROID = 'asteroid',
  COMET = 'comet',
  BELT = 'belt',
  TRANS_NEPTUNIAN_OBJECT = 'trans-neptunian-object',
}
export const CelestialBodyTypes: Array<CelestialBodyType> = [
  CelestialBodyType.STAR,
  CelestialBodyType.PLANET,
  CelestialBodyType.MOON,
  CelestialBodyType.DWARF_PLANET,
  CelestialBodyType.ASTEROID,
  CelestialBodyType.COMET,
  // CelestialBodyType.BELT,
  CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
];

export type CelestialBody = {
  type: CelestialBodyType;
  name: string;
  shortName?: string;
  influencedBy: Array<string>; // name of bodies influencing this body's motion
  mass: number; // kg
  radius: number; // m
  elements: KeplerianElements;
  // TODO: initial rotation?
  // TODO: axial tilt?
  siderealRotationPeriod?: number; // seconds, leave empty to omit spin indicator
  color: `#${string}`; // hex
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
