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

export type CelestialBodyId = `body/${string}`;

export type RotationElements = {
  axialTilt: number; // degrees, also known as 'obliquity', given WRT orbital plane
  siderealPeriod: number; // seconds
  initialRotation?: number;
};

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
  // include rotation with orbital elements because initialRotation is epoch-dependent
  rotation?: RotationElements; // leave empty to omit spin
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

export type GalleryAsset = {
  filename: string;
  caption?: string;
};

export type WikiLink = `https://${string}.wikipedia.org/wiki/${string}`;

export type CelestialBodyAssets = {
  thumbnail?: string;
  texture?: string;
  gallery?: Array<GalleryAsset>;
  search?: string; // optionally specify slug to search wikidata, overriding default ${name}+${type}
  wiki?: WikiLink;
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

export enum OrbitalRegimeId {
  INNER_SYSTEM = 'regime/inner-system',
  ASTEROID_BELT = 'regime/asteroid-belt',
  OUTER_SYSTEM = 'regime/outer-system',
  KUIPER_BELT = 'regime/kuiper-belt',
  INNER_OORT_CLOUD = 'regime/inner-oort-cloud',
  EARTH_SYSTEM = 'regime/earth-system',
}

export type HexColor = `#${string}`;
export type CelestialBodyStyle = {
  fgColor: HexColor; // main color for the body
  bgColor?: HexColor; // when absent, use fgColor -- used for orbit ellipses and other "background" elements
};

export type CelestialBody = {
  id: CelestialBodyId;
  type: CelestialBodyType;
  name: string;
  shortName?: string;
  influencedBy: Array<CelestialBodyId>; // bodies influencing this body's motion
  orbitalRegime?: OrbitalRegimeId;
  mass: number; // kg -- TODO: add uncertainty? mark when it's an estimate?
  radius: number; // m -- TODO: describe non-spherical geometries?
  elements: KeplerianElements;
  rings?: Array<Ring>;
  style: CelestialBodyStyle;
  assets?: CelestialBodyAssets;
  facts?: Array<CelestialBodyFact>;
};

export type OrbitalRegime = {
  id: OrbitalRegimeId;
  wrt: CelestialBodyId;
  min: number;
  max: number;
  roundness: number; // 1 for torus, <1 for flattened disk, >1 for stretched vertically (solar north)
};

export enum SpacecraftOrganizationId {
  NASA = 'organization/nasa',
  USSR = 'organization/ussr',
  ESA = 'organization/esa',
  JAXA = 'organization/jaxa',
  CNSA = 'organization/cnsa',
}

export type SpacecraftOrganization = {
  id: SpacecraftOrganizationId;
  name: string;
  shortName: string;
  founded: Date; // TODO: also add details?
  dissolved?: Date;
  thumbnail: string;
  wiki: WikiLink;
  color: HexColor;
};

// TODO: mixing concerns here -- some are identity-related, others are visit-related
export enum SpacecraftVisitType {
  FLYBY = 'Flyby',
  GRAVITY_ASSIST = 'Gravity Assist',
  ORBITER = 'Orbiter',
  LANDER = 'Lander',
  ROVER = 'Rover',
  HELICOPTER = 'Helicopter',
  IMPACTOR = 'Impactor',
}

export enum SpacecraftStatus {
  OPERATIONAL = 'Operational',
  DEFUNCT = 'Defunct',
  DECOMMISSIONED = 'Decommissioned',
  RETURNED = 'Returned',
  CRASHED = 'Crashed',
}

export type SpacecraftId = `spacecraft/${string}`;

// TODO: many spacecraft fly by an object multiple times -- is it worth representing that? tons of data to transcribe
export type SpacecraftVisit = {
  id: CelestialBodyId;
  type: SpacecraftVisitType;
  start: Date;
  end?: Date;
};

export type Spacecraft = {
  id: SpacecraftId;
  name: string;
  organization: SpacecraftOrganizationId;
  launchMass: number; // kg
  power?: number; // watts
  start: Date; // TODO: rename to launchDate?
  end?: Date;
  focusId?: CelestialBodyId; // center visualization on this body, if specified
  orbitalRegimes: Array<OrbitalRegimeId>;
  missionFamily?: string;
  cost?: number; // TODO: populate; also may need more involved definition with value, currency, and date
  status: { status: SpacecraftStatus; details?: string };
  thumbnail?: string;
  wiki: WikiLink;
  crew?: Array<string>;
  visited: Array<SpacecraftVisit>;
  color: HexColor;
};

export function asCelestialBodyId(slug: string): CelestialBodyId {
  return `body/${slug}`;
}
export function asOrbitalRegimeId(slug: string): OrbitalRegimeId {
  return `regime/${slug}` as OrbitalRegimeId;
}
export function asSpacecraftId(slug: string): SpacecraftId {
  return `spacecraft/${slug}`;
}
export function asOrganizationId(slug: string): SpacecraftOrganizationId {
  return `organization/${slug}` as SpacecraftOrganizationId;
}

export function isCelestialBodyId(id: unknown): id is CelestialBodyId {
  return id != null && typeof id === 'string' && id.startsWith('body/');
}
export function isOrbitalRegimeId(id: unknown): id is OrbitalRegimeId {
  return id != null && typeof id === 'string' && id.startsWith('regime/');
}
export function isSpacecraftId(id: unknown): id is SpacecraftId {
  return id != null && typeof id === 'string' && id.startsWith('spacecraft/');
}
export function isOrganizationId(id: unknown): id is SpacecraftOrganizationId {
  return id != null && typeof id === 'string' && id.startsWith('organization/');
}

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
    Object.values(OrbitalRegimeId).includes(obj.id as OrbitalRegimeId)
  );
}
export function isSpacecraft(obj: unknown): obj is Spacecraft {
  return (
    obj != null &&
    typeof obj === 'object' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'organization' in obj &&
    typeof obj.organization === 'string' &&
    Object.values(SpacecraftOrganizationId).includes(obj.organization as SpacecraftOrganizationId)
  );
}
export function isOrganization(obj: unknown): obj is SpacecraftOrganization {
  return (
    obj != null &&
    typeof obj === 'object' &&
    'id' in obj &&
    typeof obj.id === 'string' &&
    Object.values(SpacecraftOrganizationId).includes(obj.id as SpacecraftOrganizationId)
  );
}
