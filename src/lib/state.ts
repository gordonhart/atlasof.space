import { SOLAR_SYSTEM, Time } from './bodies.ts';
import { CelestialBody, CelestialBodyType, Epoch, Point3 } from './types.ts';
import { nowEpoch } from './epoch.ts';

export type AppState = {
  epoch: Epoch;
  time: number; // seconds
  dt: number; // seconds
  play: boolean;
  drawTail: boolean;
  drawOrbit: boolean;
  drawLabel: boolean;
  center: string | null; // name of body centering visualization
  hover: string | null; // name of hovered body
  visibleTypes: Set<CelestialBodyType>;
  bodies: Array<CelestialBody>;

  // TODO: should these really live here?
  // these values are readonly; driven by the model
  metersPerPx: number; // describes zoom
  vernalEquinox: Point3; // direction of the Vernal Equinox
};

export const initialState: AppState = {
  epoch: nowEpoch(),
  time: 0,
  dt: 30 * Time.MINUTE,
  play: true,
  drawTail: false,
  drawOrbit: true,
  drawLabel: true,
  center: null,
  hover: null,
  visibleTypes: new Set([
    CelestialBodyType.STAR,
    CelestialBodyType.PLANET,
    CelestialBodyType.MOON,
    CelestialBodyType.DWARF_PLANET,
    CelestialBodyType.ASTEROID,
    CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
    // absent: comet, spacecraft
    CelestialBodyType.SPACECRAFT, // TODO: remove
  ]),
  bodies: SOLAR_SYSTEM,

  // set by model on update
  metersPerPx: 1,
  vernalEquinox: [1, 0, 0],
};

export function clampState({ dt, ...state }: AppState): AppState {
  return {
    ...state,
    dt: Math.min(Math.max(dt, Time.SECOND), 365 * Time.DAY),
  };
}
