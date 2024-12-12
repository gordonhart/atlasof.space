import {G, Point, DT} from "./constants.ts";

function calculateDistance(a: Point, b: Point): number {
  return (((a.x - b.x) ** 2) + ((a.y - b.y) ** 2)) ** 0.5;
}

function calculatePosition(p0: number, v: number, a: number, t: number) {
  return p0 + (v * t) + (0.5 * a * (t ** 2));
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

// TODO: this assumes that the reference will not move, probably not entirely correct
export function incrementBody(target: Body, reference: Body, timeStep: number = DT) {
  const masses = reference.mass * target.mass;
  const distance = calculateDistance(reference.curr, target.curr);
  const force = G * Number(masses) / (distance ** 2);
  const accelMagnitude = force / Number(target.mass);
  const accel = { // multiply by unit vector
    x: accelMagnitude * (reference.curr.x - target.curr.x) / distance,
    y: accelMagnitude * (reference.curr.y - target.curr.y) / distance,
  }
  const velocity = {
    x: (target.curr.x - target.prev.x) / timeStep,
    y: (target.curr.y - target.prev.y) / timeStep,
  }
  target.prev = {...target.curr};
  target.curr = {
    x: calculatePosition(target.curr.x, velocity.x, accel.x, timeStep),
    y: calculatePosition(target.curr.y, velocity.y, accel.y, timeStep),
  }
}
