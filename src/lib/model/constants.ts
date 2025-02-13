import { degreesToRadians } from '../physics.ts';
import { CelestialBodyType, Point3 } from '../types.ts';

// units: meters per 3D scene-space unit (not to be confused with pixels)
export const SCALE_FACTOR = 1e9; // shrink the scene down to work better with Three.js
export const HOVER_SCALE_FACTOR = 5; // size to enlarge bodies on hover

export const SUNLIGHT_COLOR = 0xfffff0; // slightly yellow white

const CAMERA_ANGLE = degreesToRadians(55);
export const CAMERA_INIT = {
  up: [0, 0, 1] as Point3, // z-up
  position: [0, -1e6 * Math.cos(CAMERA_ANGLE), 1e6 * Math.sin(CAMERA_ANGLE)] as Point3, // very high up
  lookAt: [0, 0, 0] as Point3,
};

export const MIN_ORBIT_PX_LABEL_VISIBLE: Record<CelestialBodyType, number> = {
  [CelestialBodyType.STAR]: -1, // always visible
  [CelestialBodyType.PLANET]: 20, // visible unless very small
  [CelestialBodyType.MOON]: 25,
  [CelestialBodyType.SPACECRAFT]: 50,
  [CelestialBodyType.DWARF_PLANET]: 75,
  [CelestialBodyType.ASTEROID]: 150,
  [CelestialBodyType.COMET]: 100,
  [CelestialBodyType.TRANS_NEPTUNIAN_OBJECT]: 100,
};
