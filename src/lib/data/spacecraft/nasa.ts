import { OrbitalRegimeId, SpacecraftOrganizationId, SpacecraftStatus, SpacecraftVisitType } from '../../types.ts';
import * as Bodies from '../bodies.ts';
import { spacecraftWithDefaults } from './utils.ts';

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

const VOYAGER_MISSION_FAMILY = 'Voyager';
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

export const MARS_GLOBAL_SURVEYOR = spacecraftWithDefaults({
  name: 'Mars Global Surveyor',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 1030.5,
  power: 980,
  start: new Date('1996-11-07T17:00:00Z'),
  end: new Date(2007, 0, 28),
  status: {
    status: SpacecraftStatus.DEFUNCT,
    details: 'Contact lost on November 2, 2006, estimated to remain in orbit until ~2050',
  },
  focusId: Bodies.MARS.id,
  color: Bodies.MARS.style.fgColor,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  thumbnail: 'mars-global-surveyor.jpg',
  wiki: 'https://en.wikipedia.org/wiki/Mars_Global_Surveyor',
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.ORBITER, start: new Date('1997-09-11T01:17:00Z') }],
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

export const CASSINI_HUYGENS_MISSION_FAMILY = 'Cassini-Huygens';
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
  color: Bodies.MARS.style.fgColor,
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.ORBITER, start: new Date('2006-03-10T21:24:00Z') }],
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

export const MAVEN = spacecraftWithDefaults({
  name: 'MAVEN',
  organization: SpacecraftOrganizationId.NASA,
  launchMass: 2454,
  power: 1135,
  start: new Date('2013-11-18T18:28:00Z'),
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: { status: SpacecraftStatus.OPERATIONAL },
  focusId: Bodies.MARS.id,
  color: Bodies.MARS.style.fgColor,
  wiki: 'https://en.wikipedia.org/wiki/MAVEN',
  thumbnail: 'maven-thumb.png',
  visited: [{ id: Bodies.MARS.id, type: SpacecraftVisitType.ORBITER, start: new Date('2014-09-22T02:24:00Z') }],
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
  thumbnail: 'insight-thumb.jpg',
  color: Bodies.MARS.style.fgColor,
  visited: [
    {
      id: Bodies.MARS.id,
      type: SpacecraftVisitType.LANDER,
      start: new Date('2018-11-26T19:52:59Z'),
      end: new Date(2022, 11, 21),
    },
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

export const AIDA_MISSION_FAMILY = 'Asteroid Impact and Deflection Assessment (AIDA)';
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

/*
 * TODO:
 *  - Explorer 1
 *  - Mariner 3
 *  - Pioneer 4
 *  - Skylab
 *  - Lunar Orbiter 1
 *  - Ranger 7
 *  - Viking 1
 *  - Viking 2
 *  - Pioneer Venus 1+2
 *  - Surveyor 1
 *  - Mars Odyssey
 *  - Phoenix
 *  - Spirit
 *  - Opportunity
 */
export const NASA_SPACECRAFT = [
  MARINER_2,
  MARINER_4,
  APOLLO_8,
  APOLLO_10,
  APOLLO_11,
  APOLLO_12,
  APOLLO_13,
  APOLLO_14,
  APOLLO_15,
  PIONEER_10,
  APOLLO_16,
  APOLLO_17,
  PIONEER_11,
  MARINER_10,
  VOYAGER_2,
  VOYAGER_1,
  MAGELLAN,
  GALILEO,
  NEAR_SHOEMAKER,
  MARS_GLOBAL_SURVEYOR,
  PATHFINDER,
  SOJOURNER,
  CASSINI,
  DEEP_SPACE_1,
  STARDUST,
  MESSENGER,
  DEEP_IMPACT,
  MARS_RECONNAISSANCE_ORBITER,
  NEW_HORIZONS,
  DAWN,
  JUNO,
  CURIOSITY,
  MAVEN,
  OSIRIS_REX,
  INSIGHT,
  PARKER_SOLAR_PROBE,
  PERSEVERANCE,
  INGENUITY,
  LUCY,
  DART,
  PSYCHE,
  EUROPA_CLIPPER,
];
