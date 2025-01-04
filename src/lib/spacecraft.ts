import { DEFAULT_SPACECRAFT_COLOR, EARTH } from './bodies.ts';
import { Spacecraft } from './types.ts';

export const OP_DRIVE_SPACECRAFT: Spacecraft = {
  name: 'OP Drive',
  mass: 100e3,
  thrust: 1000,
  launchLocation: EARTH.name,
  launchVelocity: 12e3,
  launchDirection: [1, 0, 0],
  launchTime: null,
  color: DEFAULT_SPACECRAFT_COLOR,
  controls: {
    launch: false,
    fire: false,
  },
};
