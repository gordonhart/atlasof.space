import { OrbitalRegimeId, OrbitalRegime } from '../types.ts';
import { AU, EARTH, JUPITER, SOL } from './bodies.ts';

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
  max: 1_500_000e3, // rough edge of Earth's Hill sphere
  roundness: 0.25,
};

export const JUPITER_SYSTEM: OrbitalRegime = {
  id: OrbitalRegimeId.JUPITER_SYSTEM,
  wrt: JUPITER.id,
  min: JUPITER.radius + 100_000e3,
  max: 53_000_000e3, // rough edge of Jupiter's Hill sphere
  roundness: 0.25,
};

export const ORBITAL_REGIMES: Array<OrbitalRegime> = [
  INNER_SYSTEM,
  ASTEROID_BELT,
  OUTER_SYSTEM,
  KUIPER_BELT,
  INNER_OORT_CLOUD,
  EARTH_SYSTEM,
  JUPITER_SYSTEM,
];

export const ORBITAL_REGIMES_BY_ID = Object.fromEntries(ORBITAL_REGIMES.map(r => [r.id, r]));

export function orbitalRegimeDisplayName(regime: OrbitalRegimeId) {
  return {
    [OrbitalRegimeId.INNER_SYSTEM]: 'Inner System',
    [OrbitalRegimeId.ASTEROID_BELT]: 'Asteroid Belt',
    [OrbitalRegimeId.OUTER_SYSTEM]: 'Outer System',
    [OrbitalRegimeId.KUIPER_BELT]: 'Kuiper Belt',
    [OrbitalRegimeId.INNER_OORT_CLOUD]: 'Inner Oort Cloud',
    [OrbitalRegimeId.EARTH_SYSTEM]: 'Earth System',
    [OrbitalRegimeId.JUPITER_SYSTEM]: 'Jupiter System',
  }[regime];
}
