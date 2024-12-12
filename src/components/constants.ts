export type Point = {
  x: number;
  y: number;
}
export type CelestialObject =
  | 'sol'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'earth'
  | 'ceres'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export const COLORS: Record<CelestialObject, string> = {
  sol: '#fa0',
  mercury: '#888',
  venus: '#fe8',
  earth: '#3fb',
  mars: '#f53',
  ceres: '#bbb',
  jupiter: '#fa2',
  saturn: '#faa',
  uranus: '#fec',
  neptune: '#2bc',
  pluto: '#ddd',
}
export const RADII: Record<CelestialObject, number> = { // m
  sol: 6.957e8,
  mercury: 2439.7e3,
  venus: 6051.8e3,
  earth: 6371e3,
  mars: 3389.5e3,
  ceres: 966.2e3,
  jupiter: 69911e3,
  saturn: 58232e3,
  uranus: 25362e3,
  neptune: 24622e3,
  pluto: 1188.3e3,
}
export const MASSES: Record<CelestialObject, number> = { // kg
  sol: 1.9885e30,
  mercury: 3.3011e23,
  venus: 4.8675e24,
  earth: 5.972168e24,
  mars: 6.4171e23,
  ceres: 9.3839e20,
  jupiter: 1.8982e27,
  saturn: 5.6834e26,
  uranus: 8.6810e25,
  neptune: 1.02409e26,
  pluto: 1.3025e22,
}

// gravitational constant
export const G = 6.6743e-11; // N⋅m2⋅kg−2

// time step
export const DT = 60 * 60 * 6; // 6 hours

export const BODY_SCALE_FACTOR = 5;