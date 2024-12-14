import { SOL } from './constants.ts';
import { Point2 } from './types.ts';

export type AppState = {
  time: number; // seconds
  dt: number; // seconds
  play: boolean;
  drawTail: boolean;
  metersPerPx: number; // controls zoom
  center: string; // name of body centering visualization
  hover: string | null; // name of hovered body
  offset: Point2; // meters
  planetScaleFactor: number;
};

export const initialState: AppState = {
  time: 0,
  dt: 60,
  play: true,
  drawTail: false,
  metersPerPx: SOL.satellites[5].semiMajorAxis / Math.max(window.innerWidth, window.innerHeight),
  center: 'Mars',
  hover: null,
  offset: [0, 0],
  planetScaleFactor: 1,
};
