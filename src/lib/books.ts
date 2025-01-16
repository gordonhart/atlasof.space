import * as Bodies from './bodies.ts';
import { CelestialBodyId } from './types.ts';

const Author = {
  SUAREZ: 'Daniel Suarez',
  ROBINSON: 'Kim Stanley Robinson',
  HALDEMAN: 'Joe Haldeman',
  REYNOLDS: 'Alastair Reynolds',
  MCAULEY: 'Paul McAuley',
  LEM: 'Stanisław Lem',
};

export type Book = {
  title: string;
  author: string;
  series?: { name: string; index: number };
  year: number;
  thumbnail?: string;
  bodies: Array<{
    id: CelestialBodyId;
    details?: string;
  }>;
};

// delta-v duology
export const DELTA_V: Book = {
  title: 'Delta-v',
  author: Author.SUAREZ,
  series: { name: 'Delta-v', index: 0 },
  year: 2019,
  bodies: [{ id: Bodies.RYUGU.id }],
};
export const CRITICAL_MASS: Book = {
  title: 'Critical Mass',
  author: Author.SUAREZ,
  series: { name: 'Delta-v', index: 1 },
  year: 2023,
  bodies: [{ id: Bodies.RYUGU.id }, { id: Bodies.LUNA.id }],
};

// red mars trilogy
export const RED_MARS: Book = {
  title: 'Red Mars',
  author: Author.ROBINSON,
  series: { name: 'Mars Trilogy', index: 0 },
  year: 1992,
  bodies: [
    { id: Bodies.MARS.id },
    { id: Bodies.PHOBOS.id, details: 'Turned into a military complex and destroyed' },
    // TODO: also include asteroid 4923 Clarke which is turned into the anchor for the space elevator
  ],
};
export const GREEN_MARS: Book = {
  title: 'Green Mars',
  author: Author.ROBINSON,
  series: { name: 'Mars Trilogy', index: 1 },
  year: 1993,
  bodies: [{ id: Bodies.MARS.id }],
};
export const BLUE_MARS: Book = {
  title: 'Blue Mars',
  author: Author.ROBINSON,
  series: { name: 'Mars Trilogy', index: 2 },
  year: 1996,
  bodies: [
    { id: Bodies.MARS.id },
    { id: Bodies.MERCURY.id },
    { id: Bodies.GANYMEDE.id },
    { id: Bodies.TITAN.id },
    { id: Bodies.TRITON.id },
  ],
};

export const FOREVER_WAR: Book = {
  title: 'The Forever War',
  author: Author.HALDEMAN,
  year: 1974,
  bodies: [{ id: Bodies.CHARON.id }],
};

export const PUSHING_ICE: Book = {
  title: 'Pushing Ice',
  author: Author.REYNOLDS,
  year: 2005,
  bodies: [
    // { id: Bodies.JANUS.id } // TODO
  ],
};
export const EVERSION: Book = {
  title: 'Eversion',
  author: Author.REYNOLDS,
  year: 2022,
  bodies: [{ id: Bodies.EUROPA.id }],
};

export const RETROGRADE: Book = {
  title: 'Retrograde',
  author: 'Peter Cawdron',
  year: 2016,
  bodies: [{ id: Bodies.MARS.id }],
};

export const PALLAS: Book = {
  title: 'Pallas',
  author: 'Lisa Kuznak',
  year: 2023,
  bodies: [{ id: Bodies.PALLAS.id }],
};

export const THEFT_OF_FIRE: Book = {
  title: 'Theft of Fire',
  author: 'Devon Eriksen',
  year: 2023,
  bodies: [
    { id: Bodies.SEDNA.id },
    // { id: Bodies.ARACHNE.id }, // TODO
  ],
};

