import { map } from 'ramda';
import * as Bodies from './bodies.ts';
import { CelestialBodyId } from './types.ts';

export enum SpacecraftOrganization {
  NASA = 'NASA',
  ESA = 'ESA',
  JAXA = 'JAXA',
}

export type SpacecraftOrganizationDetails = {
  name: string;
  shortName: string;
  thumbnail: string;
};

export const SPACECRAFT_ORGANIZATIONS: Record<SpacecraftOrganization, SpacecraftOrganizationDetails> = {
  [SpacecraftOrganization.NASA]: {
    name: 'National Aeronautics and Space Administration',
    shortName: 'NASA',
    thumbnail: 'nasa-meatball.svg',
  },
  [SpacecraftOrganization.ESA]: {
    name: 'European Space Agency',
    shortName: 'ESA',
    thumbnail: 'esa-logo.png',
  },
  [SpacecraftOrganization.JAXA]: {
    name: 'Japan Aerospace Exploration Agency',
    shortName: 'JAXA',
    thumbnail: 'jaxa-logo.png',
  },
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
  RETURNED = 'Returned',
  CRASHED = 'Crashed',
}

export type Spacecraft = {
  name: string;
  organization: SpacecraftOrganization;
  launchMass: number; // kg
  power?: number; // watts
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
    { id: Bodies.NEREID.id, type: SpacecraftVisitType.FLYBY, start: new Date('1989-08-25T12:00:00Z') },
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
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Ran out of battery ~90 minutes after touchdown' },
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

export const GALILEO: Spacecraft = {
  name: 'Galileo',
  organization: SpacecraftOrganization.NASA,
  launchMass: 2560,
  power: 570,
  start: new Date('1989-10-18T16:53:40Z'),
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: "Intentionally flown into Jupiter's atmosphere on September 21st, 2003",
  },
  thumbnail: 'galileo-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Galileo_(spacecraft)',
  visited: [
    { id: Bodies.GASPRA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1991-10-29T12:00:00Z') },
    { id: Bodies.IDA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1993-08-28T12:00:00Z') },
    {
      id: Bodies.JUPITER.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('1995-12-07T12:00:00Z'),
      end: new Date('2003-09-21T12:00:00Z'),
    },
    { id: Bodies.IO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1995-12-07T12:00:00Z') },
    { id: Bodies.GANYMEDE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1996-06-27T12:00:00Z') },
    { id: Bodies.CALLISTO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1996-12-19T12:00:00Z') },
    { id: Bodies.EUROPA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1997-02-20T12:00:00Z') },
    // TODO: Amalthea flyby on 2002-11-04
  ],
};

// TODO: add JAXA's Mio?
export const BEPICOLOMBO: Spacecraft = {
  name: 'BepiColombo',
  organization: SpacecraftOrganization.ESA,
  launchMass: 4100,
  power: 150,
  start: new Date('2018-10-20T01:45:00Z'),
  status: { status: SpacecraftStatus.OPERATIONAL, details: 'Planned to enter Mercury orbit in November 2026' },
  thumbnail: 'bepicolombo-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/BepiColombo',
  visited: [
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2020-10-15T03:48:00Z') },
    // TODO: this start date is a flyby, will enter orbit in 2026
    { id: Bodies.MERCURY.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2021-10-01T23:34:41Z') },
  ],
};

export const MESSENGER: Spacecraft = {
  name: 'MESSENGER',
  organization: SpacecraftOrganization.NASA,
  launchMass: 1107.9,
  power: 450,
  start: new Date('2004-08-03T06:15:56Z'),
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: 'Intentionally crashed into Mercury on April 30th, 2015',
  },
  thumbnail: 'messenger-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/MESSENGER',
  visited: [
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2007-06-05T12:00:00Z') },
    { id: Bodies.MERCURY.id, type: SpacecraftVisitType.ORBITER, start: new Date('2011-03-18T01:00:00Z') },
  ],
};

export const PARKER_SOLAR_PROBE: Spacecraft = {
  name: 'Parker Solar Probe',
  organization: SpacecraftOrganization.NASA,
  launchMass: 685,
  power: 343,
  start: new Date('2018-08-12T07:31:00Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'parker-solar-probe-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Parker_Solar_Probe',
  visited: [
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2018-10-03T08:44:00Z') },
    { id: Bodies.SOL.id, type: SpacecraftVisitType.ORBITER, start: new Date('2018-08-12T07:31:00Z') },
  ],
};

export const SOLAR_ORBITER: Spacecraft = {
  name: 'Solar Orbiter',
  organization: SpacecraftOrganization.ESA,
  launchMass: 1800,
  power: 180,
  start: new Date('2020-02-10T04:03:00Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'solar-orbiter-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Solar_Orbiter',
  visited: [
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2020-12-27T12:39:00Z') },
    // TODO: also Earth flyby -- worth including? the list there would be massive
    { id: Bodies.SOL.id, type: SpacecraftVisitType.ORBITER, start: new Date('2020-02-10T04:03:00Z') },
  ],
};

export const JUICE: Spacecraft = {
  name: 'Jupiter Icy Moons Explorer',
  organization: SpacecraftOrganization.ESA,
  launchMass: 6070,
  power: 850,
  start: new Date('2023-04-14T12:14:36Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'juice-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Jupiter_Icy_Moons_Explorer',
  visited: [
    { id: Bodies.LUNA.id, type: SpacecraftVisitType.FLYBY, start: new Date('2024-08-19T21:16:00Z') },
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2025-08-31T12:00:00Z') },
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.ORBITER, start: new Date('2031-07-15T12:00:00Z') },
    { id: Bodies.CALLISTO.id, type: SpacecraftVisitType.FLYBY, start: new Date('2032-01-15T12:00:00Z') },
    { id: Bodies.EUROPA.id, type: SpacecraftVisitType.FLYBY, start: new Date('2032-07-15T12:00:00Z') },
    { id: Bodies.GANYMEDE.id, type: SpacecraftVisitType.ORBITER, start: new Date('2034-12-15T12:00:00Z') },
  ],
};

export const PSYCHE: Spacecraft = {
  name: 'Psyche',
  organization: SpacecraftOrganization.NASA,
  launchMass: 2608,
  power: 4500,
  start: new Date('2023-10-13T14:19:00Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'psyche-spacecraft-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Psyche_(spacecraft)',
  visited: [{ id: Bodies.PSYCHE.id, type: SpacecraftVisitType.ORBITER, start: new Date('2029-08-15T12:00:00Z') }],
};

export const EUROPA_CLIPPER: Spacecraft = {
  name: 'Europa Clipper',
  organization: SpacecraftOrganization.NASA,
  launchMass: 6065,
  power: 600,
  start: new Date('2024-10-14T16:06:00Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'europa-clipper-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Europa_Clipper',
  visited: [
    { id: Bodies.MARS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2025-03-01T17:00:00Z') },
    // some uncertainty here as these are planned dates
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.ORBITER, start: new Date('2030-04-11T12:00:00Z') },
    { id: Bodies.GANYMEDE.id, type: SpacecraftVisitType.FLYBY, start: new Date('2030-04-15T12:00:00Z') },
    { id: Bodies.EUROPA.id, type: SpacecraftVisitType.FLYBY, start: new Date('2030-04-15T12:00:00Z') }, // many flybys
  ],
};

export const APOLLO_8: Spacecraft = {
  name: 'Apollo 8',
  organization: SpacecraftOrganization.NASA,
  launchMass: 28870,
  start: new Date('1968-12-21T12:51:00Z'),
  end: new Date('1968-12-27T15:51:42Z'),
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-8-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_8',
  crew: ['Frank Borman', 'James Lovell', 'William Anders'],
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('1968-12-24T10:03:27Z'),
      end: new Date('1968-12-25T06:13:40Z'),
    },
  ],
};

export const APOLLO_10: Spacecraft = {
  name: 'Apollo 10',
  organization: SpacecraftOrganization.NASA,
  launchMass: 42775,
  start: new Date('1969-05-18T16:49:00Z'),
  end: new Date('1969-05-26T16:52:23Z'),
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-10-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_10',
  crew: ['Thomas Stafford', 'Gene Cernan', 'John Young'],
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('1969-05-21T08:44:54Z'),
      end: new Date('1969-05-24T10:25:29Z'),
    },
  ],
};

export const APOLLO_11: Spacecraft = {
  name: 'Apollo 11',
  organization: SpacecraftOrganization.NASA,
  launchMass: 49735,
  start: new Date('1969-07-16T13:32:00Z'),
  end: new Date('1969-07-24T16:50:35Z'),
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-11-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_11',
  crew: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins'],
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1969-07-20T20:17:00Z'),
      end: new Date('1969-07-21T17:54:00Z'),
    },
  ],
};

export const APOLLO_12: Spacecraft = {
  name: 'Apollo 12',
  organization: SpacecraftOrganization.NASA,
  launchMass: 49915,
  start: new Date('1969-11-14T16:22:00Z'),
  end: new Date('1969-11-24T20:58:24Z'),
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-12-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_12',
  crew: ['Pete Conrad', 'Alan Bean', 'Richard Gordon'],
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1969-11-19T06:54:35Z'),
      end: new Date('1969-11-20T14:25:47Z'),
    },
  ],
};

export const APOLLO_13: Spacecraft = {
  name: 'Apollo 13',
  organization: SpacecraftOrganization.NASA,
  launchMass: 44069,
  start: new Date('1970-04-11T19:13:00Z'),
  end: new Date('1970-04-17T18:07:41Z'),
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-13-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_13',
  crew: ['Jim Lovell', 'Jack Swigert', 'Fred Haise'],
  visited: [{ id: Bodies.LUNA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1970-04-15T00:21:00Z') }],
};

export const APOLLO_14: Spacecraft = {
  name: 'Apollo 14',
  organization: SpacecraftOrganization.NASA,
  launchMass: 46305,
  start: new Date('1971-01-31T21:03:02Z'),
  end: new Date('1971-02-09T21:05:02Z'),
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-14-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_14',
  crew: ['Alan Shepard', 'Stuart Roosa', 'Edgar Mitchell'],
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1971-02-05T09:18:11Z'),
      end: new Date('1971-02-06T18:48:42Z'),
    },
  ],
};

export const APOLLO_15: Spacecraft = {
  name: 'Apollo 15',
  organization: SpacecraftOrganization.NASA,
  launchMass: 48599,
  start: new Date('1971-07-26T13:34:00Z'),
  end: new Date('1971-08-07T20:45:53Z'),
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-15-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_15',
  crew: ['David Scott', 'Alfred Worden', 'James Irwin'],
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1971-07-30T22:16:29Z'),
      end: new Date('1971-08-02T17:11:23Z'),
    },
  ],
};

