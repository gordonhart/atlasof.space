import { OrbitalRegime, HeliocentricOrbitalRegime } from './types.ts';
import { AU } from './bodies.ts';

export const INNER_SYSTEM: OrbitalRegime = {
  name: HeliocentricOrbitalRegime.INNER_SYSTEM,
  min: 0.2 * AU,
  max: 2.2 * AU,
  roundness: 0.1,
};

export const ASTEROID_BELT: OrbitalRegime = {
  name: HeliocentricOrbitalRegime.ASTEROID_BELT,
  min: 2.0 * AU,
  max: 3.2 * AU,
  roundness: 2,
};

export const OUTER_SYSTEM: OrbitalRegime = {
  name: HeliocentricOrbitalRegime.OUTER_SYSTEM,
  min: 3.2 * AU,
  max: 32 * AU,
  roundness: 0.1,
};

export const KUIPER_BELT: OrbitalRegime = {
  name: HeliocentricOrbitalRegime.KUIPER_BELT,
  min: 30 * AU,
  max: 55 * AU,
  roundness: 0.1,
};

export const INNER_OORT_CLOUD: OrbitalRegime = {
  name: HeliocentricOrbitalRegime.INNER_OORT_CLOUD,
  min: 55 * AU,
  max: 20000 * AU,
  roundness: 0.001, // so huge that rendering as a flat disk is better
};

export const ORBITAL_REGIMES: Array<OrbitalRegime> = [
  INNER_SYSTEM,
  ASTEROID_BELT,
  OUTER_SYSTEM,
  KUIPER_BELT,
  INNER_OORT_CLOUD,
];
