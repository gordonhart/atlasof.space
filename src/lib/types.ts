import { Thumbnail } from './images.ts';

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

export type CelestialBodyType = 'sun' | 'planet' | 'moon' | 'asteroid' | 'trans-neptunian-object' | 'belt';
export type CelestialBody = KeplerianElements & {
  name: string;
  shortName?: string;
  thumbnail?: Thumbnail;
  mass: number; // kg
  radius: number; // m
  // TODO: initial rotation?
  // TODO: axis of rotation?
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
