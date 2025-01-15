export type Point2 = [number, number];
export type Point3 = [number, number, number];
export type CartesianState = {
  position: Point3; // meters
  velocity: Point3; // meters per second
};

export type Epoch = {
  name: string;
  year: number;
  month: number; // index, e.g. January = 0
  day: number;
  hour: number;
  minute: number;
  second: number;
  // no time zone necessary; always UTC
};

export type CelestialBodyId = string;
export type KeplerianElements = {
  // parent body that these elements are given with respect to, e.g. 'jupiter' for a moon. null for the Sun
  wrt: CelestialBodyId | null;
  epoch: Epoch;
  source?: string; // optionally include a citation, link, or blurb about data source
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
  texture?: string;
};

export type CelestialBodyFact = {
  label: string;
  value: string;
};

export type CelestialBodyAssets = {
  thumbnail?: string;
  texture?: string;
  gallery?: Array<string>;
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

export enum HeliocentricOrbitalRegime {
  INNER_SYSTEM = 'inner-system',
  ASTEROID_BELT = 'asteroid-belt',
  OUTER_SYSTEM = 'outer-system',
  KUIPER_BELT = 'kuiper-belt',
  INNER_OORT_CLOUD = 'inner-oort-cloud',
}

export type CelestialBody = {
  id: CelestialBodyId;
  type: CelestialBodyType;
  name: string;
  shortName?: string;
  influencedBy: Array<CelestialBodyId>; // bodies influencing this body's motion
  orbitalRegime?: HeliocentricOrbitalRegime;
  mass: number; // kg
  radius: number; // m
  elements: KeplerianElements;
  rotation?: RotationElements; // leave empty to omit spin
  rings?: Array<Ring>;
  color: `#${string}`; // hex
  assets?: CelestialBodyAssets;
  facts?: Array<CelestialBodyFact>;
};

export type OrbitalRegime = {
  id: HeliocentricOrbitalRegime;
  min: number;
  max: number;
  roundness: number; // 1 for torus, <1 for flattened disk, >1 for stretched vertically (solar north)
};

export function isCelestialBody(obj: unknown): obj is CelestialBody {
  return (
    obj != null &&
    typeof obj === 'object' &&
    'type' in obj &&
    typeof obj.type === 'string' &&
    CelestialBodyTypes.includes(obj.type as CelestialBodyType)
  );
}

export function isOrbitalRegime(obj: unknown): obj is OrbitalRegime {
  return (
    obj != null &&
    typeof obj === 'object' &&
    'id' in obj &&
    typeof obj.id === 'string' &&
    Object.values(HeliocentricOrbitalRegime).includes(obj.id as HeliocentricOrbitalRegime)
  );
}
