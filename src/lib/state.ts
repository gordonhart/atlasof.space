import { SATURN } from './constants.ts';
import { CelestialBodyType, CelestialBodyTypes, Point2 } from './types.ts';

export type AppState = {
  time: number; // seconds
  dt: number; // seconds
  play: boolean;
  drawTail: boolean;
  drawOrbit: boolean;
  drawLabel: boolean;
  metersPerPx: number; // controls zoom
  center: string; // name of body centering visualization
  hover: string | null; // name of hovered body
  offset: Point2; // meters
  planetScaleFactor: number;
  visibleTypes: Set<CelestialBodyType>;
};

export const initialState: AppState = {
  time: 0,
  dt: 60 * 15,
  play: true,
  drawTail: false,
  drawOrbit: true,
  drawLabel: true,
  metersPerPx: (2 * SATURN.elements.semiMajorAxis) / Math.max(window.innerWidth, window.innerHeight),
  center: 'Sol',
  hover: null,
  offset: [0, 0],
  planetScaleFactor: 1,
  visibleTypes: new Set(CelestialBodyTypes),
};

export function clampState({ dt, metersPerPx, planetScaleFactor, ...rest }: AppState): AppState {
  return {
    ...rest,
    dt: Math.min(Math.max(dt, 1), 365 * 24 * 60 * 60),
    metersPerPx: Math.min(Math.max(metersPerPx, 10_000), 1e11),
    planetScaleFactor: Math.min(Math.max(planetScaleFactor, 1), 8192),
  };
}
