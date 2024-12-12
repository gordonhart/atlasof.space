import {DT, Point} from "./constants.ts";
import {jupiterElements} from "./keplerian.ts";

export type AppState = {
  time: number; // seconds
  dt: number; // seconds -- NOTE: be careful with large dt as physics simulation breaks down
  zoom: number;
  center: Point;
  play: boolean;
  drawTail: boolean;
  metersPerPx: number;
}

export const initialState: AppState = {
  time: 0,
  dt: DT,
  zoom: 1,
  center: { x: 0, y: 0 },
  play: true,
  drawTail: false,
  metersPerPx: jupiterElements.semiMajorAxis / Math.max(window.innerWidth, window.innerHeight),
}
