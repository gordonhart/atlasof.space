import { equals } from 'ramda';
import { create } from 'zustand/react';
import { SOLAR_SYSTEM } from './data/bodies.ts';
import { nowEpoch, Time } from './epoch.ts';
import { getInitialCenter } from './routes.ts';
import {
  CelestialBody,
  CelestialBodyId,
  CelestialBodyType,
  Epoch,
  HillSphereId,
  OrbitalRegimeId,
  Point3,
  SpacecraftId,
  SpacecraftOrganizationId,
} from './types.ts';

export type ItemId = CelestialBodyId | OrbitalRegimeId | SpacecraftId | SpacecraftOrganizationId;
export type ToggleId = HillSphereId;

export type Settings = {
  epoch: Epoch;
  play: boolean;
  speed: number; // multiplier over real time
  drawOrbit: boolean;
  drawLabel: boolean;
  center: ItemId | null; // center of visualization
  hover: ItemId | null; // mouse hovered item
  toggles: Set<ToggleId>;
  visibleTypes: Set<CelestialBodyType>;
  visibleRegimes: Set<OrbitalRegimeId>;
  bodies: Array<CelestialBody>;
  isTouchDevice: boolean;
};

// these values are readonly; driven by the model
export type ModelState = {
  time: number; // seconds
  fps: number | null; // null while initializing
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
    play: true,
    speed: Time.DAY, // one day per second to demonstrate motion without touching controls
    drawOrbit: true,
    drawLabel: true,
    center: getInitialCenter(),
    hover: null,
    toggles: new Set([]),
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
    isTouchDevice: false,
  },

  // set by model on update
  model: {
    time: 0,
    fps: null,
    metersPerPx: 1,
    vernalEquinox: [1, 0, 0],
  },
};

export type Actions = {
  updateModel: (update: ModelState) => void;
  updateSettings: (update: Partial<Settings> | ((prev: Settings) => Settings)) => void;
  reset: () => AppState;
};

export const useAppState = create<AppState & Actions>(set => ({
  ...initialState,
  updateModel: model =>
    set(prev => ({
      model: {
        ...prev.model,
        ...model,
        vernalEquinox: prev.model.vernalEquinox.some((value, i) => Math.abs(value - model.vernalEquinox[i]) > 1e-5) // avoid updating when values are unchanged
          ? model.vernalEquinox
          : prev.model.vernalEquinox,
      },
    })),
  updateSettings: update =>
    set(prev => {
      const newSettings = typeof update === 'function' ? update(prev.settings) : { ...prev.settings, ...update };
      const newSettingsWithMask = newSettings.isTouchDevice ? { ...newSettings, hover: null } : newSettings;
      return equals(newSettingsWithMask, prev.settings) ? prev : { settings: newSettingsWithMask };
    }),
  reset: () => {
    const resetState = { ...initialState, settings: { ...initialState.settings, center: null } };
    set(resetState);
    return resetState;
  },
}));
