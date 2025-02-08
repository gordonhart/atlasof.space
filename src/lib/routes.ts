import { SOLAR_SYSTEM } from './bodies.ts';
import { SPACECRAFT } from './spacecraft.ts';
import { itemIdAsRoute } from './state.ts';
import { OrbitalRegimeId } from './types.ts';

export const ROUTES = [
  null, // root
  ...SOLAR_SYSTEM.map(({ id }) => id),
  ...SPACECRAFT.map(({ id }) => id),
  ...Object.values(OrbitalRegimeId),
].map(itemIdAsRoute);
