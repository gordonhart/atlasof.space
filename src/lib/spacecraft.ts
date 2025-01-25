import * as Bodies from './bodies.ts';
import { CelestialBodyId } from './types.ts';

export enum SpacecraftOrganization {
  NASA = 'NASA',
  ESA = 'ESA',
  JAXA = 'JAXA',
  ROSCOSMOS = 'ROSCOSMOS',
}

export type SpacecraftOrganizationDetails = {
  organization: SpacecraftOrganization;
  name: string;
  shortName: string;
  thumbnail: string;
};

const NASA: SpacecraftOrganizationDetails = {
  organization: SpacecraftOrganization.NASA,
  name: 'National Aeronautics and Space Administration',
  shortName: 'NASA',
  thumbnail: 'nasa-meatball.svg',
};
const ESA: SpacecraftOrganizationDetails = {
  organization: SpacecraftOrganization.ESA,
  name: 'European Space Agency',
  shortName: 'ESA',
  thumbnail: 'esa-logo.png',
};
const ROSCOSMOS: SpacecraftOrganizationDetails = {
  organization: SpacecraftOrganization.ROSCOSMOS,
  name: 'State Corporation for Space Activities',
  shortName: 'Roscosmos',
  thumbnail: 'roscosmos-logo.png',
};
const JAXA: SpacecraftOrganizationDetails = {
  organization: SpacecraftOrganization.JAXA,
  name: 'Japan Aerospace Exploration Agency',
  shortName: 'JAXA',
  thumbnail: 'jaxa-logo.png',
};
export const SPACECRAFT_ORGANIZATIONS: Record<SpacecraftOrganization, SpacecraftOrganizationDetails> = {
  [SpacecraftOrganization.NASA]: NASA,
  [SpacecraftOrganization.ESA]: ESA,
  [SpacecraftOrganization.ROSCOSMOS]: ROSCOSMOS,
  [SpacecraftOrganization.JAXA]: JAXA,
};

// TODO: mixing concerns here -- some are identity-related, others are visit-related
export enum SpacecraftVisitType {
  FLYBY = 'Flyby',
  GRAVITY_ASSIST = 'Gravity Assist',
  ORBITER = 'Orbiter',
  LANDER = 'Lander',
  ROVER = 'Rover',
  HELICOPTER = 'Helicopter',
}

export enum SpacecraftStatus {
  OPERATIONAL = 'Operational',
  DEFUNCT = 'Defunct',
  DECOMMISSIONED = 'Decommissioned',
  CRASHED = 'Crashed',
}

export type Spacecraft = {
  name: string;
  organization: SpacecraftOrganization;
  launchMass: number; // kg
  power: number; // watts
  start: Date; // TODO: rename to launchDate?
  end?: Date;
  status: { status: SpacecraftStatus; details?: string };
  thumbnail?: string;
  wiki: string;
  crew?: Array<string>;
  // TODO: many spacecraft fly by an object multiple times -- is it worth representing that? tons of data to transcribe
  visited: Array<{
    id: CelestialBodyId;
    type: SpacecraftVisitType;
    start: Date;
    end?: Date;
  }>;
};

