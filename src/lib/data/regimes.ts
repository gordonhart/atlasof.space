import { OrbitalRegime, OrbitalRegimeId } from '../types.ts';
import { AU } from './bodies.ts';

export const INNER_SYSTEM: OrbitalRegime = {
  id: OrbitalRegimeId.INNER_SYSTEM,
  name: 'Inner System',
  min: 0.2 * AU,
  max: 2.2 * AU,
  roundness: 0.1,
};

export const ASTEROID_BELT: OrbitalRegime = {
  id: OrbitalRegimeId.ASTEROID_BELT,
  name: 'Asteroid Belt',
  min: 2.0 * AU,
  max: 3.2 * AU,
  roundness: 2,
};

export const OUTER_SYSTEM: OrbitalRegime = {
  id: OrbitalRegimeId.OUTER_SYSTEM,
  name: 'Outer System',
  min: 3.2 * AU,
  max: 32 * AU,
  roundness: 0.1,
};

export const KUIPER_BELT: OrbitalRegime = {
  id: OrbitalRegimeId.KUIPER_BELT,
  name: 'Kuiper Belt',
  min: 30 * AU,
  max: 55 * AU,
  roundness: 0.1,
};

export const INNER_OORT_CLOUD: OrbitalRegime = {
  id: OrbitalRegimeId.INNER_OORT_CLOUD,
  name: 'Inner Oort Cloud',
  min: 55 * AU,
  max: 20000 * AU,
  roundness: 0.001, // so huge that rendering as a flat disk is better
};

// TODO: Uranus, Neptune, Pluto

const ORBITAL_REGIMES_ARRAY = [INNER_SYSTEM, ASTEROID_BELT, OUTER_SYSTEM, KUIPER_BELT, INNER_OORT_CLOUD];
export const ORBITAL_REGIMES = Object.fromEntries(ORBITAL_REGIMES_ARRAY.map(r => [r.id, r]));
