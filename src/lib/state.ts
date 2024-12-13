import { DT, ELEMENTS } from './constants.ts';
import { CelestialObject, Point2 } from './types.ts';

export type AppState = {
  time: number; // seconds
  dt: number; // seconds
  play: boolean;
  drawTail: boolean;
  metersPerPx: number;
  center: CelestialObject;
  offset: Point2; // meters
  planetScaleFactor: number;
};

export const initialState: AppState = {
  time: 0,
  dt: DT,
  play: true,
  drawTail: false,
  metersPerPx: ELEMENTS.saturn.semiMajorAxis / Math.max(window.innerWidth, window.innerHeight),
  center: 'sol',
  offset: [0, 0],
  planetScaleFactor: 5,
};
