import { DT, ELEMENTS } from './constants.ts';
import { CelestialObject } from './types.ts';

export type AppState = {
  time: number; // seconds
  dt: number; // seconds
  zoom: number;
  play: boolean;
  drawTail: boolean;
  metersPerPx: number;
  center: CelestialObject;
  planetScaleFactor: number;
};

export const initialState: AppState = {
  time: 0,
  dt: DT,
  zoom: 1,
  play: true,
  drawTail: false,
  metersPerPx: ELEMENTS.saturn.semiMajorAxis / Math.max(window.innerWidth, window.innerHeight),
  center: 'sol',
  planetScaleFactor: 5,
};
