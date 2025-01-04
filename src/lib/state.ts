import { SOLAR_SYSTEM, Time } from './bodies.ts';
import { nowEpoch } from './epoch.ts';
import { CelestialBody, CelestialBodyType, Epoch, HeliocentricOrbitalRegime, Point3 } from './types.ts';

export type Settings = {
  epoch: Epoch;
  dt: number; // seconds
  play: boolean;
  drawTail: boolean;
  drawOrbit: boolean;
  drawLabel: boolean;
  center: string | null; // name of body or orbital regime centering visualization (focused)
  hover: string | null; // name of hovered body/regime
  visibleTypes: Set<CelestialBodyType>;
  visibleRegimes: Set<HeliocentricOrbitalRegime>;
  bodies: Array<CelestialBody>;
};

// these values are readonly; driven by the model
export type ModelState = {
  time: number; // seconds
  metersPerPx: number; // describes zoom
  vernalEquinox: Point3; // direction of the Vernal Equinox
};

export type AppState = {
  settings: Settings;
  model: ModelState;
};

export const initialState: AppState = {
  settings: {
    epoch: nowEpoch(),
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
    ]),
    visibleRegimes: new Set([]),
    bodies: SOLAR_SYSTEM,
  },

  // set by model on update
  model: {
    time: 0,
    metersPerPx: 1,
    vernalEquinox: [1, 0, 0],
  },
};

export function clampSettings({ dt, ...settings }: Settings): Settings {
  return {
    ...settings,
    dt: Math.min(Math.max(dt, Time.SECOND), 365 * Time.DAY),
  };
}

export type UpdateSettings = (update: Partial<Settings> | ((prev: Settings) => Settings)) => void;
