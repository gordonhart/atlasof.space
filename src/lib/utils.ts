import { AU } from './bodies.ts';
import { Time } from './epoch.ts';
import { CelestialBody, CelestialBodyStyle, CelestialBodyType, HexColor } from './types.ts';

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
  const parentCapitalized = `${String(body.elements.wrt).charAt(0).toUpperCase()}${String(body.elements.wrt).slice(1)}`;
  return body.type !== CelestialBodyType.MOON ? baseName : `${baseName} of ${parentCapitalized}`;
}

export function notNullish<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export function celestialBodyNameToId(name: string, shortName?: string) {
  return (shortName ?? name).replace(/\s+/g, '-').toLowerCase();
}

const DEFAULT_ASTEROID_COLOR = '#8b8b8b'; // dark gray, typical for S-type asteroids
const DEFAULT_CELESTIAL_BODY_FG_COLOR: { [T in CelestialBodyType]?: HexColor } = {
  [CelestialBodyType.MOON]: '#aaaaaa',
  [CelestialBodyType.ASTEROID]: DEFAULT_ASTEROID_COLOR,
  [CelestialBodyType.COMET]: '#51807c',
  [CelestialBodyType.DWARF_PLANET]: '#998a98',
  [CelestialBodyType.SPACECRAFT]: '#50C878',
};
const DEFAULT_CELESTIAL_BODY_BG_COLOR: { [T in CelestialBodyType]?: HexColor } = {
  [CelestialBodyType.MOON]: '#888888',
  [CelestialBodyType.ASTEROID]: '#4b4b4b',
  [CelestialBodyType.DWARF_PLANET]: '#6e636d',
};
export function celestialBodyWithDefaults(
  body: Omit<CelestialBody, 'id' | 'style'> & { id?: string; style?: CelestialBodyStyle }
): CelestialBody {
  return {
    ...body,
    id: body.id ?? celestialBodyNameToId(body.name, body.shortName),
    style: {
      fgColor: body.style?.fgColor ?? DEFAULT_CELESTIAL_BODY_FG_COLOR[body.type] ?? DEFAULT_ASTEROID_COLOR,
      bgColor: body.style?.bgColor ?? body.style?.fgColor ?? DEFAULT_CELESTIAL_BODY_BG_COLOR[body.type],
    },
  };
}