export const APOLLO_16: Spacecraft = {
  name: 'Apollo 16',
  organization: SpacecraftOrganization.NASA,
  launchMass: 52759,
  start: new Date('1972-04-16T17:54:00Z'),
  end: new Date('1972-04-27T19:45:05Z'),
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-16-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_16',
  crew: ['John Young', 'Ken Mattingly', 'Charlie Duke'],
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1972-04-21T02:23:35Z'),
      end: new Date('1972-04-24T01:25:47Z'),
    },
  ],
};

export const APOLLO_17: Spacecraft = {
  name: 'Apollo 17',
  organization: SpacecraftOrganization.NASA,
  launchMass: 48609,
  start: new Date('1972-12-07T05:33:00Z'),
  end: new Date('1972-12-19T19:54:58Z'),
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-17-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_17',
  crew: ['Gene Cernan', 'Ronald Evans', 'Jack Schmitt'],
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1972-12-10T19:53:55Z'),
      end: new Date('1972-12-16T23:35:09Z'),
    },
  ],
};

export const NEAR_SHOEMAKER: Spacecraft = {
  name: 'NEAR Shoemaker',
  organization: SpacecraftOrganization.NASA,
  launchMass: 805,
  power: 1800,
  start: new Date('1996-02-17T20:43:27Z'),
  end: new Date('2001-02-28T00:00:00Z'),
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Soft landed on 433 Eros on February 12th, 2001' },
  wiki: 'https://en.wikipedia.org/wiki/NEAR_Shoemaker',
  thumbnail: 'near-shoemaker-thumb.png',
  visited: [
    { id: Bodies.MATHILDE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1997-06-27T12:56:00Z') },
    {
      id: Bodies.EROS.id,
      type: SpacecraftVisitType.ORBITER, // TODO: also lander, ultimately
      start: new Date('2000-02-14T15:33:00Z'),
      end: new Date('2001-02-28T00:00:00Z'),
    },
  ],
};

export const ROSETTA: Spacecraft = {
  name: 'Rosetta',
  organization: SpacecraftOrganization.ESA,
  launchMass: 3000,
  power: 850,
  start: new Date('2004-03-02T07:17:51Z'),
  end: new Date('2016-09-30T10:39:28Z'),
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: 'Intentionally deorbited into Comet 67P in September 2016',
  },
  wiki: 'https://en.wikipedia.org/wiki/Rosetta_(spacecraft)',
  thumbnail: 'rosetta-thumb.png',
  visited: [
    { id: Bodies.MARS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2007-02-25T12:00:00Z') },
    { id: Bodies.STEINS.id, type: SpacecraftVisitType.FLYBY, start: new Date('2008-09-05T12:00:00Z') },
    { id: Bodies.LUTETIA.id, type: SpacecraftVisitType.FLYBY, start: new Date('2010-07-10T12:00:00Z') },
    // TODO: include lander?
    {
      id: Bodies.CG67P.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('2014-08-05T09:06:00Z'),
      end: new Date('2016-09-30T10:39:28Z'),
    },
  ],
};

export const DAWN: Spacecraft = {
  name: 'Dawn',
  organization: SpacecraftOrganization.NASA,
  launchMass: 1217.7,
  power: 10000,
  start: new Date('2007-09-27T11:34:00Z'),
  end: new Date('2018-10-30T12:00:00Z'),
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Remains in a stable orbit around Ceres' },
  wiki: 'https://en.wikipedia.org/wiki/Dawn_(spacecraft)',
  thumbnail: 'dawn-thumb.png',
  visited: [
    { id: Bodies.MARS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2009-02-17T12:00:00Z') },
    {
      id: Bodies.VESTA.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('2011-07-16T12:00:00Z'),
      end: new Date('2012-09-05T12:00:00Z'),
    },
    {
      id: Bodies.CERES.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('2015-03-06T12:00:00Z'),
      end: new Date('2018-10-30T12:00:00Z'),
    },
  ],
};

// TODO: include MINERVA-II lander? the 4 rovers? the impactor? crazy mission
export const HAYABUSA_2: Spacecraft = {
  name: 'Hayabusa2',
  organization: SpacecraftOrganization.JAXA,
  launchMass: 600,
  power: 2600,
  start: new Date('2014-12-03T04:22:04Z'),
  end: new Date('2020-12-05T12:00:00Z'),
  status: { status: SpacecraftStatus.RETURNED, details: 'Returned to Earth with 5 grams of material from Ryugu' },
  wiki: 'https://en.wikipedia.org/wiki/Hayabusa2',
  thumbnail: 'hayabusa-2-thumb.jpg',
  visited: [{ id: Bodies.RYUGU.id, type: SpacecraftVisitType.ORBITER, start: new Date('2018-06-27T12:00:00Z') }],
};

export const OSIRIS_REX: Spacecraft = {
  name: 'OSIRIS-REx',
  organization: SpacecraftOrganization.NASA,
  launchMass: 2110,
  power: 3000,
  start: new Date('2016-09-08T23:05:00Z'),
  end: new Date('2023-09-24T14:52:00Z'),
  status: {
    status: SpacecraftStatus.RETURNED,
    details: 'Capsule returned to Earth with 121.6 grams of material from Bennu',
  },
  wiki: 'https://en.wikipedia.org/wiki/OSIRIS-REx',
  thumbnail: 'osiris-rex-thumb.png',
  visited: [
    {
      id: Bodies.BENNU.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('2018-12-03T12:00:00Z'),
      end: new Date('2021-05-10T12:00:00Z'),
    },
  ],
};

export const SPACECRAFT: Array<Spacecraft> = [
  // Inner missions
  MESSENGER,
  PARKER_SOLAR_PROBE,
  BEPICOLOMBO,
  SOLAR_ORBITER,

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

  // Luna
  // LUNA_1,
  // PIONEER_4,
  // LUNA_2,
  // LUNA_3,
  // RANGER_7,
  // RANGER_8,
  // RANGER_9,
  // ZOND_3,
  // LUNA_9,
  // SURVEYOR_1,
  // LUNAR_ORBITER_1,
  // LUNA_11,
  // TODO: there are an insane number of missions, 100+ successful that are worth noting
  APOLLO_8,
  APOLLO_10,
  APOLLO_11,
  APOLLO_12,
  APOLLO_13,
  APOLLO_14,
  APOLLO_15,
  APOLLO_16,
  APOLLO_17,

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

  // Asteroids
  // PIONEER_10,
  NEAR_SHOEMAKER,
  // DEEP_SPACE_1,
  // STARDUST,
  // HAYABUSA,
  // ROSETTA,
  // DEEP_IMPACT,
  // CHANGE_2,
  DAWN,
  ROSETTA,
  HAYABUSA_2,
  OSIRIS_REX,
  // LUCY,
  // DART,
  PSYCHE,
  // HERA,

  // Outer missions
  VOYAGER_1,
  VOYAGER_2,
  GALILEO,
  CASSINI,
  HUYGENS,
  NEW_HORIZONS,
  JUICE,
  // JUNO,
  EUROPA_CLIPPER,
];

export const SPACECRAFT_BY_BODY_ID = map(
  spacecraft => spacecraft.sort((a, b) => a.start.getTime() - b.start.getTime()),
  SPACECRAFT.reduce<Record<CelestialBodyId, Array<Spacecraft>>>((acc, spacecraft) => {
    spacecraft.visited.forEach(visited => {
      acc[visited.id] = [...(acc[visited.id] ?? []), spacecraft];
    });
    return acc;
  }, {})
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
