import { OrbitalRegimeId, SpacecraftOrganizationId, SpacecraftStatus, SpacecraftVisitType } from '../../types.ts';
import * as Bodies from '../bodies.ts';
import { AIDA_MISSION_FAMILY, CASSINI_HUYGENS_MISSION_FAMILY } from './nasa.ts';
import { spacecraftWithDefaults } from './utils.ts';

export const GIOTTO = spacecraftWithDefaults({
  name: 'Giotto',
  organization: SpacecraftOrganizationId.ESA,
  launchMass: 960,
  power: 196,
  start: new Date('1985-07-02T11:23:00Z'),
  end: new Date(1992, 6, 23),
  status: { status: SpacecraftStatus.DEFUNCT },
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  thumbnail: 'giotto-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Giotto_(spacecraft)',
  color: Bodies.DEFAULT_COMET_COLOR,
  visited: [
    { id: Bodies.HALLEY.id, type: SpacecraftVisitType.FLYBY, start: new Date(1986, 2, 14) },
    { id: Bodies.GRIGG_SKJELLERUP.id, type: SpacecraftVisitType.FLYBY, start: new Date(1992, 6, 10) },
  ],
});

export const ULYSSES = spacecraftWithDefaults({
  name: 'Ulysses',
  organization: SpacecraftOrganizationId.ESA, // also NASA
  launchMass: 371,
  power: 285,
  start: new Date('1990-10-06T11:47:16Z'),
  end: new Date(2009, 5, 30),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM, OrbitalRegimeId.OUTER_SYSTEM],
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Deactivated after 18 years and 8 months of operation' },
  wiki: 'https://en.wikipedia.org/wiki/Ulysses_(spacecraft)',
  thumbnail: 'ulysses-thumb.jpg',
  visited: [
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date(1992, 1, 8) },
    { id: Bodies.SOL.id, type: SpacecraftVisitType.FLYBY, start: new Date(1994, 5, 26), end: new Date(1994, 10, 5) },
    // TODO: C/1996 Hyakutake, C/1999 McNaught-Hartley, C/2006 McNaught comet flybys
  ],
});

export const HUYGENS = spacecraftWithDefaults({
  name: 'Huygens',
  organization: SpacecraftOrganizationId.ESA,
  launchMass: 320,
  power: 600, // 1800 Wh, estimated battery life of 3 hours
  start: new Date('1997-10-15T08:43:00Z'),
  end: new Date('2005-01-14T13:37:00Z'),
  focusId: Bodies.TITAN.id,
  orbitalRegimes: [OrbitalRegimeId.OUTER_SYSTEM],
  missionFamily: CASSINI_HUYGENS_MISSION_FAMILY,
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Ran out of battery ~90 minutes after touchdown' },
  thumbnail: 'huygens-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Huygens_(spacecraft)',
  color: Bodies.TITAN.style.fgColor,
  visited: [
    {
      id: Bodies.TITAN.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('2005-01-14T12:43:00Z'),
      end: new Date('2005-01-14T13:37:00Z'),
    },
  ],
});

export const MARS_EXPRESS = spacecraftWithDefaults({
  name: 'Mars Express',
  organization: SpacecraftOrganizationId.ESA,
  launchMass: 1123,
  power: 460,
  start: new Date('2003-06-02T17:45:00Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  focusId: Bodies.MARS.id,
  color: Bodies.MARS.style.fgColor,
  wiki: 'https://en.wikipedia.org/wiki/Mars_Express',
  thumbnail: 'mars-express-thumb.jpg',
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.ORBITER, start: new Date('2003-12-25T03:00:00Z') }],
});

export const ROSETTA = spacecraftWithDefaults({
  name: 'Rosetta',
  organization: SpacecraftOrganizationId.ESA,
  launchMass: 3000,
  power: 850,
  start: new Date('2004-03-02T07:17:51Z'),
  end: new Date('2016-09-30T10:39:28Z'),
  focusId: Bodies.CG67P.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM, OrbitalRegimeId.ASTEROID_BELT],
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: 'Intentionally deorbited into Comet 67P in September 2016',
  },
  wiki: 'https://en.wikipedia.org/wiki/Rosetta_(spacecraft)',
  thumbnail: 'rosetta-thumb.png',
  color: Bodies.DEFAULT_COMET_COLOR,
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
});

