export type Point2 = [number, number];
export type Point3 = [number, number, number];
export type CartesianState = {
  position: Point3; // meters
  velocity: Point3; // meters per second
};

export type Epoch = {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  // no time zone necessary; always UTC
};

export type KeplerianElements = {
  // parent body that these elements are given with respect to, e.g. 'Jupiter' for a moon. null for the Sun
  wrt: string | null;
  epoch: Epoch;
  eccentricity: number; // ratio
  semiMajorAxis: number; // meters
  inclination: number; // degrees
  longitudeAscending: number; // degrees
  argumentOfPeriapsis: number; // degrees
  // true anomaly is almost never provided; derive from mean anomaly + eccentricity
  meanAnomaly: number; // degrees
};

export type RotationElements = {
  // TODO: initial rotation?
  axialTilt: number; // degrees, also known as 'obliquity', given WRT orbital plane
  siderealPeriod: number; // seconds
};

export type Ring = {
  name: string; // name of this ring
  start: number; // meters from the center of the parent
  end: number; // meters from the center of the parent
};

export type CelestialBodyFact = {
  label: string;
  value: string;
};

export enum CelestialBodyType {
  STAR = 'star',
  PLANET = 'planet',
  MOON = 'moon',
  DWARF_PLANET = 'dwarf-planet',
  ASTEROID = 'asteroid',
  COMET = 'comet',
  TRANS_NEPTUNIAN_OBJECT = 'trans-neptunian-object',
  SPACECRAFT = 'spacecraft',
}
export const CelestialBodyTypes: Array<CelestialBodyType> = [
  CelestialBodyType.STAR,
  CelestialBodyType.PLANET,
  CelestialBodyType.MOON,
  CelestialBodyType.DWARF_PLANET,
  CelestialBodyType.ASTEROID,
  CelestialBodyType.COMET,
  CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  CelestialBodyType.SPACECRAFT,
];

export type CelestialBody = {
  type: CelestialBodyType;
  name: string;
  shortName?: string;
  influencedBy: Array<string>; // name of bodies influencing this body's motion
  mass: number; // kg
  radius: number; // m
  elements: KeplerianElements;
  rotation?: RotationElements; // leave empty to omit spin
  rings?: Array<Ring>;
  color: `#${string}`; // hex
  facts?: Array<CelestialBodyFact>;
};

export type Belt = {
  min: number;
  max: number;
};
