import { SOLAR_SYSTEM } from './data/bodies.ts';
import { nowEpoch, Time } from './epoch.ts';
import {
  CelestialBody,
  CelestialBodyId,
  CelestialBodyType,
  Epoch,
  OrbitalRegimeId,
  PlanetarySystemId,
  Point3,
  SpacecraftId,
  SpacecraftOrganizationId,
} from './types.ts';

export type ItemId = CelestialBodyId | OrbitalRegimeId | PlanetarySystemId | SpacecraftId | SpacecraftOrganizationId;

export function itemIdAsRoute(itemId: ItemId | null) {
  if (itemId == null) return '/';
  const [type, id] = itemId.split('/', 2);
  if (type === 'body') return `/${id}`;
  if (type === 'regime') return `/regime/${id}`;
  if (type === 'spacecraft') return `/spacecraft/${id}`;
  if (type === 'organization') return `/organization/${id}`;
  return '/'; // fallback, shouldn't get here
}

export type Settings = {
  epoch: Epoch;
  play: boolean;
  speed: number; // multiplier over real time
  drawOrbit: boolean;
  drawLabel: boolean;
  center: ItemId | null; // center of visualization
  hover: ItemId | null; // mouse hovered item
  visibleTypes: Set<CelestialBodyType>;
  visibleRegimes: Set<OrbitalRegimeId>;
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
