import { DT, ELEMENTS } from './constants.ts';

export type AppState = {
  time: number; // seconds
  dt: number; // seconds -- NOTE: be careful with large dt as physics simulation breaks down
  zoom: number;
  play: boolean;
  drawTail: boolean;
  metersPerPx: number;
};

export const initialState: AppState = {
  time: 0,
  dt: DT,
  zoom: 1,
  play: true,
  drawTail: false,
  metersPerPx: ELEMENTS.saturn.semiMajorAxis / Math.max(window.innerWidth, window.innerHeight),
};
