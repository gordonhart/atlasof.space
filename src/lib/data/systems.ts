import { PlanetarySystem, PlanetarySystemId } from '../types.ts';
import { EARTH, JUPITER, MARS, SATURN } from './bodies.ts';

export const EARTH_SYSTEM: PlanetarySystem = {
  id: PlanetarySystemId.EARTH,
  name: 'Earth System',
  wrt: EARTH.id,
  min: EARTH.radius + 300e3,
  max: 1_471_400e3, // Hill radius, https://en.wikipedia.org/wiki/Hill_sphere#Hill_spheres_for_the_solar_system
  roundness: 0.25,
};

export const MARS_SYSTEM: PlanetarySystem = {
  id: PlanetarySystemId.MARS,
  name: 'Mars System',
  wrt: MARS.id,
  min: MARS.radius + 300e3,
  max: 982_700e3, // Hill radius
  roundness: 0.25,
};

export const JUPITER_SYSTEM: PlanetarySystem = {
  id: PlanetarySystemId.JUPITER,
  name: 'Jupiter System',
  wrt: JUPITER.id,
  min: JUPITER.radius + 100_000e3,
  max: 50_573_600e3, // Hill radius
  roundness: 0.25,
};

export const SATURN_SYSTEM: PlanetarySystem = {
  id: PlanetarySystemId.SATURN,
  name: 'Saturn System',
  wrt: SATURN.id,
  min: SATURN.radius + 100_000e3,
  max: 61_634_000e3, // Hill radius
  roundness: 0.25,
};

const PLANETARY_SYSTEMS_ARRAY = [EARTH_SYSTEM, MARS_SYSTEM, JUPITER_SYSTEM, SATURN_SYSTEM];
export const PLANETARY_SYSTEMS = Object.fromEntries(PLANETARY_SYSTEMS_ARRAY.map(r => [r.id, r]));
