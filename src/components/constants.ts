export type Point = {
    x: number;
    y: number;
}
export type Body = {
    curr: Point;
    prev: Point;
    // TODO: remove bigint? are these really necessary?
    mass: bigint; // kg
    radius: bigint; // m
    // TODO: more sophisticated orbital parameters
    orbitalRadius: bigint; // m
    color: string;
}
export const SOL: Body = {
    curr: {x: 0, y: 0},
    prev: {x: 0, y: 0},
    mass: BigInt("1988500000000000000000000000000"), // 1.9885e30 kg
    radius: BigInt("695700000"), // 6.957e8 m
    orbitalRadius: BigInt("0"),
    color: '#ffa500',
};
export const MERCURY: Body = {
    curr: {x: 69820000000, y: 0},
    prev: {x: 69820000000, y: 2000000000 / 24 * 12}, // TODO: this is set arbitrarily
    mass: BigInt("330110000000000000000000"), // 3.3011e23 kg
    radius: BigInt("2439700"), // 2439.7 km
    orbitalRadius: BigInt("69820000000"), // 69.82 million km aphelion
    color: '#808080',
}
export const VENUS: Body = {
    curr: {x: 108940000000, y: 0},
    prev: {x: 108940000000, y: 2000000000 / 24 * 12},
    mass: BigInt("34867500000000000000000000"), // 4.8675e24 kg
    radius: BigInt("6051800"), // 6051.8 km
    orbitalRadius: BigInt("108940000000"), // 108.94 million km aphelion
    color: '#ffee8c',
}
export const EARTH: Body = {
    curr: {x: 152097597000, y: 0},
    prev: {x: 152097597000, y: 1800000000 / 24 * 12},
    mass: BigInt("5972168000000000000000000"), // 5.972168e24 kg
    radius: BigInt("6371000"), // 6371.0 km
    orbitalRadius: BigInt("152097597000"), // 152,097,597 km aphelion
    color: '#7df9ff',
}
export const MARS: Body = {
    curr: {x: 249261000000, y: 0},
    prev: {x: 249261000000, y: 1400000000 / 24 * 12},
    mass: BigInt("641710000000000000000000"), // 6.4171e23
    radius: BigInt("3389500"), // 3389.5 km
    orbitalRadius: BigInt("249261000000"), // 249,261,000 km aphelion
    color: '#ff5733',
}
export const PLANETS = [MERCURY, VENUS, EARTH, MARS];
export const BODIES = [SOL, ...PLANETS];

export const MIN_DIMENSION = (PLANETS[PLANETS.length - 1].orbitalRadius + BigInt("10000000000")) * BigInt("2");
export const GRAVITATIONAL_CONSTANT = 6.6743e-11; // N⋅m2⋅kg−2
export const TIME_STEP_S = 60 * 60 * 12; // 12 hours // * 24; // 1 day
export const BODY_SCALE_FACTOR = 10;