import {DT, Point} from "./constants.ts";

export type AppState = {
  time: number;
  dt: number;
  zoom: number;
  center: Point;
  play: boolean;
}

export const initialState: AppState = {
  time: 0,
  dt: DT,
  zoom: 1,
  center: { x: 0, y: 0 },
  play: true,
}