export const VENUS_EXPRESS = spacecraftWithDefaults({
  name: 'Venus Express',
  organization: SpacecraftOrganizationId.ESA,
  launchMass: 1270,
  power: 1100,
  start: new Date('2005-11-09T03:33:34Z'),
  end: new Date('2015-01-18T15:01:55Z'),
  focusId: Bodies.VENUS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.DECOMMISSIONED, details: 'Deorbited into the Venusian atmosphere' },
  thumbnail: 'venus-express-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Venus_Express',
  color: Bodies.VENUS.style.fgColor,
  visited: [
    {
      id: Bodies.VENUS.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('2006-04-11T12:00:00Z'),
      end: new Date('2015-01-15T15:01:55Z'),
    },
  ],
});

// TODO: add JAXA's Mio?
export const BEPICOLOMBO = spacecraftWithDefaults({
  name: 'BepiColombo',
  organization: SpacecraftOrganizationId.ESA,
  launchMass: 4100,
  power: 150,
  start: new Date('2018-10-20T01:45:00Z'),
  focusId: Bodies.MERCURY.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.OPERATIONAL, details: 'Planned to enter Mercury orbit in November 2026' },
  thumbnail: 'bepicolombo-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/BepiColombo',
  visited: [
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2020-10-15T03:48:00Z') },
    // TODO: this start date is a flyby, will enter orbit in 2026
    { id: Bodies.MERCURY.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2021-10-01T23:34:41Z') },
  ],
});

export const JUICE = spacecraftWithDefaults({
  name: 'Jupiter Icy Moons Explorer',
  organization: SpacecraftOrganizationId.ESA,
  launchMass: 6070,
  power: 850,
  start: new Date('2023-04-14T12:14:36Z'),
  focusId: Bodies.JUPITER.id,
  orbitalRegimes: [OrbitalRegimeId.OUTER_SYSTEM],
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'juice-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Jupiter_Icy_Moons_Explorer',
  color: Bodies.JUPITER.style.fgColor,
  visited: [
    { id: Bodies.LUNA.id, type: SpacecraftVisitType.FLYBY, start: new Date('2024-08-19T21:16:00Z') },
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2025-08-31T12:00:00Z') },
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.ORBITER, start: new Date('2031-07-15T12:00:00Z') },
    { id: Bodies.CALLISTO.id, type: SpacecraftVisitType.FLYBY, start: new Date('2032-01-15T12:00:00Z') },
    { id: Bodies.EUROPA.id, type: SpacecraftVisitType.FLYBY, start: new Date('2032-07-15T12:00:00Z') },
    { id: Bodies.GANYMEDE.id, type: SpacecraftVisitType.ORBITER, start: new Date('2034-12-15T12:00:00Z') },
  ],
});

export const HERA = spacecraftWithDefaults({
  name: 'Hera',
  organization: SpacecraftOrganizationId.ESA,
  launchMass: 1128,
  start: new Date('2024-10-07T14:52:11Z'),
  focusId: Bodies.DIDYMOS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: AIDA_MISSION_FAMILY,
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'hera-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Hera_(space_mission)',
  visited: [
    { id: Bodies.MARS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2025-03-15T12:00:00Z') },
    { id: Bodies.DIDYMOS.id, type: SpacecraftVisitType.ORBITER, start: new Date('2026-12-14T12:00:00Z') },
  ],
});

export const SOLAR_ORBITER = spacecraftWithDefaults({
  name: 'Solar Orbiter',
  organization: SpacecraftOrganizationId.ESA,
  launchMass: 1800,
  power: 180,
  start: new Date('2020-02-10T04:03:00Z'),
  focusId: Bodies.SOL.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'solar-orbiter-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Solar_Orbiter',
  color: Bodies.SOL.style.fgColor,
  visited: [
    { id: Bodies.SOL.id, type: SpacecraftVisitType.ORBITER, start: new Date('2020-06-15T12:00:00Z') },
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2020-12-27T12:39:00Z') },
    // TODO: also Earth flyby -- worth including? the list there would be massive
  ],
});

/*
 * TODO:
 *  - SMART-1
 *  - SOHO
 */
export const ESA_SPACECRAFT = [
  GIOTTO,
  ULYSSES,
  HUYGENS,
  MARS_EXPRESS,
  ROSETTA,
  VENUS_EXPRESS,
  BEPICOLOMBO,
  SOLAR_ORBITER,
  JUICE,
  HERA,
];
