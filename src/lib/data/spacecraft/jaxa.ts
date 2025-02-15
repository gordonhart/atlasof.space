import { OrbitalRegimeId, SpacecraftOrganizationId, SpacecraftStatus, SpacecraftVisitType } from '../../types.ts';
import * as Bodies from '../bodies.ts';
import { spacecraftWithDefaults } from './utils.ts';

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

export const SELENE = spacecraftWithDefaults({
  name: 'SELENE',
  organization: SpacecraftOrganizationId.JAXA,
  launchMass: 3020,
  power: 3486,
  start: new Date('2007-09-14T01:31:01Z'),
  end: new Date('2009-06-10T18:25:00Z'),
  focusId: Bodies.LUNA.id,
  orbitalRegimes: [OrbitalRegimeId.INNER_SYSTEM],
  status: {
    status: SpacecraftStatus.DECOMMISSIONED,
    details: 'Deliberately impacted lunar surface near crater Gill',
  },
  wiki: 'https://en.wikipedia.org/wiki/SELENE',
  thumbnail: 'selene-thumb.jpg',
  visited: [
    {
      id: Bodies.LUNA.id,
      type: SpacecraftVisitType.ORBITER,
      start: new Date('2007-10-03T00:00:00Z'), // Lunar orbit insertion
      end: new Date('2009-06-10T18:25:00Z'), // Impact date
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
  color: Bodies.VENUS.style.fgColor,
  visited: [{ id: Bodies.VENUS.id, type: SpacecraftVisitType.ORBITER, start: new Date(2015, 11, 7) }],
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

/*
 * TODO:
 *  - Hiten
 *  - Nozomi
 *  - SELENE/Kayuga
 *  - SLIM
 */
export const JAXA_SPACECRAFT = [SAKIGAKE, HAYABUSA, SELENE, IKAROS, AKATSUKI, HAYABUSA_2];
