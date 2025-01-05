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

export type KeplerianElements = {
  // parent body that these elements are given with respect to, e.g. 'Jupiter' for a moon. null for the Sun
  wrt: string | null;
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

export enum HeliocentricOrbitalRegime {
  INNER_SYSTEM = 'Inner System',
  ASTEROID_BELT = 'Asteroid Belt',
  OUTER_SYSTEM = 'Outer System',
  KUIPER_BELT = 'Kuiper Belt',
  INNER_OORT_CLOUD = 'Inner Oort Cloud',
}

export type CelestialBody = {
  type: CelestialBodyType;
  name: string;
  shortName?: string;
  influencedBy: Array<string>; // name of bodies influencing this body's motion
  orbitalRegime?: HeliocentricOrbitalRegime;
  mass: number; // kg
  radius: number; // m
  elements: KeplerianElements;
  rotation?: RotationElements; // leave empty to omit spin
  rings?: Array<Ring>;
  color: `#${string}`; // hex
  facts?: Array<CelestialBodyFact>;
};

export type OrbitalRegime = {
  name: HeliocentricOrbitalRegime;
  min: number;
  max: number;
  roundness: number; // 1 for torus, <1 for flattened disk, >1 for stretched vertically (solar north)
};

// user-pilotable spacecraft
export type SpacecraftControls = {
  launch: boolean;
  fire: boolean;
  rotate: 'port' | 'starboard' | null; // rotation relative to current heading
};
export type Spacecraft = {
  name: string;
  mass: number; // kg
  thrust: number; // newtons
  launchLocation: string; // name of celestial body, start on the surface
  launchVelocity: number; // m/s
  launchDirection: Point3; // ecliptic unit vector, e.g. vernal equinox = [1, 0, 0]
  launchTime: number | null; // offset from t0 as determined by settings, null before launch
  color: `#${string}`; // hex
  controls: SpacecraftControls;
  // TODO: burn with different intensity?
  // TODO: burn fuel through time?
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
    'name' in obj &&
    typeof obj.name === 'string' &&
    Object.values(HeliocentricOrbitalRegime).includes(obj.name as HeliocentricOrbitalRegime)
  );
}
