import { SOLAR_SYSTEM } from './data/bodies.ts';
import { SPACECRAFT_ORGANIZATIONS } from './data/organizations.ts';
import { SPACECRAFT } from './data/spacecraft/spacecraft.ts';
import { itemIdAsRoute } from './state.ts';
import { OrbitalRegimeId } from './types.ts';

export const ROUTES = [
  null, // root
  ...SOLAR_SYSTEM.map(({ id }) => id),
  ...SPACECRAFT.map(({ id }) => id),
  ...Object.values(SPACECRAFT_ORGANIZATIONS).map(({ id }) => id),
  ...Object.values(OrbitalRegimeId),
].map(itemIdAsRoute);
