import { SOLAR_SYSTEM } from './bodies.ts';
import { nowEpoch, Time } from './epoch.ts';
import { SpacecraftId } from './spacecraft.ts';
import {
  CelestialBody,
  CelestialBodyId,
  CelestialBodyType,
  Epoch,
  HeliocentricOrbitalRegime,
  Point3,
} from './types.ts';

type ActiveItemType = 'body' | 'regime' | 'spacecraft';
type ActiveItemId = `${ActiveItemType}/${string}`;

export function asActiveBody(id: CelestialBodyId): ActiveItemId {
  return `body/${id}`;
}
export function asActiveRegime(regime: HeliocentricOrbitalRegime): ActiveItemId {
  return `regime/${regime}`;
}
export function asActiveSpacecraft(id: SpacecraftId): ActiveItemId {
  return `spacecraft/${id}`;
}
export function isActiveBody(id: CelestialBodyId, activeItem: ActiveItemId | null): boolean {
  return asActiveBody(id) === activeItem;
}
export function isActiveRegime(regime: HeliocentricOrbitalRegime, activeItem: ActiveItemId | null): boolean {
  return asActiveRegime(regime) === activeItem;
}
export function isActiveSpacecraft(id: SpacecraftId, activeItem: ActiveItemId | null): boolean {
  return asActiveSpacecraft(id) === activeItem;
}

export type Settings = {
  epoch: Epoch;
  play: boolean;
  speed: number; // multiplier over real time
  drawOrbit: boolean;
  drawLabel: boolean;
  focus: ActiveItemId | null; // clicked item, i.e. fact sheet is open
  center: ActiveItemId | null; // center of visualization
  hover: ActiveItemId | null; // mouse hovered item
  visibleTypes: Set<CelestialBodyType>;
  visibleRegimes: Set<HeliocentricOrbitalRegime>;
  bodies: Array<CelestialBody>;
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
    focus: null,
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
    fps: null,
    metersPerPx: 1,
    vernalEquinox: [1, 0, 0],
  },
};

export type UpdateSettings = (update: Partial<Settings> | ((prev: Settings) => Settings)) => void;
