import { Point3 } from '../types.ts';

export const SCALE_FACTOR = 1e9; // shrink the scene down to work better with Three.js
export const HOVER_SCALE_FACTOR = 5; // size to enlarge bodies on hover

export const SUNLIGHT_COLOR = 0xfffff0; // slightly yellow white

export const CAMERA_INIT = {
  up: [0, 0, 1] as Point3, // z-up
  position: [0, 0, 1e6] as Point3, // very high up
  lookAt: [0, 0, 0] as Point3,
};
