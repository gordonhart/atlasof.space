import { Epoch } from './types.ts';

export enum Time {
  SECOND = 1,
  MINUTE = 60 * SECOND,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR,
}

export const J2000: Epoch = {
  name: 'J2000',
  year: 2000,
  month: 0, // month index
  day: 1,
  hour: 12,
  minute: 0,
  second: 0,
};
// const JD_J2000 = 2451545.0; // Julian days since January 1, 4713 BCE, at noon (UTC)
const JD_UNIX_EPOCH = 2440588; // 1970-01-01, the Unix epoch

export function julianDayToEpoch(name: `JD${string}`): Epoch {
  const jd = Number(name.slice(2, name.length));
  const date = new Date((jd - JD_UNIX_EPOCH) * Time.DAY * 1000); // convert into calendar days
  return dateToEpoch(name, date);
}

export function dateToEpoch(name: string, date: Date): Epoch {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  return { name, year, month, day, hour, minute, second };
}

export function epochToDate({ year, month, day, hour, minute, second }: Epoch): Date {
  return new Date(Date.UTC(year, month, day, hour, minute, second));
}

export function nowEpoch(): Epoch {
  const now = new Date();
  return dateToEpoch(getJulianDate(now), now);
}

function getJulianDate(date: Date): `JD${string}` {
  const { year, month: monthIndex, day, hour, minute, second } = dateToEpoch('', date);
  const month = monthIndex + 1; // JavaScript months are 0-based
  const millisecond = date.getUTCMilliseconds();

  const decimalDay = day + hour / 24.0 + minute / 1440.0 + second / 86400.0 + millisecond / 86400000.0;
  // Handle January and February special case
  const [y, m] = month <= 2 ? [year - 1, month + 12] : [year, month];

  // Calculate A and B terms for Gregorian calendar
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + decimalDay + B - 1524.5;
  return `JD${jd}`;
}

export function dateToHumanReadable(date: Date): string {
  return date.toISOString().split('T')[0];
}
