import {AU} from "./constants.ts";

export function pluralize(n: number, unit: string) {
  return n > 1 ? `${n.toLocaleString()} ${unit}s` : `${n.toLocaleString()} ${unit}`;
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
    return [d, 'meter'];
  } else if (d < 0.01 * AU) {
    return [d / 1_000, 'kilometer'];
  } else {
    return [d / AU, 'AU']
  }
}

export function filterKeys<T extends Record<string, unknown>>(obj: T, condition: (key: keyof T) => boolean ) {
  const result: Partial<T> = {}
  for (const key in obj) {
    if (condition(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function mapValues<T extends Record<string, unknown>, U>(
  obj: T,
  mapper: (value: T[keyof T], key: string) => U,
): { [K in keyof T]: U } {
  const result: Partial<{ [K in keyof T]: U }> = {};
  for (const key in obj) {
    result[key] = mapper(obj[key], key);
  }
  return result as { [K in keyof T]: U };
}