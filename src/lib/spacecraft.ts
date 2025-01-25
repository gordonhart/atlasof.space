import * as Bodies from './bodies.ts';
import { CelestialBodyId } from './types.ts';

export type SpacecraftOrganization = {
  name: string;
};

export const NASA: SpacecraftOrganization = {
  name: 'NASA',
};
export const ESA: SpacecraftOrganization = {
  name: 'ESA',
};
export const ROSCOSMOS: SpacecraftOrganization = {
  name: 'Roscosmos',
};

export enum SpacecraftVisitType {
  FLYBY = 'flyby',
  ORBIT = 'orbit',
  LANDING = 'landing',
}

export type Spacecraft = {
  name: string;
  organization: SpacecraftOrganization;
  launchMass: number; // kg
  power: number; // watts
  start: Date;
  end?: Date;
  thumbnail: string;
  visited: Array<{
    id: CelestialBodyId;
    type: SpacecraftVisitType;
    start: Date;
    end?: Date;
  }>;
};

export const VOYAGER_1: Spacecraft = {
  name: 'Voyager 1',
  organization: NASA,
  launchMass: 815,
  power: 470,
  start: new Date('1977-09-05T12:56:01Z'),
  thumbnail: 'voyager-1.png',
  visited: [
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-03-05T12:00:00Z') },
    { id: Bodies.SATURN.id, type: SpacecraftVisitType.FLYBY, start: new Date('1980-11-12T12:00:00Z') },
    { id: Bodies.TITAN.id, type: SpacecraftVisitType.FLYBY, start: new Date('1980-11-12T12:00:00Z') },
  ],
};

export const SPACECRAFT: Array<Spacecraft> = [VOYAGER_1];

export const SPACECRAFT_BY_BODY_ID = SPACECRAFT.reduce<Record<CelestialBodyId, Array<Spacecraft>>>(
  (acc, spacecraft) => {
    spacecraft.visited.forEach(visited => {
      acc[visited.id] = [...(acc[visited.id] ?? []), spacecraft];
    });
    return acc;
  },
  {}
);
