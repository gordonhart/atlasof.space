import { AU } from './bodies.ts';
import { CelestialBodyType } from './types.ts';

export function pluralize(n: number, unit: string) {
  return n > 1 || n === 0 ? `${n.toLocaleString()} ${unit}s` : `${n.toLocaleString()} ${unit}`;
}

export function humanTimeUnits(t: number): [number, string] {
  if (t < 60) {
    return [t, 'second'];
  } else if (t < 60 * 60) {
    return [t / 60, 'minute'];
  } else if (t < 60 * 60 * 24) {
    return [t / 60 / 60, 'hour'];
  } else if (t < 60 * 60 * 24 * 365) {
    return [t / 60 / 60 / 24, 'day'];
  } else {
    return [t / 60 / 60 / 24 / 365, 'year'];
  }
}

export function humanDistanceUnits(d: number): [number, string] {
  if (d < 1_000) {
    return [d, 'm'];
  } else if (d < 0.01 * AU) {
    return [d / 1_000, 'km'];
  } else {
    return [d / AU, 'AU'];
  }
}

export function celestialBodyTypeName(type: CelestialBodyType): string {
  return {
    [CelestialBodyType.STAR]: 'Star',
    [CelestialBodyType.PLANET]: 'Planet',
    [CelestialBodyType.MOON]: 'Moon',
    [CelestialBodyType.DWARF_PLANET]: 'Dwarf Planet',
    [CelestialBodyType.ASTEROID]: 'Asteroid',
    [CelestialBodyType.COMET]: 'Comet',
    [CelestialBodyType.TRANS_NEPTUNIAN_OBJECT]: 'Trans-Neptunian Object',
    [CelestialBodyType.SPACECRAFT]: 'Spacecraft',
  }[type];
}

export function notNullish<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
