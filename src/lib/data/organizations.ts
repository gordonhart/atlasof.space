import { SpacecraftOrganization, SpacecraftOrganizationId } from '../types.ts';

const NASA: SpacecraftOrganization = {
  id: SpacecraftOrganizationId.NASA,
  name: 'National Aeronautics and Space Administration',
  shortName: 'NASA',
  founded: new Date(1958, 6, 29),
  thumbnail: 'nasa-meatball.svg',
  wiki: 'https://en.wikipedia.org/wiki/NASA',
  // color: '#0032a0', // official blue
  color: '#1b3c8c',
};

const USSR: SpacecraftOrganization = {
  id: SpacecraftOrganizationId.USSR,
  name: 'Soviet Space Program',
  shortName: 'USSR',
  founded: new Date(1951, 6, 22),
  dissolved: new Date(1991, 10, 14),
  thumbnail: 'ussr-logo.svg',
  wiki: 'https://en.wikipedia.org/wiki/Soviet_space_program',
  color: `#bc271a`,
};

const ESA: SpacecraftOrganization = {
  id: SpacecraftOrganizationId.ESA,
  name: 'European Space Agency',
  shortName: 'ESA',
  founded: new Date(1975, 4, 30),
  thumbnail: 'esa-logo.png',
  wiki: 'https://en.wikipedia.org/wiki/European_Space_Agency',
  // color: `#003247`, // official
  color: '#00567a',
};

const JAXA: SpacecraftOrganization = {
  id: SpacecraftOrganizationId.JAXA,
  name: 'Japan Aerospace Exploration Agency',
  shortName: 'JAXA',
  founded: new Date(2003, 9, 1),
  thumbnail: 'jaxa-logo.png',
  wiki: 'https://en.wikipedia.org/wiki/JAXA',
  color: `#285eaa`,
};

const CNSA: SpacecraftOrganization = {
  id: SpacecraftOrganizationId.CNSA,
  name: 'China National Space Administration',
  shortName: 'CNSA',
  founded: new Date(1993, 3, 22),
  thumbnail: 'cnsa-logo.svg',
  wiki: 'https://en.wikipedia.org/wiki/China_National_Space_Administration',
  color: '#4887e4',
};

// TODO: ISRO -- Chandrayaan 1-3, Aditya, Mars Orbiter are all worth including
export const SPACECRAFT_ORGANIZATIONS = [NASA, USSR, ESA, JAXA, CNSA].reduce(
  (acc, org) => ({ ...acc, [org.id]: org }),
  {} as Record<SpacecraftOrganizationId, SpacecraftOrganization>
);
