export function pluralize(n: number, unit: string) {
  return n > 1 ? `${n.toLocaleString()} ${unit}s` : `${n.toLocaleString()} ${unit}`;
}