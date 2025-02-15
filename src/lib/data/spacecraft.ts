import { mapObjIndexed } from 'ramda';
import {
  CelestialBodyId,
  HexColor,
  OrbitalRegimeId,
  Spacecraft,
  SpacecraftId,
  SpacecraftOrganizationId,
  SpacecraftStatus,
  SpacecraftVisitType,
} from '../types.ts';
import { nameToId } from '../utils.ts';
import * as Bodies from './bodies.ts';

function spacecraftWithDefaults(
  spacecraft: Omit<Spacecraft, 'id' | 'color'> & { id?: SpacecraftId; color?: HexColor }
): Spacecraft {
  return {
    ...spacecraft,
    id: `spacecraft/${nameToId(spacecraft.name)}`,
    color: spacecraft.color ?? Bodies.DEFAULT_SPACECRAFT_COLOR,
  };
}

const VOYAGER_MISSION_FAMILY = 'Voyager';
export const VOYAGER_1 = spacecraftWithDefaults({
  name: 'Voyager 1',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 815,
  power: 470,
  start: new Date('1977-09-05T12:56:01Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  orbitalRegimes: [OrbitalRegimeId.OUTER_SYSTEM, OrbitalRegimeId.KUIPER_BELT],
  missionFamily: VOYAGER_MISSION_FAMILY,
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
});

export const VOYAGER_2 = spacecraftWithDefaults({
  name: 'Voyager 2',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 721.9,
  power: 470,
  start: new Date('1977-08-20T14:29:00Z'),
  status: { status: SpacecraftStatus.OPERATIONAL },
  orbitalRegimes: [OrbitalRegimeId.OUTER_SYSTEM, OrbitalRegimeId.KUIPER_BELT],
  missionFamily: VOYAGER_MISSION_FAMILY,
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
});

const CASSINI_HUYGENS_MISSION_FAMILY = 'Cassini-Huygens';
export const CASSINI = spacecraftWithDefaults({
  name: 'Cassini',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 5712,
  power: 885,
  start: new Date('1997-10-15T08:43:00Z'),
  end: new Date('2017-09-15T11:55:00Z'),
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: "Intentionally flown into Saturn's atmosphere on September 15, 2017",
  },
  focusId: Bodies.SATURN.id,
  orbitalRegimes: [OrbitalRegimeId.OUTER_SYSTEM],
  missionFamily: CASSINI_HUYGENS_MISSION_FAMILY,
  thumbnail: 'cassini-huygens.gif',
  wiki: 'https://en.wikipedia.org/wiki/Cassini%E2%80%93Huygens',
  color: Bodies.SATURN.style.fgColor,
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

const PATHFINDER_MISSION_FAMILY = 'Pathfinder';
export const PATHFINDER = spacecraftWithDefaults({
  name: 'Mars Pathfinder',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 890,
  power: 35,
  start: new Date('1996-12-04T06:58:07Z'),
  end: new Date('1997-09-27T10:23:00Z'),
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Lost contact on September 27, 1997' },
  focusId: Bodies.MARS.id,
  missionFamily: PATHFINDER_MISSION_FAMILY,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  wiki: 'https://en.wikipedia.org/wiki/Mars_Pathfinder',
  thumbnail: 'pathfinder-thumb.webp',
  color: Bodies.MARS.style.fgColor,
  visited: [
    {
      id: Bodies.MARS.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1997-07-04T16:55:56Z'),
      end: new Date(1997, 8, 27),
    },
  ],
});
export const SOJOURNER = spacecraftWithDefaults({
  name: 'Sojourner',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 11.5,
  power: 13,
  start: new Date('1996-12-04T06:58:07Z'),
  end: new Date(1998, 2, 10),
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Lost contact on September 27, 1997' },
  focusId: Bodies.MARS.id,
  missionFamily: PATHFINDER_MISSION_FAMILY,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  wiki: 'https://en.wikipedia.org/wiki/Sojourner_(rover)',
  thumbnail: 'sojourner-thumb.jpg',
  color: Bodies.MARS.style.fgColor,
  visited: [
    {
      id: Bodies.MARS.id,
      type: SpacecraftVisitType.ROVER,
      start: new Date('1997-07-04T16:56:55Z'),
      end: new Date(1998, 2, 10),
    },
  ],
});

export const CURIOSITY = spacecraftWithDefaults({
  name: 'Curiosity',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 899,
  power: 100,
  start: new Date('2011-11-26T15:02:00Z'),
  focusId: Bodies.MARS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'curiosity-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Curiosity_(rover)',
  color: Bodies.MARS.style.fgColor,
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.ROVER, start: new Date('2012-08-06T05:17:00Z') }],
});

const PERSEVERANCE_MISSION_FAMILY = 'Perseverance';
export const PERSEVERANCE = spacecraftWithDefaults({
  name: 'Perseverance',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 1025,
  power: 110,
  start: new Date('2020-07-30T11:50:00Z'),
  focusId: Bodies.MARS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: PERSEVERANCE_MISSION_FAMILY,
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'perseverance-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Perseverance_(rover)',
  color: Bodies.MARS.style.fgColor,
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.ROVER, start: new Date('2021-02-18T20:55:00Z') }],
});

export const INGENUITY = spacecraftWithDefaults({
  name: 'Ingenuity',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 1.8,
  power: 350,
  start: new Date('2020-07-30T11:50:00Z'),
  end: new Date('2024-01-18T12:00:00Z'),
  focusId: Bodies.MARS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: PERSEVERANCE_MISSION_FAMILY,
  status: {
    status: SpacecraftStatus.DEFUNCT,
    details: 'Retired in 2024 due to sustained rotor damage',
  },
  thumbnail: 'ingenuity-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Ingenuity_(helicopter)',
  color: Bodies.MARS.style.fgColor,
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.HELICOPTER, start: new Date('2021-02-18T20:55:00Z') }],
});