export const VOYAGER_1: Spacecraft = {
  name: 'Voyager 1',
  organization: SpacecraftOrganization.NASA,
  launchMass: 815,
  power: 470,
  start: new Date('1977-09-05T12:56:01Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'voyager-1.png',
  wiki: 'https://en.wikipedia.org/wiki/Voyager_1',
  visited: [
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-03-05T12:00:00Z') },
    // { id: Bodies.AMALTHEA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-03-05T12:00:00Z') }, // TODO
    { id: Bodies.IO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-03-05T15:14:00Z') },
    { id: Bodies.EUROPA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-03-05T18:19:00Z') },
    { id: Bodies.GANYMEDE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-03-06T02:15:00Z') },
    { id: Bodies.CALLISTO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-03-06T17:08:00Z') },
    { id: Bodies.SATURN.id, type: SpacecraftVisitType.FLYBY, start: new Date('1980-11-12T12:00:00Z') },
    { id: Bodies.TITAN.id, type: SpacecraftVisitType.FLYBY, start: new Date('1980-11-12T05:41:00Z') },
    { id: Bodies.TETHYS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1980-11-12T22:16:00Z') },
    { id: Bodies.MIMAS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1980-11-13T01:43:00Z') },
    { id: Bodies.ENCELADUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1980-11-13T01:51:00Z') },
    { id: Bodies.RHEA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1980-11-13T06:21:00Z') },
    { id: Bodies.HYPERION.id, type: SpacecraftVisitType.FLYBY, start: new Date('1980-11-13T16:44:00Z') },
  ],
};

export const VOYAGER_2: Spacecraft = {
  name: 'Voyager 2',
  organization: SpacecraftOrganization.NASA,
  launchMass: 721.9,
  power: 470,
  start: new Date('1977-08-20T14:29:00Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'voyager-2.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Voyager_2',
  visited: [
    {
      id: Bodies.JUPITER.id,
      type: SpacecraftVisitType.FLYBY,
      start: new Date('1979-07-08T12:00:00Z'),
      end: new Date('1979-08-05T12:00:00Z'),
    },
    { id: Bodies.CALLISTO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-07-08T12:21:00Z') },
    { id: Bodies.GANYMEDE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-07-09T07:14:00Z') },
    { id: Bodies.EUROPA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-07-09T17:53:00Z') },
    // { id: Bodies.AMALTHEA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-07-09T20:01:00Z') }, // TODO
    { id: Bodies.IO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-07-09T23:17:00Z') },
    {
      id: Bodies.SATURN.id,
      type: SpacecraftVisitType.FLYBY,
      start: new Date('1981-06-05T00:00:00Z'),
      end: new Date('1981-09-25T00:00:00Z'),
    },
    { id: Bodies.IAPETUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-22T01:26:57Z') },
    { id: Bodies.HYPERION.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-25T01:25:26Z') },
    { id: Bodies.TITAN.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-25T09:37:46Z') },
    // { id: Bodies.HELENE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-25T22:57:33Z') }, // TODO
    { id: Bodies.DIONE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T01:04:32Z') },
    // { id: Bodies.CALYPSO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T02:22:17Z') }, // TODO
    { id: Bodies.MIMAS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T02:24:26Z') },
    // { id: Bodies.PANDORA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T03:19:18Z') }, // TODO
    // { id: Bodies.ATLAS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T03:33:02Z') }, // TODO
    { id: Bodies.ENCELADUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T03:45:16Z') },
    // { id: Bodies.JANUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T03:50:04Z') }, // TODO
    // { id: Bodies.EPIMETHEUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T04:05:56Z') }, // TODO
    // { id: Bodies.TELESTO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T06:02:47Z') }, // TODO
    { id: Bodies.TETHYS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T06:12:30Z') },
    { id: Bodies.RHEA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-08-26T06:28:48Z') },
    { id: Bodies.PHOEBE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1981-09-04T01:22:34Z') },
    {
      id: Bodies.URANUS.id,
      type: SpacecraftVisitType.FLYBY,
      start: new Date('1985-11-04T00:00:00Z'),
      end: new Date('1986-02-25T00:00:00Z'),
    },
    { id: Bodies.MIRANDA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1986-01-24T16:50:00Z') },
    { id: Bodies.ARIEL.id, type: SpacecraftVisitType.FLYBY, start: new Date('1986-01-24T17:25:00Z') },
    { id: Bodies.UMBRIEL.id, type: SpacecraftVisitType.FLYBY, start: new Date('1986-01-24T17:25:00Z') },
    { id: Bodies.TITANIA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1986-01-24T17:25:00Z') },
    { id: Bodies.OBERON.id, type: SpacecraftVisitType.FLYBY, start: new Date('1986-01-24T17:25:00Z') },
    {
      id: Bodies.NEPTUNE.id,
      type: SpacecraftVisitType.FLYBY,
      start: new Date('1989-06-05T00:00:00Z'),
      end: new Date('1989-10-02T00:00:00Z'),
    },
    { id: Bodies.GALATEA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1989-08-25T04:41:00Z') },
    { id: Bodies.LARISSA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1989-08-25T04:51:00Z') },
    { id: Bodies.PROTEUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1989-08-25T05:29:00Z') },
    { id: Bodies.TRITON.id, type: SpacecraftVisitType.FLYBY, start: new Date('1989-08-25T09:23:00Z') },
  ],
};

export const CASSINI: Spacecraft = {
  name: 'Cassini',
  organization: SpacecraftOrganization.NASA,
  launchMass: 5712,
  power: 885,
  start: new Date('1997-10-15T08:43:00Z'),
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: "Intentionally flown into Saturn's atmosphere on September 15th, 2017",
  },
  thumbnail: 'cassini-huygens.gif',
  wiki: 'https://en.wikipedia.org/wiki/Cassini%E2%80%93Huygens',
  visited: [
    // traveling to Saturn
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('1998-04-26T12:00:00Z') },
    { id: Bodies.LUNA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1999-08-18T03:28:00Z') },
    // TODO: 2685 Masurksy (asteroid) flyby on 2000-01-23
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2000-12-30T10:05:00Z') },
    // primary mission
    {
      id: Bodies.SATURN.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('2004-05-18T12:00:00Z'),
      end: new Date('2017-09-15T11:55:00Z'),
    },
    // TODO: Prometheus, Pandora
    { id: Bodies.PHOEBE.id, type: SpacecraftVisitType.FLYBY, start: new Date('2004-05-27T12:00:00Z') },
    { id: Bodies.TITAN.id, type: SpacecraftVisitType.FLYBY, start: new Date('2004-07-02T12:00:00Z') },
    { id: Bodies.IAPETUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('2004-12-31T18:45:37Z') },
    { id: Bodies.ENCELADUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('2005-02-17T12:00:00Z') },
    { id: Bodies.HYPERION.id, type: SpacecraftVisitType.FLYBY, start: new Date('2005-09-26T12:00:00Z') },
    // solstice+equinox mission
    { id: Bodies.RHEA.id, type: SpacecraftVisitType.FLYBY, start: new Date('2005-11-26T22:37:00Z') },
    { id: Bodies.DIONE.id, type: SpacecraftVisitType.FLYBY, start: new Date('2010-04-07T12:00:00Z') },
  ],
};

export const HUYGENS: Spacecraft = {
  name: 'Huygens',
  organization: SpacecraftOrganization.ESA,
  launchMass: 320,
  power: 600, // 1800 Wh, estimated battery life of 3 hours
  start: new Date('1997-10-15T08:43:00Z'),
  status: { status: SpacecraftStatus.DEFUNCT },
  thumbnail: 'huygens-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Huygens_(spacecraft)',
  visited: [{ id: Bodies.TITAN.id, type: SpacecraftVisitType.LANDER, start: new Date('2005-01-14T12:43:00Z') }],
};

export const CURIOSITY: Spacecraft = {
  name: 'Curiosity',
  organization: SpacecraftOrganization.NASA,
  launchMass: 899,
  power: 100,
  start: new Date('2011-11-26T15:02:00Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'curiosity-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Curiosity_(rover)',
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.ROVER, start: new Date('2012-08-06T05:17:00Z') }],
};

export const PERSEVERANCE: Spacecraft = {
  name: 'Perseverance',
  organization: SpacecraftOrganization.NASA,
  launchMass: 1025,
  power: 110,
  start: new Date('2020-07-30T11:50:00Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'perseverance-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Perseverance_(rover)',
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.ROVER, start: new Date('2021-02-18T20:55:00Z') }],
};

export const INGENUITY: Spacecraft = {
  name: 'Ingenuity',
  organization: SpacecraftOrganization.NASA,
  launchMass: 1.8,
  power: 350,
  start: new Date('2020-07-30T11:50:00Z'),
  end: new Date('2024-01-18T12:00:00Z'),
  status: {
    status: SpacecraftStatus.DEFUNCT,
    details: 'Retired in 2024 due to sustained rotor damage',
  },
  thumbnail: 'ingenuity-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Ingenuity_(helicopter)',
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.HELICOPTER, start: new Date('2021-02-18T20:55:00Z') }],
};

export const NEW_HORIZONS: Spacecraft = {
  name: 'New Horizons',
  organization: SpacecraftOrganization.NASA,
  launchMass: 478,
  power: 245,
  start: new Date('2006-01-19T19:00:00Z'),
  status: {
    status: SpacecraftStatus.OPERATIONAL,
    details: 'Currently traveling through the Kuiper belt',
  },
  thumbnail: 'new-horizons-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/New_Horizons',
  visited: [
    // TODO: flyby of asteroid 132524 APL
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.FLYBY, start: new Date('2007-02-28T12:00:00Z') },
    // Pluto phase
    {
      id: Bodies.PLUTO.id,
      type: SpacecraftVisitType.FLYBY,
      start: new Date('2015-03-10T12:00:00Z'),
      end: new Date('2015-07-14T12:00:00Z'),
    },
    { id: Bodies.CHARON.id, type: SpacecraftVisitType.FLYBY, start: new Date('2015-07-14T12:03:00Z') },
    { id: Bodies.HYDRA.id, type: SpacecraftVisitType.FLYBY, start: new Date('2015-07-14T12:00:00Z') },
    { id: Bodies.NIX.id, type: SpacecraftVisitType.FLYBY, start: new Date('2015-07-14T12:00:00Z') },
    { id: Bodies.KERBEROS.id, type: SpacecraftVisitType.FLYBY, start: new Date('2015-07-14T12:00:00Z') },
    { id: Bodies.STYX.id, type: SpacecraftVisitType.FLYBY, start: new Date('2015-07-14T12:00:00Z') },
    // Kuiper belt phase
    { id: Bodies.ARROKOTH.id, type: SpacecraftVisitType.FLYBY, start: new Date('2019-01-01T12:00:00Z') },
    // TODO: add 15810 Arawn
  ],
};

// export const NEW_HORIZONS: Spacecraft = {}
// export const PARKER_SOLAR_PROBE: Spacecraft = {}

export const SPACECRAFT: Array<Spacecraft> = [
  VOYAGER_1,
  VOYAGER_2,
  CASSINI,
  HUYGENS,
  NEW_HORIZONS,
  // PARKER_SOLAR_PROBE,
  // GALILEO,
  // MESSENGER,
  // BEPICOLOMBO,
  // SOLAR_ORBITER,

  // Mars
  CURIOSITY,
  PERSEVERANCE,
  INGENUITY,
  // SOJOURNER,
  // SPIRIT,
  // OPPORTUNITY,
  // ZHURONG,
  // MARS_2,
  // MARS_3,
  // MARS_RECONNAISSANCE_ORBITER,
  // VIKING_1,
  // VIKING_2,
  // MARS_PATHFINDER,
  // PHOENIX,
  // INSIGHT,

  // Venus
  // VENERA_1,
  // MARINER_2,
  // ZOND_1,
  // VENERA_2,
  // VENERA_3,
  // VENERA_4,
  // MARINER_5,
  // VENERA_5,
  // VENERA_6,
  // VENERA_7,
  // VENERA_8,
  // MARINER_10,
  // VENERA_9,
  // VENERA_10,
  // VENERA_11,
  // VENERA_12,
  // PIONEER_VENUS_1,
  // PIONEER_VENUS_2,
  // VENERA_13,
  // VENERA_14,
  // VENERA_15,
  // VENERA_16,
  // VEGA_1,
  // VEGA_2,
  // MAGELLAN,
  // VENUS_EXPRESS,
  // AKATSUKI,
  // IKAROS,
  // SHINEN,

  // Asteroids
  // PIONEER_10,
  // NEAR_SHOEMAKER,
  // DEEP_SPACE_1,
  // STARDUST,
  // HAYABUSA,
  // ROSETTA,
  // DEEP_IMPACT,
  // DAWN,
  // CHANGE_2,
  // HAYABUSA_2,
  // OSIRIS_REX,
  // LUCY,
  // DART,
  // PSYCHE,
  // HERA,
];

// TODO: sort by ascending visit date?
export const SPACECRAFT_BY_BODY_ID = SPACECRAFT.reduce<Record<CelestialBodyId, Array<Spacecraft>>>(
  (acc, spacecraft) => {
    spacecraft.visited.forEach(visited => {
      acc[visited.id] = [...(acc[visited.id] ?? []), spacecraft];
    });
    return acc;
  },
  {}
);

export function isSpacecraft(obj: unknown): obj is Spacecraft {
  return (
    obj != null &&
    typeof obj === 'object' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'organization' in obj &&
    typeof obj.organization === 'string' &&
    Object.values(SpacecraftOrganization).includes(obj.organization as SpacecraftOrganization)
  );
}
