import { SOL, Time } from './bodies.ts';
import { CelestialBodyType, CelestialBodyTypes, Point3 } from './types.ts';

export type AppState = {
  time: number; // seconds
  dt: number; // seconds
  play: boolean;
  drawTail: boolean;
  drawOrbit: boolean;
  drawLabel: boolean;
  center: string; // name of body centering visualization
  hover: string | null; // name of hovered body
  planetScaleFactor: number;
  visibleTypes: Set<CelestialBodyType>;

  // TODO: should these really live here?
  // these values are readonly; driven by the renderer
  metersPerPx: number; // describes zoom
  vernalEquinox: Point3; // direction of the Vernal Equinox
};

export const initialState: AppState = {
  time: 0,
  dt: 0.00001, // 15 * Time.MINUTE,
  play: false,
  drawTail: false,
  drawOrbit: true,
  drawLabel: true,
  center: SOL.name,
  hover: null,
  planetScaleFactor: 1,
  visibleTypes: new Set(CelestialBodyTypes),

  // set by renderer
  metersPerPx: 1,
  vernalEquinox: [1, 0, 0],
};

export function clampState({ dt, planetScaleFactor, ...state }: AppState): AppState {
  return {
    ...state,
    dt: Math.min(Math.max(dt, Time.SECOND), 365 * Time.DAY),
    planetScaleFactor: Math.min(Math.max(planetScaleFactor, 1), 8192),
  };
}
