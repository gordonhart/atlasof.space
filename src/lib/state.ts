import { DT, SOL } from './constants.ts';
import { CelestialBodyName, Point2 } from './types.ts';

export type AppState = {
  time: number; // seconds
  dt: number; // seconds
  play: boolean;
  drawTail: boolean;
  metersPerPx: number; // controls zoom
  center: CelestialBodyName;
  offset: Point2; // meters
  planetScaleFactor: number;
};

export const initialState: AppState = {
  time: 0,
  dt: DT / 16,
  play: true,
  drawTail: false,
  metersPerPx: SOL.satellites[0].semiMajorAxis / Math.max(window.innerWidth, window.innerHeight) / 10,
  center: 'jupiter',
  offset: [0, 0],
  planetScaleFactor: 1,
};