// quiet war duology
export const QUIET_WAR: Book = {
  title: 'The Quiet War',
  author: Author.MCAULEY,
  series: { name: 'The Quiet War', index: 0 },
  year: 2008,
  bodies: [
    { id: Bodies.LUNA.id },
    { id: Bodies.JUPITER.id }, // TODO: include?
    { id: Bodies.CALLISTO.id },
    { id: Bodies.GANYMEDE.id },
    { id: Bodies.SATURN.id },
    { id: Bodies.MIMAS.id },
    { id: Bodies.ENCELADUS.id },
    { id: Bodies.PHOEBE.id },
    { id: Bodies.DIONE.id },
    { id: Bodies.TITAN.id },
  ],
};
export const GARDENS_OF_THE_SUN: Book = {
  title: 'Gardens of the Sun',
  author: Author.MCAULEY,
  series: { name: 'The Quiet War', index: 1 },
  year: 2009,
  bodies: [
    // { id: Bodies.JANUS.id } // TODO
    { id: Bodies.SATURN.id }, // TODO: include?
    { id: Bodies.IAPETUS.id },
    { id: Bodies.DIONE.id },
    { id: Bodies.TITAN.id },
    { id: Bodies.MIMAS.id },
    { id: Bodies.RHEA.id },
    { id: Bodies.TITANIA.id },
    { id: Bodies.MIRANDA.id },
    { id: Bodies.OBERON.id },
    { id: Bodies.ARIEL.id },
    { id: Bodies.URANUS.id }, // TODO: include? not directly visited
    { id: Bodies.PLUTO.id },
    { id: Bodies.CHARON.id },
    { id: Bodies.LUNA.id },
    { id: Bodies.NEPTUNE.id },
    { id: Bodies.PROTEUS.id },
    { id: Bodies.TRITON.id },
  ],
};

export const EUROPA_DEEP: Book = {
  title: 'Europa Deep',
  author: 'Gary Gibson',
  year: 2023,
  bodies: [{ id: Bodies.EUROPA.id }],
};

export const FIASCO: Book = {
  title: 'Fiasco',
  author: Author.LEM,
  year: 1986,
  bodies: [{ id: Bodies.TITAN.id }],
};

export const PRECIPICE: Book = {
  title: 'The Precipice',
  author: 'Ben Bova',
  year: 2001,
  bodies: [
    { id: Bodies.LUNA.id },
    // { id: Bodies.BONANZA.id }, // TODO: fictional
  ],
};

export const SATURN_RUN: Book = {
  title: 'Saturn Run',
  author: 'John Sandford, Ctein',
  year: 2015,
  bodies: [{ id: Bodies.SATURN.id }],
};

export const THIN_AIR: Book = {
  title: 'Thin Air',
  author: 'Richard K. Morgan',
  year: 2018,
  bodies: [{ id: Bodies.MARS.id }],
};

export const SEA_OF_TRANQUILITY: Book = {
  title: 'Sea of Tranquility',
  author: 'Emily St. John Mandel',
  year: 2022,
  bodies: [{ id: Bodies.LUNA.id }],
};

export const BLINDSIGHT: Book = {
  title: 'Blindsight',
  author: 'Peter Watts',
  year: 2006,
  bodies: [
    // { id: Bodies.BURNS_CAULFIELD.id } // TODO: fictional
    // { id: Bodies.BIG_BEN.id } // TODO: fictional
  ],
};
export const ECHOPRAXIA: Book = {
  title: 'Echopraxia',
  author: 'Peter Watts',
  year: 2014,
  bodies: [
    // { id: Bodies.ICARUS_STATION.id } // TODO: fictional
  ],
};

export const NOVA: Book = {
  title: 'Nova',
  author: 'Samuel R. Delany',
  year: 1968,
  bodies: [],
};

export const SIRENS_OF_TITAN: Book = {
  title: 'The Sirens of Titan',
  author: 'Kurt Vonnegut',
  year: 1959,
  bodies: [{ id: Bodies.TITAN.id }, { id: Bodies.MARS.id }],
};

export const GUNPOWDER_MOON: Book = {
  title: 'Gunpowder Moon',
  author: 'David Pedreira',
  year: 2018,
  bodies: [{ id: Bodies.LUNA.id }],
};

export const PRINCESS_OF_MARS: Book = {
  title: 'A Princess of Mars',
  author: 'Edgar Rice Burroughs',
  year: 1912,
  bodies: [{ id: Bodies.MARS.id }],
};

// the expanse series
export const LEVIATHAN_WAKES: Book = {
  title: 'Leviathan Wakes',
  author: 'James S.A. Corey',
  series: { name: 'The Expanse', index: 0 },
  year: 2011,
  bodies: [
    // TODO: there are more, and they're spread across the series
    { id: Bodies.LUNA.id },
    { id: Bodies.MARS.id },
    { id: Bodies.CERES.id },
    { id: Bodies.EROS.id },
    { id: Bodies.JUPITER.id },
    { id: Bodies.IO.id },
    { id: Bodies.GANYMEDE.id },
    { id: Bodies.EUROPA.id },
    { id: Bodies.CALLISTO.id },
    { id: Bodies.SATURN.id },
    { id: Bodies.PHOEBE.id },
    { id: Bodies.TITAN.id },
  ],
};
