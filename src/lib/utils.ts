import { AU } from './data/bodies.ts';
import { Time } from './epoch.ts';
import { CelestialBody, CelestialBodyType } from './types.ts';

export function pluralize(n: number, unit: string) {
  const nAbs = Math.abs(n);
  return nAbs > 1 || nAbs < 1 ? `${n.toLocaleString()} ${unit}s` : `${n.toLocaleString()} ${unit}`;
}

export function humanTimeUnits(t: number, includeWeekAndMonth = false): [number, string] {
  const tAbs = Math.abs(t);
  if (tAbs < Time.MINUTE) {
    return [t, 'second'];
  } else if (tAbs < Time.HOUR) {
    return [t / Time.MINUTE, 'minute'];
  } else if (tAbs < Time.DAY) {
    return [t / Time.HOUR, 'hour'];
  } else if (tAbs < (includeWeekAndMonth ? Time.WEEK : Time.YEAR)) {
    return [t / Time.DAY, 'day'];
  } else if (includeWeekAndMonth && tAbs < Time.MONTH) {
    return [t / Time.WEEK, 'week'];
  } else if (includeWeekAndMonth && tAbs < Time.YEAR) {
    return [t / Time.MONTH, 'month'];
  } else {
    return [t / Time.YEAR, 'year'];
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

export function celestialBodyTypeName(type: CelestialBodyType, plural = false): string {
  const baseName = {
    [CelestialBodyType.STAR]: 'Star',
    [CelestialBodyType.PLANET]: 'Planet',
    [CelestialBodyType.MOON]: 'Moon',
    [CelestialBodyType.DWARF_PLANET]: 'Dwarf Planet',
    [CelestialBodyType.ASTEROID]: 'Asteroid',
    [CelestialBodyType.COMET]: 'Comet',
    [CelestialBodyType.TRANS_NEPTUNIAN_OBJECT]: 'Trans-Neptunian Object',
    [CelestialBodyType.SPACECRAFT]: 'Spacecraft',
  }[type];
  if (!plural) return baseName;
  return type !== CelestialBodyType.SPACECRAFT ? `${baseName}s` : baseName;
}

export function celestialBodyTypeDescription(body: CelestialBody): string {
  const baseName = celestialBodyTypeName(body.type);
  // TODO: this is a hack; shouldn't assume IDs are human-readable. Works for now
  const parentName = body.elements.wrt?.split('/', 2)[1] ?? '';
  const parentCapitalized = `${String(parentName).charAt(0).toUpperCase()}${String(parentName).slice(1)}`;
  return body.type !== CelestialBodyType.MOON ? baseName : `${baseName} of ${parentCapitalized}`;
}

export function notNullish<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export function nameToId(name: string, shortName?: string) {
  return (shortName ?? name).replace(/\s+/g, '-').replace(/'/g, '-').toLowerCase();
}
