import { OrbitalRegimeId, SpacecraftOrganizationId, SpacecraftStatus, SpacecraftVisitType } from '../../types.ts';
import * as Bodies from '../bodies.ts';
import { spacecraftWithDefaults } from './utils.ts';

const CHANGE_MISSION_FAMILY = "Chang'e";
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

export const CNSA_SPACECRAFT = [CHANGE_2, CHANGE_4, TIANWEN_1, ZHURONG, CHANGE_5, CHANGE_6, YUTU_2];
