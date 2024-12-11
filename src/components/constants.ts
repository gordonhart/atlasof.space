export type Point = {
  x: number;
  y: number;
}
export type KeplerianElements = {
  eccentricity: number; // ratio
  semiMajorAxis: number; // meters
  inclination: number; // degrees
  longitudeAscending: number; // degrees
  argumentOfPeriapsis: number; // degrees
  trueAnomaly: number; // degrees
}
export type Body = {
  curr: Point;
  prev: Point;
  // TODO: remove bigint? are these really necessary?
  mass: bigint; // kg
  radius: bigint; // m
  color: string;
}
export const SOL: Body = {
  curr: {x: 0, y: 0},
  prev: {x: 0, y: 0},
  mass: BigInt("1988500000000000000000000000000"), // 1.9885e30 kg
  radius: BigInt("695700000"), // 6.957e8 m
  color: '#ffa500',
};
export const MERCURY: Body = {
  curr: {x: 69820000000, y: 0}, // 69.82 million km aphelion
  prev: {x: 69820000000, y: 2000000000 / 24 * 12}, // TODO: this is set arbitrarily
  mass: BigInt("330110000000000000000000"), // 3.3011e23 kg
  radius: BigInt("2439700"), // 2439.7 km
  color: '#808080',
}
export const VENUS: Body = {
  curr: {x: 108940000000, y: 0}, // 108.94 million km aphelion
  prev: {x: 108940000000, y: 2000000000 / 24 * 12},
  mass: BigInt("34867500000000000000000000"), // 4.8675e24 kg
  radius: BigInt("6051800"), // 6051.8 km
  color: '#ffee8c',
}
export const EARTH: Body = {
  curr: {x: 152097597000, y: 0}, // 152,097,597 km aphelion
  prev: {x: 152097597000, y: 1800000000 / 24 * 12},
  mass: BigInt("5972168000000000000000000"), // 5.972168e24 kg
  radius: BigInt("6371000"), // 6371.0 km
  color: '#7df9ff',
}
export const MOON: Body = {
  curr: {x: EARTH.curr.x + 405_400_000, y: 0}, // 405400 km apogee
  prev: {x: EARTH.prev.x + 405_400_000, y: 1200000000 / 24 * 12},
  mass: BigInt("73460000000000000000000"), // 7.346e22 kg
  radius: BigInt("1737400"), // 1737.4 km
  color: '#aaaaaa',
}
export const MARS: Body = {
  curr: {x: 249261000000, y: 0}, // 249,261,000 km aphelion
  prev: {x: 249261000000, y: 1400000000 / 24 * 12},
  mass: BigInt("641710000000000000000000"), // 6.4171e23
  radius: BigInt("3389500"), // 3389.5 km
  color: '#ff5733',
}
export const PLANETS = [MERCURY, VENUS, EARTH, /* MOON, */ MARS];
export const BODIES = [SOL, ...PLANETS];
export const COLORS: {[name: string]: string} = {
  sol: '#ffa500',
  mercury: '#808080',
  venus: '#ffee8c',
  earth: '#7df9ff',
  mars: '#ff5733',
  // TODO: add additional bodies
}
export const RADII: {[name: string]: number} = {
  sol: 695700000, // 6.957e8 m
  mercury: 2439700, // 2439.7 km
  venus: 6051800, // 6051.8 km
  earth: 6371000, // 6371.0 km
  mars: 3389500, // 3389.5 km
  // TODO: add additional bodies
}

export const MIN_DIMENSION = (PLANETS[PLANETS.length - 1].curr.x + 10_000_000_000) * 2;
export const GRAVITATIONAL_CONSTANT = 6.6743e-11; // N⋅m2⋅kg−2
// export const TIME_STEP_S = 60 * 60 * 12; // 12 hours // * 24; // 1 day
export const TIME_STEP_S = 60 * 60 * 24 * 1; // 1 day
export const BODY_SCALE_FACTOR = 5;