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

export function celestialBodyTypeName(type: CelestialBodyType) {
  switch (type) {
    case 'sun':
      return 'Sun';
    case 'planet':
      return 'Planet';
    case 'moon':
      return 'Moon';
    case 'dwarf-planet':
      return 'Dwarf Planet';
    case 'asteroid':
      return 'Asteroid';
    case 'comet':
      return 'Comet';
    case 'trans-neptunian-object':
      return 'Trans-Neptunian Object';
    case 'belt':
      return 'Belt';
  }
}

// TODO: this could be more performant, maybe constructing an index of the state tree once then just looking up
export function findCelestialBody<T extends { name: string; satellites: Array<T> }>(
  body: T,
  name: string
): T | undefined {
  if (name === body.name) {
    return body;
  }
  for (const child of body.satellites) {
    const found = findCelestialBody(child, name);
    if (found != null) {
      return found;
    }
  }
}

export function notNullish<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
