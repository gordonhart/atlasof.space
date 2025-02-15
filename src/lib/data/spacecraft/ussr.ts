import { OrbitalRegimeId, SpacecraftOrganizationId, SpacecraftStatus, SpacecraftVisitType } from '../../types.ts';
import * as Bodies from '../bodies.ts';
import { spacecraftWithDefaults } from './utils.ts';

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

export const LUNOKHOD_1 = spacecraftWithDefaults({
  name: 'Lunokhod 1',
  organization: SpacecraftOrganizationId.USSR,
  launchMass: 756,
  power: 180,
  start: new Date('1970-11-10T14:44:01Z'),
  end: new Date('1971-09-14T13:05:00Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.DEFUNCT, details: 'Last contact on September 14, 1971' },
  wiki: 'https://en.wikipedia.org/wiki/Lunokhod_1',
  thumbnail: 'lunokhod-1-thumb.jpg',
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.ROVER,
      start: new Date('1970-11-17T03:47:00Z'),
      end: new Date('1971-09-14T13:05:00Z'),
    },
  ],
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
  color: Bodies.MARS.style.fgColor,
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.LANDER, start: new Date('1971-12-02T13:52:00Z') }],
});

const VEGA_MISSION_FAMILY = 'Vega';
export const VEGA_1 = spacecraftWithDefaults({
  name: 'Vega 1',
  organization: SpacecraftOrganizationId.USSR,
  launchMass: 4840,
  start: new Date('1984-12-15T09:16:24Z'),
  end: new Date(1987, 0, 30),
  focusId: Bodies.HALLEY.id,
  color: Bodies.HALLEY.style.fgColor,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: VEGA_MISSION_FAMILY,
  status: {
    status: SpacecraftStatus.DEFUNCT,
    details: 'Drifting in a heliocentric orbit after losing contact on January 30, 1987',
  },
  thumbnail: 'vega-1-thumb.png',
  wiki: 'https://en.wikipedia.org/wiki/Vega_1',
  visited: [
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.LANDER, start: new Date('1985-06-11T03:02:54Z') },
    { id: Bodies.HALLEY.id, type: SpacecraftVisitType.FLYBY, start: new Date(1986, 2, 6) },
  ],
});

export const VEGA_2 = spacecraftWithDefaults({
  name: 'Vega 2',
  organization: SpacecraftOrganizationId.USSR,
  launchMass: 4840,
  start: new Date('1984-12-21T09:13:52Z'),
  end: new Date(1987, 2, 24),
  focusId: Bodies.HALLEY.id,
  color: Bodies.HALLEY.style.fgColor,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  missionFamily: VEGA_MISSION_FAMILY,
  status: {
    status: SpacecraftStatus.DEFUNCT,
    details: 'Drifting in a heliocentric orbit after losing contact on March 24, 1987',
  },
  wiki: 'https://en.wikipedia.org/wiki/Vega_2',
  thumbnail: 'vega-2-thumb.jpg',
  visited: [
    { id: Bodies.VENUS.id, type: SpacecraftVisitType.LANDER, start: new Date(1985, 5, 15) },
    { id: Bodies.HALLEY.id, type: SpacecraftVisitType.FLYBY, start: new Date(1986, 2, 9) },
  ],
});

/*
 * TODO:
 *  - Sputnik 1
 *  - Luna 1
 *  - Vostok 1
 *  - Venera 4
 *  - Mars 2
 *  - Luna 11
 *  - Salyut 1
 *  - Venera 9
 *  - Mir
 */
export const SOVIET_SPACECRAFT = [LUNA_2, LUNA_3, ZOND_5, VENERA_7, LUNOKHOD_1, MARS_3, VEGA_1, VEGA_2];
