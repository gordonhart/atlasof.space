import { OrbitalRegimeId, OrbitalRegime } from '../types.ts';
import { AU, EARTH, JUPITER, MARS, SATURN, SOL } from './bodies.ts';

export const INNER_SYSTEM: OrbitalRegime = {
  id: OrbitalRegimeId.INNER_SYSTEM,
  wrt: SOL.id,
  min: 0.2 * AU,
  max: 2.2 * AU,
  roundness: 0.1,
};

export const ASTEROID_BELT: OrbitalRegime = {
  id: OrbitalRegimeId.ASTEROID_BELT,
  wrt: SOL.id,
  min: 2.0 * AU,
  max: 3.2 * AU,
  roundness: 2,
};

export const OUTER_SYSTEM: OrbitalRegime = {
  id: OrbitalRegimeId.OUTER_SYSTEM,
  wrt: SOL.id,
  min: 3.2 * AU,
  max: 32 * AU,
  roundness: 0.1,
};

export const KUIPER_BELT: OrbitalRegime = {
  id: OrbitalRegimeId.KUIPER_BELT,
  wrt: SOL.id,
  min: 30 * AU,
  max: 55 * AU,
  roundness: 0.1,
};

export const INNER_OORT_CLOUD: OrbitalRegime = {
  id: OrbitalRegimeId.INNER_OORT_CLOUD,
  wrt: SOL.id,
  min: 55 * AU,
  max: 20000 * AU,
  roundness: 0.001, // so huge that rendering as a flat disk is better
};

export const EARTH_SYSTEM: OrbitalRegime = {
  id: OrbitalRegimeId.EARTH_SYSTEM,
  wrt: EARTH.id,
  min: EARTH.radius + 300e3,
  max: 1_471_400e3, // Hill radius, https://en.wikipedia.org/wiki/Hill_sphere#Hill_spheres_for_the_solar_system
  roundness: 0.25,
};

export const MARS_SYSTEM: OrbitalRegime = {
  id: OrbitalRegimeId.MARS_SYSTEM,
  wrt: MARS.id,
  min: MARS.radius + 300e3,
  max: 982_700e3, // Hill radius
  roundness: 0.25,
};

export const JUPITER_SYSTEM: OrbitalRegime = {
  id: OrbitalRegimeId.JUPITER_SYSTEM,
  wrt: JUPITER.id,
  min: JUPITER.radius + 100_000e3,
  max: 50_573_600e3, // Hill radius
  roundness: 0.25,
};

export const SATURN_SYSTEM: OrbitalRegime = {
  id: OrbitalRegimeId.SATURN_SYSTEM,
  wrt: SATURN.id,
  min: SATURN.radius + 100_000e3,
  max: 61_634_000e3, // Hill radius
  roundness: 0.25,
};

// TODO: Uranus, Neptune, Pluto

const HELIOCENTRIC_REGIMES = [INNER_SYSTEM, ASTEROID_BELT, OUTER_SYSTEM, KUIPER_BELT, INNER_OORT_CLOUD];
const PLANETARY_SYSTEMS = [EARTH_SYSTEM, MARS_SYSTEM, JUPITER_SYSTEM, SATURN_SYSTEM];
export const ORBITAL_REGIMES: Array<OrbitalRegime> = [...HELIOCENTRIC_REGIMES, ...PLANETARY_SYSTEMS];

export const ORBITAL_REGIMES_BY_ID = Object.fromEntries(ORBITAL_REGIMES.map(r => [r.id, r]));

export function orbitalRegimeDisplayName(regime: OrbitalRegimeId) {
  return {
    [OrbitalRegimeId.INNER_SYSTEM]: 'Inner System',
    [OrbitalRegimeId.ASTEROID_BELT]: 'Asteroid Belt',
    [OrbitalRegimeId.OUTER_SYSTEM]: 'Outer System',
    [OrbitalRegimeId.KUIPER_BELT]: 'Kuiper Belt',
    [OrbitalRegimeId.INNER_OORT_CLOUD]: 'Inner Oort Cloud',
    [OrbitalRegimeId.EARTH_SYSTEM]: 'Earth System',
    [OrbitalRegimeId.MARS_SYSTEM]: 'Mars System',
    [OrbitalRegimeId.JUPITER_SYSTEM]: 'Jupiter System',
    [OrbitalRegimeId.SATURN_SYSTEM]: 'Saturn System',
  }[regime];
}