const TIANWEN_1_MISSION_FAMILY = 'Tianwen-1';
export const TIANWEN_1 = spacecraftWithDefaults({
  name: 'Tianwen-1',
  organization: SpacecraftOrganizationId.CNSA,
  launchMass: 5000,
  start: new Date('2020-07-23T04:41:15Z'),
  focusId: Bodies.MARS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: TIANWEN_1_MISSION_FAMILY,
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'tianwen-1-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Tianwen-1',
  color: Bodies.MARS.style.fgColor,
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.ORBITER, start: new Date('2021-02-10T11:52:00Z') }],
});

export const ZHURONG = spacecraftWithDefaults({
  name: 'Zhurong',
  organization: SpacecraftOrganizationId.CNSA,
  launchMass: 240,
  start: new Date('2020-07-23T04:41:15Z'),
  end: new Date('2022-12-26T12:00:00Z'),
  focusId: Bodies.MARS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: TIANWEN_1_MISSION_FAMILY,
  status: {
    status: SpacecraftStatus.DEFUNCT,
    details: 'Failed to wake from hibernation in December 2022 due to dust buildup',
  },
  thumbnail: 'zhurong-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Zhurong_(rover)',
  color: Bodies.MARS.style.fgColor,
  visited: [
    {
      id: Bodies.MARS.id,
      type: SpacecraftVisitType.ROVER,
      start: new Date('2021-05-22T02:40:00Z'),
      end: new Date('2022-12-26T12:00:00Z'),
    },
  ],
});

export const NEW_HORIZONS = spacecraftWithDefaults({
  name: 'New Horizons',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 478,
  power: 245,
  start: new Date('2006-01-19T19:00:00Z'),
  status: {
    status: SpacecraftStatus.OPERATIONAL,
    details: 'Currently traveling through the Kuiper belt',
  },
  orbitalRegimes: [OrbitalRegimeId.OUTER_SYSTEM, OrbitalRegimeId.KUIPER_BELT],
  focusId: Bodies.PLUTO.id,
  thumbnail: 'new-horizons-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/New_Horizons',
  color: Bodies.PLUTO.style.fgColor,
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
    // TODO: enable? not really a flyby, 0.75 AU away
    // { id: Bodies.ARAWN.id, type: SpacecraftVisitType.FLYBY, start: new Date(2016, 3, 8) },
    { id: Bodies.ARROKOTH.id, type: SpacecraftVisitType.FLYBY, start: new Date('2019-01-01T12:00:00Z') },
  ],
});

export const GALILEO = spacecraftWithDefaults({
  name: 'Galileo',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 2560,
  power: 570,
  start: new Date('1989-10-18T16:53:40Z'),
  end: new Date('2003-09-21T18:57:18Z'),
  focusId: Bodies.JUPITER.id,
  orbitalRegimes: [OrbitalRegimeId.ASTEROID_BELT, OrbitalRegimeId.OUTER_SYSTEM],
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: "Intentionally flown into Jupiter's atmosphere on September 21, 2003",
  },
  thumbnail: 'galileo-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Galileo_(spacecraft)',
  color: Bodies.JUPITER.style.fgColor,
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
});

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

export const MESSENGER = spacecraftWithDefaults({
  name: 'MESSENGER',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 1107.9,
  power: 450,
  start: new Date('2004-08-03T06:15:56Z'),
  end: new Date('2015-04-30T19:26:00Z'),
  focusId: Bodies.MERCURY.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
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
});

