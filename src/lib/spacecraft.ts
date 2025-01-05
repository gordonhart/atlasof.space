import { DEFAULT_SPACECRAFT_COLOR, EARTH } from './bodies.ts';
import { Spacecraft } from './types.ts';

export const OP_DRIVE_SPACECRAFT: Spacecraft = {
  name: 'OP Drive',
  mass: 100e3,
  thrust: 1e4, // 10 kN
  launchLocation: EARTH.name,
  launchAltitude: EARTH.radius + 500e3, // 500 km orbit (LEO)
  launchVelocity: 11.2e3, // escape velocity; taking off with this velocity from launchAltitude in launchDirection
  launchDirection: [1, 0, 0],
  launchTime: null,
  color: DEFAULT_SPACECRAFT_COLOR,
  controls: {
    launch: false,
    fire: false,
    rotate: null,
  },
};