export const PARKER_SOLAR_PROBE = spacecraftWithDefaults({
  name: 'Parker Solar Probe',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 685,
  power: 343,
  start: new Date('2018-08-12T07:31:00Z'),
  focusId: Bodies.SOL.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'parker-solar-probe-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Parker_Solar_Probe',
  color: Bodies.SOL.style.fgColor,
  visited: [
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2018-10-03T08:44:00Z') },
    {
      id: Bodies.SOL.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('2018-11-06T03:27:00Z'), // first perihelion
    },
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

const MARINER_MISSION_FAMILY = 'Mariner';
export const MARINER_2 = spacecraftWithDefaults({
  name: Bodies.MARINER_2.name,
  organization: SpacecraftOrganizationId.NASA,
  launchMass: Bodies.MARINER_2.mass,
  power: 220,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: MARINER_MISSION_FAMILY,
  start: new Date('1962-08-27T06:53:14Z'),
  end: new Date('1963-01-03T07:00:00Z'),
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Drifting in a heliocentric orbit' },
  wiki: 'https://en.wikipedia.org/wiki/Mariner_2',
  thumbnail: Bodies.MARINER_2.assets!.thumbnail,
  color: Bodies.VENUS.style.fgColor,
  visited: [{ id: Bodies.VENUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1962-12-14T12:00:00Z') }],
});

export const MARINER_4 = spacecraftWithDefaults({
  name: 'Mariner 4',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 260.8,
  power: 310,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: MARINER_MISSION_FAMILY,
  start: new Date('1964-11-28T14:22:01Z'),
  end: new Date(1967, 11, 21),
  focusId: Bodies.MARS.id,
  status: {
    status: SpacecraftStatus.DEFUNCT,
    details: 'Damaged by 83 micrometeoroid hits, likely debris from comet D/1895 Q1 (Swift)',
  },
  wiki: 'https://en.wikipedia.org/wiki/Mariner_4',
  thumbnail: 'mariner-4-thumb.jpg',
  color: Bodies.MARS.style.fgColor,
  visited: [
    { id: Bodies.MARS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1965-07-15T01:00:57Z') },
    // TODO: D/1895 Q1 (Swift) is believed to no longer exist; last observed in 1986
    // { id: Bodies.SWIFT.id, type: SpacecraftVisitType.FLYBY, start: new Date(1965, 8, 15) },
  ],
});

export const MARINER_10 = spacecraftWithDefaults({
  name: 'Mariner 10',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 502.9,
  power: 820,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: MARINER_MISSION_FAMILY,
  start: new Date(1973, 10, 3, 5, 45),
  end: new Date(1975, 2, 24, 12, 21),
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Drifting in a heliocentric orbit in the inner system' },
  wiki: 'https://en.wikipedia.org/wiki/Mariner_10',
  thumbnail: 'mariner-10-thumb.jpg',
  visited: [
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.FLYBY, start: new Date(1974, 1, 5) },
    { id: Bodies.MERCURY.id, type: SpacecraftVisitType.FLYBY, start: new Date(1974, 2, 29) },
  ],
});

export const MAGELLAN = spacecraftWithDefaults({
  name: 'Magellan',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 3445,
  power: 1030,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  start: new Date('1989-05-04T18:47:00Z'),
  end: new Date('1994-10-13T10:05:00Z'),
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: 'Deorbited into the Venusian atmosphere on October 13, 1994',
  },
  wiki: 'https://en.wikipedia.org/wiki/Magellan_(spacecraft)',
  thumbnail: 'magellan-thumb.jpg',
  visited: [
    {
      id: Bodies.VENUS.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('1990-08-10T17:00:00Z'),
      end: new Date('1994-10-13T10:05:00Z'),
    },
  ],
});

const VENERA_MISSION_FAMILY = 'Venera';
export const VENERA_7 = spacecraftWithDefaults({
  name: 'Venera 7',
  organization: SpacecraftOrganizationId.USSR,
  launchMass: 1180,
  start: new Date('1970-08-17T05:38:22Z'),
  end: new Date('1970-12-15T06:00:00Z'),
  focusId: Bodies.VENUS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: VENERA_MISSION_FAMILY,
  status: { status: SpacecraftStatus.DEFUNCT },
  thumbnail: 'venera-7-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Venera_7',
  color: Bodies.VENUS.style.fgColor,
  visited: [{ id: Bodies.VENUS.id, type: SpacecraftVisitType.LANDER, start: new Date('1970-12-15T06:00:00Z') }],
});

const LUNA_MISSION_FAMILY = 'Luna';
export const LUNA_2 = spacecraftWithDefaults({
  name: 'Luna 2',
  organization: SpacecraftOrganizationId.USSR,
  launchMass: 390.2,
  start: new Date('1959-09-12T06:39:42Z'),
  end: new Date('1959-09-13T21:02:24Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: LUNA_MISSION_FAMILY,
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: 'Impacted the surface of the Moon on September 13, 1959',
  },
  thumbnail: 'luna-2-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Luna_2',
  visited: [{ id: Bodies.LUNA.id, type: SpacecraftVisitType.IMPACTOR, start: new Date('1959-09-13T21:02:24Z') }],
});

export const LUNA_3 = spacecraftWithDefaults({
  name: 'Luna 3',
  organization: SpacecraftOrganizationId.USSR,
  launchMass: 278.5,
  start: new Date('1959-10-04T00:43:40Z'),
  end: new Date(1959, 9, 22),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: LUNA_MISSION_FAMILY,
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: "Spacecraft reentered Earth's atmosphere due to orbital decay sometime in 1960-1962",
  },
  thumbnail: 'luna-3-thumb.jpeg',
  wiki: 'https://en.wikipedia.org/wiki/Luna_3',
  visited: [{ id: Bodies.LUNA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1959-10-06T14:16:00Z') }],
});

export const MARS_3 = spacecraftWithDefaults({
  name: 'Mars 3',
  organization: SpacecraftOrganizationId.USSR,
  launchMass: 4650,
  start: new Date('1971-05-28T15:26:30Z'),
  end: new Date(1972, 7, 22),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  focusId: Bodies.MARS.id,
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Lander failed 110 seconds after landing' },
  thumbnail: 'mars-3-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Mars_3',
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.LANDER, start: new Date('1971-12-02T13:52:00Z') }],
});

const ZOND_MISSION_FAMILY = 'Zond';
export const ZOND_5 = spacecraftWithDefaults({
  name: 'Zond 5',
  organization: SpacecraftOrganizationId.USSR,
  launchMass: 5375,
  start: new Date('1968-09-14T21:42:11Z'),
  end: new Date('1968-09-21T16:08:00Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.RETURNED, details: 'Safely returned two Russian tortoises to Earth' },
  focusId: Bodies.LUNA.id,
  missionFamily: ZOND_MISSION_FAMILY,
  thumbnail: 'zond-5-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Zond_5',
  visited: [{ id: Bodies.LUNA.id, type: SpacecraftVisitType.FLYBY, start: new Date(1968, 8, 18) }],
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

export const IKAROS = spacecraftWithDefaults({
  name: 'IKAROS',
  organization: SpacecraftOrganizationId.JAXA,
  launchMass: 310,
  start: new Date('2010-05-20T21:58:22Z'),
  end: new Date('2015-05-20T12:00:00Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Drifting in a heliocentric orbit' },
  thumbnail: 'ikaros-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/IKAROS',
  visited: [{ id: Bodies.VENUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('2010-12-08T12:00:00Z') }],
});

export const JUNO = spacecraftWithDefaults({
  name: 'Juno',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 3625,
  power: 14000, // at Earth, solar
  start: new Date('2011-08-05T16:25:00Z'),
  focusId: Bodies.JUPITER.id,
  orbitalRegimes: [OrbitalRegimeId.OUTER_SYSTEM],
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'juno-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Juno_(spacecraft)',
  color: Bodies.JUPITER.style.fgColor,
  visited: [
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.ORBITER, start: new Date('2016-07-05T03:53:00Z') },
    { id: Bodies.GANYMEDE.id, type: SpacecraftVisitType.FLYBY, start: new Date('2019-12-26T16:58:59Z') },
    { id: Bodies.EUROPA.id, type: SpacecraftVisitType.FLYBY, start: new Date('2022-09-29T09:36:00Z') },
    { id: Bodies.IO.id, type: SpacecraftVisitType.FLYBY, start: new Date('2022-12-14T12:00:00Z') },
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

export const LUCY = spacecraftWithDefaults({
  name: 'Lucy',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 1550,
  power: 504,
  start: new Date('2021-10-16T09:34:02Z'),
  focusId: Bodies.JUPITER.id,
  orbitalRegimes: [OrbitalRegimeId.ASTEROID_BELT, OrbitalRegimeId.OUTER_SYSTEM],
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'lucy-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Lucy_(spacecraft)',
  visited: [
    { id: Bodies.DINKINESH.id, type: SpacecraftVisitType.FLYBY, start: new Date('2023-11-01T12:00:00Z') },
    // TODO: 52246 Donaldjohanson flyby
    // TODO: the rest of the encounters are L4 and L5 Jupiter Trojans
  ],
});

const AIDA_MISSION_FAMILY = 'Asteroid Impact and Deflection Assessment (AIDA)';
export const DART = spacecraftWithDefaults({
  name: 'Double Asteroid Redirect Test (DART)',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 610,
  power: 6600,
  start: new Date('2021-11-24T06:21:02Z'),
  end: new Date('2022-09-26T23:14:00Z'),
  focusId: Bodies.DIDYMOS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: AIDA_MISSION_FAMILY,
  status: { status: SpacecraftStatus.DECOMMISSIONED, details: 'Impacted Dimorphos on September 26, 2022' },
  thumbnail: 'dart-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Double_Asteroid_Redirection_Test',
  visited: [{ id: Bodies.DIDYMOS.id, type: SpacecraftVisitType.IMPACTOR, start: new Date('2022-09-22T23:14:00Z') }],
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

export const MARS_RECONNAISSANCE_ORBITER = spacecraftWithDefaults({
  name: 'Mars Reconnaissance Orbiter',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 2180,
  power: 2000,
  start: new Date('2005-08-12T11:43:00Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.OPERATIONAL },
  focusId: Bodies.MARS.id,
  thumbnail: 'mro-thumb.webp',
  wiki: 'https://en.wikipedia.org/wiki/Mars_Reconnaissance_Orbiter',
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.ORBITER, start: new Date('2006-03-10T21:24:00Z') }],
});

export const INSIGHT = spacecraftWithDefaults({
  name: 'InSight',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 694,
  power: 600,
  start: new Date('2018-05-05T11:05:01Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Lost contact on December 15, 2022' },
  focusId: Bodies.MARS.id,
  wiki: 'https://en.wikipedia.org/wiki/InSight',
  thumbnail: 'insight-thumb.jpg', // TODO
  visited: [
    {
      id: Bodies.MARS.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('2018-11-26T19:52:59Z'),
      end: new Date(2022, 11, 21),
    },
  ],
});

export const PSYCHE = spacecraftWithDefaults({
  name: 'Psyche',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 2608,
  power: 4500,
  start: new Date('2023-10-13T14:19:00Z'),
  focusId: Bodies.PSYCHE.id,
  orbitalRegimes: [OrbitalRegimeId.ASTEROID_BELT],
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'psyche-spacecraft-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Psyche_(spacecraft)',
  visited: [{ id: Bodies.PSYCHE.id, type: SpacecraftVisitType.ORBITER, start: new Date('2029-08-15T12:00:00Z') }],
});

export const EUROPA_CLIPPER = spacecraftWithDefaults({
  name: 'Europa Clipper',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 6065,
  power: 600,
  start: new Date('2024-10-14T16:06:00Z'),
  focusId: Bodies.JUPITER.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM, OrbitalRegimeId.OUTER_SYSTEM],
  status: { status: SpacecraftStatus.OPERATIONAL },
  thumbnail: 'europa-clipper-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Europa_Clipper',
  color: Bodies.EUROPA.style.fgColor,
  visited: [
    { id: Bodies.MARS.id, type: SpacecraftVisitType.GRAVITY_ASSIST, start: new Date('2025-03-01T17:00:00Z') },
    // some uncertainty here as these are planned dates
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.ORBITER, start: new Date('2030-04-11T12:00:00Z') },
    { id: Bodies.GANYMEDE.id, type: SpacecraftVisitType.FLYBY, start: new Date('2030-04-15T12:00:00Z') },
    { id: Bodies.EUROPA.id, type: SpacecraftVisitType.FLYBY, start: new Date('2030-04-15T12:00:00Z') }, // many flybys
  ],
});

const APOLLO_MISSION_FAMILY = 'Apollo';
export const APOLLO_8 = spacecraftWithDefaults({
  name: 'Apollo 8',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 28870,
  start: new Date('1968-12-21T12:51:00Z'),
  end: new Date('1968-12-27T15:51:42Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: APOLLO_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-8-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_8',
  crew: ['Frank Borman', 'James Lovell', 'William Anders'],
  color: Bodies.EARTH.style.fgColor,
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('1968-12-24T10:03:27Z'),
      end: new Date('1968-12-25T06:13:40Z'),
    },
  ],
});

export const APOLLO_10 = spacecraftWithDefaults({
  name: 'Apollo 10',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 42775,
  start: new Date('1969-05-18T16:49:00Z'),
  end: new Date('1969-05-26T16:52:23Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: APOLLO_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-10-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_10',
  crew: ['Thomas Stafford', 'Gene Cernan', 'John Young'],
  color: Bodies.EARTH.style.fgColor,
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('1969-05-21T08:44:54Z'),
      end: new Date('1969-05-24T10:25:29Z'),
    },
  ],
});

export const APOLLO_11 = spacecraftWithDefaults({
  name: 'Apollo 11',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 49735,
  start: new Date('1969-07-16T13:32:00Z'),
  end: new Date('1969-07-24T16:50:35Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: APOLLO_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-11-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_11',
  crew: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins'],
  color: Bodies.EARTH.style.fgColor,
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1969-07-20T20:17:00Z'),
      end: new Date('1969-07-21T17:54:00Z'),
    },
  ],
});

export const APOLLO_12 = spacecraftWithDefaults({
  name: 'Apollo 12',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 49915,
  start: new Date('1969-11-14T16:22:00Z'),
  end: new Date('1969-11-24T20:58:24Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: APOLLO_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-12-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_12',
  crew: ['Pete Conrad', 'Alan Bean', 'Richard Gordon'],
  color: Bodies.EARTH.style.fgColor,
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1969-11-19T06:54:35Z'),
      end: new Date('1969-11-20T14:25:47Z'),
    },
  ],
});

export const APOLLO_13 = spacecraftWithDefaults({
  name: 'Apollo 13',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 44069,
  start: new Date('1970-04-11T19:13:00Z'),
  end: new Date('1970-04-17T18:07:41Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: APOLLO_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-13-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_13',
  crew: ['Jim Lovell', 'Jack Swigert', 'Fred Haise'],
  color: Bodies.EARTH.style.fgColor,
  visited: [{ id: Bodies.LUNA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1970-04-15T00:21:00Z') }],
});

export const APOLLO_14 = spacecraftWithDefaults({
  name: 'Apollo 14',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 46305,
  start: new Date('1971-01-31T21:03:02Z'),
  end: new Date('1971-02-09T21:05:02Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: APOLLO_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-14-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_14',
  crew: ['Alan Shepard', 'Stuart Roosa', 'Edgar Mitchell'],
  color: Bodies.EARTH.style.fgColor,
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1971-02-05T09:18:11Z'),
      end: new Date('1971-02-06T18:48:42Z'),
    },
  ],
});

export const APOLLO_15 = spacecraftWithDefaults({
  name: 'Apollo 15',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 48599,
  start: new Date('1971-07-26T13:34:00Z'),
  end: new Date('1971-08-07T20:45:53Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: APOLLO_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-15-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_15',
  crew: ['David Scott', 'Alfred Worden', 'James Irwin'],
  color: Bodies.EARTH.style.fgColor,
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1971-07-30T22:16:29Z'),
      end: new Date('1971-08-02T17:11:23Z'),
    },
  ],
});

export const APOLLO_16 = spacecraftWithDefaults({
  name: 'Apollo 16',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 52759,
  start: new Date('1972-04-16T17:54:00Z'),
  end: new Date('1972-04-27T19:45:05Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: APOLLO_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-16-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_16',
  crew: ['John Young', 'Ken Mattingly', 'Charlie Duke'],
  color: Bodies.EARTH.style.fgColor,
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1972-04-21T02:23:35Z'),
      end: new Date('1972-04-24T01:25:47Z'),
    },
  ],
});

export const APOLLO_17 = spacecraftWithDefaults({
  name: 'Apollo 17',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 48609,
  start: new Date('1972-12-07T05:33:00Z'),
  end: new Date('1972-12-19T19:54:58Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: APOLLO_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED },
  thumbnail: 'apollo-17-thumb.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Apollo_17',
  crew: ['Gene Cernan', 'Ronald Evans', 'Jack Schmitt'],
  color: Bodies.EARTH.style.fgColor,
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('1972-12-10T19:53:55Z'),
      end: new Date('1972-12-16T23:35:09Z'),
    },
  ],
});

const PIONEER_MISSION_FAMILY = 'Pioneer';
export const PIONEER_10 = spacecraftWithDefaults({
  name: 'Pioneer 10',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 258,
  power: 155,
  start: new Date('1972-03-03T01:49:04Z'),
  end: new Date('2003-01-23T12:00:00Z'),
  orbitalRegimes: [OrbitalRegimeId.OUTER_SYSTEM, OrbitalRegimeId.KUIPER_BELT],
  missionFamily: PIONEER_MISSION_FAMILY,
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Drifting out beyond the Kuiper Belt' },
  wiki: 'https://en.wikipedia.org/wiki/Pioneer_10',
  thumbnail: 'pioneer-10-thumb.jpg',
  visited: [
    { id: Bodies.CALLISTO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1973-12-03T12:26:00Z') },
    { id: Bodies.GANYMEDE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1973-12-03T13:56:00Z') },
    { id: Bodies.EUROPA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1973-12-03T19:26:00Z') },
    { id: Bodies.IO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1973-12-03T22:56:00Z') },
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.FLYBY, start: new Date('1973-12-04T02:26:00Z') },
  ],
});

export const PIONEER_11 = spacecraftWithDefaults({
  name: 'Pioneer 11',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 258.5,
  power: 155,
  //
  start: new Date('1973-04-06T02:11:04Z'),
  end: new Date('1995-11-24T12:00:00Z'),
  orbitalRegimes: [OrbitalRegimeId.OUTER_SYSTEM, OrbitalRegimeId.KUIPER_BELT],
  missionFamily: PIONEER_MISSION_FAMILY,
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Drifting through the Kuiper Belt' },
  wiki: 'https://en.wikipedia.org/wiki/Pioneer_11',
  thumbnail: 'pioneer-11-thumb.jpg',
  visited: [
    { id: Bodies.CALLISTO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1974-12-02T08:21:00Z') },
    { id: Bodies.GANYMEDE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1974-12-02T22:09:00Z') },
    { id: Bodies.IO.id, type: SpacecraftVisitType.FLYBY, start: new Date('1974-12-03T03:11:00Z') },
    { id: Bodies.EUROPA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1974-12-03T04:15:00Z') },
    { id: Bodies.JUPITER.id, type: SpacecraftVisitType.FLYBY, start: new Date('1974-12-03T05:21:19Z') },
    // { id: Bodies.AMALTHEA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1974-12-03T22:29:00Z') }, // TODO
    { id: Bodies.IAPETUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-08-29T06:06:10Z') },
    { id: Bodies.PHOEBE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-08-29T11:53:33Z') },
    { id: Bodies.HYPERION.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-08-31T12:32:33Z') },
    // TODO: Epimetheus, Atlas
    { id: Bodies.DIONE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-09-01T15:59:30Z') },
    { id: Bodies.MIMAS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-09-01T16:26:28Z') },
    { id: Bodies.SATURN.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-09-01T16:29:34Z') },
    // TODO: Janus
    { id: Bodies.TETHYS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-09-01T18:25:34Z') },
    { id: Bodies.ENCELADUS.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-09-01T18:30:14Z') },
    // TODO: Calypso
    { id: Bodies.RHEA.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-09-01T22:15:27Z') },
    { id: Bodies.TITAN.id, type: SpacecraftVisitType.FLYBY, start: new Date('1979-09-02T18:00:33Z') },
  ],
});

export const NEAR_SHOEMAKER = spacecraftWithDefaults({
  name: 'NEAR Shoemaker',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 805,
  power: 1800,
  start: new Date('1996-02-17T20:43:27Z'),
  end: new Date('2001-02-28T00:00:00Z'),
  focusId: Bodies.EROS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Soft landed on 433 Eros on February 12, 2001' },
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
});

export const DEEP_SPACE_1 = spacecraftWithDefaults({
  name: 'Deep Space 1',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 486,
  power: 2500,
  start: new Date('1998-10-24T12:08:00Z'),
  end: new Date('2001-12-18T20:00:00Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Drifting in a heliocentric orbit' },
  wiki: 'https://en.wikipedia.org/wiki/Deep_Space_1',
  thumbnail: 'deep-space-1-thumb.png',
  visited: [
    { id: Bodies.BRAILLE.id, type: SpacecraftVisitType.FLYBY, start: new Date('1999-07-29T04:46:00Z') },
    { id: Bodies.BORRELLY.id, type: SpacecraftVisitType.FLYBY, start: new Date('2001-09-22T22:29:33Z') },
  ],
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

export const STARDUST = spacecraftWithDefaults({
  name: 'Stardust',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 385,
  power: 330,
  start: new Date('1999-02-07T21:04:15Z'),
  end: new Date('2011-03-24T23:33:00Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM, OrbitalRegimeId.ASTEROID_BELT],
  // TODO: returned samples from Wild in 2006 -- how best to model?
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Deactivated on March 24, 2011' },
  wiki: 'https://en.wikipedia.org/wiki/Stardust_(spacecraft)',
  thumbnail: 'stardust-thumb.jpg',
  color: Bodies.DEFAULT_COMET_COLOR,
  visited: [
    { id: Bodies.ANNEFRANK.id, type: SpacecraftVisitType.FLYBY, start: new Date('2002-11-02T04:50:20Z') }, // TODO
    { id: Bodies.WILD.id, type: SpacecraftVisitType.FLYBY, start: new Date('2004-01-02T19:21:28Z') },
    { id: Bodies.TEMPEL.id, type: SpacecraftVisitType.FLYBY, start: new Date('2011-02-15T04:39:10Z') },
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

export const SAKIGAKE = spacecraftWithDefaults({
  name: 'Sakigake',
  organization: SpacecraftOrganizationId.JAXA,
  launchMass: 138.1,
  start: new Date('1985-01-07T19:27:00Z'),
  end: new Date(1995, 10, 15),
  focusId: Bodies.HALLEY.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Lost data contact in 1995, beacon contact in 1999' },
  wiki: 'https://en.wikipedia.org/wiki/Sakigake',
  thumbnail: 'sakigake-thumb.jpg',
  visited: [{ id: Bodies.HALLEY.id, type: SpacecraftVisitType.FLYBY, start: new Date('1986-03-11T04:18:00Z') }],
});

const HAYABUSA_MISSION_FAMILY = 'Hayabusa';
export const HAYABUSA = spacecraftWithDefaults({
  name: 'Hayabusa',
  organization: SpacecraftOrganizationId.JAXA,
  launchMass: 510,
  start: new Date('2003-05-09T04:29:25Z'),
  end: new Date('2010-06-13T14:12:00Z'),
  focusId: Bodies.ITOKAWA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: HAYABUSA_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED, details: 'Returned to Earth with samples of Itokawa in 2010' },
  wiki: 'https://en.wikipedia.org/wiki/Hayabusa',
  thumbnail: 'hayabusa-thumb.jpg',
  visited: [
    {
      id: Bodies.ITOKAWA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('2005-11-19T21:30:00Z'),
      end: new Date('2005-11-19T21:58:00Z'),
    },
  ],
});

export const DEEP_IMPACT = spacecraftWithDefaults({
  name: 'Deep Impact',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 973,
  power: 92,
  start: new Date('2005-01-12T18:47:08Z'),
  end: new Date('2013-08-08T12:00:00Z'),
  focusId: Bodies.TEMPEL.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Communications unexpectedly lost in August 2013' },
  wiki: 'https://en.wikipedia.org/wiki/Deep_Impact_(spacecraft)',
  thumbnail: 'deep-impact-thumb.jpg',
  color: Bodies.DEFAULT_COMET_COLOR,
  visited: [
    { id: Bodies.TEMPEL.id, type: SpacecraftVisitType.IMPACTOR, start: new Date('2005-07-04T05:52:00Z') },
    { id: Bodies.HARTLEY.id, type: SpacecraftVisitType.FLYBY, start: new Date('2010-11-04T13:50:57Z') },
  ],
});

export const DAWN = spacecraftWithDefaults({
  name: 'Dawn',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 1217.7,
  power: 10000,
  start: new Date('2007-09-27T11:34:00Z'),
  end: new Date('2018-10-30T12:00:00Z'),
  focusId: Bodies.CERES.id,
  orbitalRegimes: [OrbitalRegimeId.ASTEROID_BELT],
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
});

const CHANGE_MISSION_FAMILY = "Chang'e";
// TODO: this is in a heliocentric orbit -- find the parameters and add as a body
export const CHANGE_2 = spacecraftWithDefaults({
  name: "Chang'e 2",
  organization: SpacecraftOrganizationId.CNSA,
  launchMass: 2480,
  start: new Date('2010-10-01T10:59:00Z'),
  end: new Date(2014, 6, 1),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: CHANGE_MISSION_FAMILY,
  status: { status: SpacecraftStatus.DEFUNCT, details: "Drifting out beyond Earth's orbit" },
  wiki: 'https://en.wikipedia.org/wiki/Chang%27e_2',
  thumbnail: 'change-2-thumb.jpg',
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('2010-10-06T03:06:00Z'),
      end: new Date('2011-06-08T12:00:00Z'),
    },
    { id: Bodies.TOUTATIS.id, type: SpacecraftVisitType.FLYBY, start: new Date('2012-12-13T08:30:00Z') },
  ],
});

export const CHANGE_4 = spacecraftWithDefaults({
  name: "Chang'e 4",
  organization: SpacecraftOrganizationId.CNSA,
  launchMass: 3780,
  start: new Date('2018-12-07T18:23:00Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: CHANGE_MISSION_FAMILY,
  focusId: Bodies.LUNA.id,
  status: { status: SpacecraftStatus.OPERATIONAL },
  wiki: 'https://en.wikipedia.org/wiki/Chang%27e_4',
  thumbnail: 'change-4-thumb.jpg',
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('2019-01-03T02:26:00Z'),
    },
  ],
});

export const YUTU_2 = spacecraftWithDefaults({
  name: 'Yutu-2',
  organization: SpacecraftOrganizationId.CNSA,
  launchMass: 140,
  start: new Date('2018-12-07T18:23:00Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: CHANGE_MISSION_FAMILY,
  focusId: Bodies.LUNA.id,
  status: { status: SpacecraftStatus.OPERATIONAL, details: 'Still operational as of September 2024' },
  wiki: 'https://en.wikipedia.org/wiki/Yutu-2',
  thumbnail: 'yutu-2-thumb.jpg',
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.ROVER,
      start: new Date('2019-01-03T02:26:00Z'),
    },
  ],
});

export const CHANGE_5 = spacecraftWithDefaults({
  name: "Chang'e 5",
  organization: SpacecraftOrganizationId.CNSA,
  launchMass: 8200,
  start: new Date('2020-11-23T20:30:12Z'),
  end: new Date('2020-12-16T17:59:00Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: CHANGE_MISSION_FAMILY,
  focusId: Bodies.LUNA.id,
  status: { status: SpacecraftStatus.RETURNED, details: 'Capsule returned to Earth with 1.7 kg of samples' },
  wiki: 'https://en.wikipedia.org/wiki/Chang%27e_5',
  thumbnail: 'change-5-thumb.jpg',
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('2020-12-01T15:11:00Z'),
      end: new Date('2020-12-03T15:10:00Z'),
    },
  ],
});

export const CHANGE_6 = spacecraftWithDefaults({
  name: "Chang'e 6",
  organization: SpacecraftOrganizationId.CNSA,
  launchMass: 8350,
  start: new Date('2024-05-03T09:27:29Z'),
  end: new Date('2024-06-25T06:07:00Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: CHANGE_MISSION_FAMILY,
  focusId: Bodies.LUNA.id,
  status: {
    status: SpacecraftStatus.RETURNED,
    details: 'Returned with the first samples collected from the far side of the Moon',
  },
  wiki: 'https://en.wikipedia.org/wiki/Chang%27e_6',
  thumbnail: 'change-6-thumb.jpg',
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('2024-06-01T22:23:16Z'),
      end: new Date('2024-06-03T23:38:10Z'),
    },
  ],
});

// TODO: include MINERVA-II lander? the 4 rovers? the impactor? crazy mission
export const HAYABUSA_2 = spacecraftWithDefaults({
  name: 'Hayabusa2',
  organization: SpacecraftOrganizationId.JAXA,
  launchMass: 600,
  power: 2600,
  start: new Date('2014-12-03T04:22:04Z'),
  end: new Date('2020-12-05T12:00:00Z'),
  focusId: Bodies.RYUGU.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: HAYABUSA_MISSION_FAMILY,
  status: { status: SpacecraftStatus.RETURNED, details: 'Returned to Earth with 5 grams of material from Ryugu' },
  wiki: 'https://en.wikipedia.org/wiki/Hayabusa2',
  thumbnail: 'hayabusa-2-thumb.jpg',
  visited: [{ id: Bodies.RYUGU.id, type: SpacecraftVisitType.ORBITER, start: new Date('2018-06-27T12:00:00Z') }],
});

export const AKATSUKI = spacecraftWithDefaults({
  name: 'Akatsuki',
  organization: SpacecraftOrganizationId.JAXA,
  launchMass: 517.6,
  power: 700,
  start: new Date('2010-05-21T21:58:22Z'),
  end: new Date(2024, 4, 29),
  focusId: Bodies.VENUS.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Lost contact in April 2024' },
  wiki: 'https://en.wikipedia.org/wiki/Akatsuki_(spacecraft)',
  thumbnail: 'akatsuki-thumb.png',
  visited: [{ id: Bodies.VENUS.id, type: SpacecraftVisitType.ORBITER, start: new Date(2015, 11, 7) }],
});

export const OSIRIS_REX = spacecraftWithDefaults({
  name: 'OSIRIS-REx',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 2110,
  power: 3000,
  start: new Date('2016-09-08T23:05:00Z'),
  end: new Date('2023-09-24T14:52:00Z'),
  focusId: Bodies.BENNU.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
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
});

export const SPACECRAFT: Array<Spacecraft> = [
  // Inner missions
  MESSENGER,
  PARKER_SOLAR_PROBE,
  BEPICOLOMBO,
  SOLAR_ORBITER,
  GIOTTO,
  SAKIGAKE,
  ULYSSES,

  // Venus
  // VENERA_1,
  MARINER_2,
  // ZOND_1,
  // VENERA_2,
  // VENERA_3,
  // VENERA_4,
  // MARINER_5,
  // VENERA_5,
  // VENERA_6,
  VENERA_7,
  // VENERA_8,
  MARINER_10,
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
  MAGELLAN,
  VENUS_EXPRESS,
  AKATSUKI,
  IKAROS,
  // SHINEN,

  // Luna
  // LUNA_1,
  // PIONEER_4,
  LUNA_2,
  LUNA_3,
  // RANGER_7,
  // RANGER_8,
  // RANGER_9,
  // ZOND_3,
  // LUNA_9,
  // SURVEYOR_1,
  // LUNAR_ORBITER_1,
  // LUNA_11,
  ZOND_5,
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
  CHANGE_4,
  YUTU_2,
  CHANGE_5,
  CHANGE_6,

  // Mars
  MARINER_4,
  CURIOSITY,
  PERSEVERANCE,
  INGENUITY,
  TIANWEN_1,
  ZHURONG,
  PATHFINDER,
  SOJOURNER,
  // SPIRIT,
  // OPPORTUNITY,
  // MARS_2,
  MARS_3,
  MARS_RECONNAISSANCE_ORBITER,
  // VIKING_1,
  // VIKING_2,
  // MARS_PATHFINDER,
  // PHOENIX,
  INSIGHT,

  // Asteroids
  NEAR_SHOEMAKER,
  DEEP_SPACE_1,
  STARDUST,
  HAYABUSA,
  DEEP_IMPACT,
  DAWN,
  CHANGE_2,
  ROSETTA,
  HAYABUSA_2,
  OSIRIS_REX,
  LUCY,
  DART,
  PSYCHE,
  HERA,

  // Outer missions
  PIONEER_10,
  PIONEER_11,
  VOYAGER_1,
  VOYAGER_2,
  GALILEO,
  CASSINI,
  HUYGENS,
  NEW_HORIZONS,
  JUICE,
  JUNO,
  EUROPA_CLIPPER,
].sort((a, b) => a.start.getTime() - b.start.getTime());

export const SPACECRAFT_BY_BODY_ID = mapObjIndexed(
  (spacecraft, bodyId) =>
    spacecraft.sort(
      (a, b) =>
        (a.visited.find(({ id }) => id === bodyId)?.start?.getTime() ?? a.start.getTime()) -
        (b.visited.find(({ id }) => id === bodyId)?.start?.getTime() ?? b.start.getTime())
    ),
  SPACECRAFT.reduce<Record<CelestialBodyId, Array<Spacecraft>>>((acc, spacecraft) => {
    spacecraft.visited.forEach(visited => {
      acc[visited.id] = [...(acc[visited.id] ?? []), spacecraft];
    });
    return acc;
  }, {})
);

export const SPACECRAFT_BY_ID = SPACECRAFT.reduce<Record<SpacecraftId, Spacecraft>>((acc, spacecraft) => {
  acc[spacecraft.id] = spacecraft;
  return acc;
}, {});
