import { useEffect, useMemo } from 'react';
import { DEFAULT_ASTEROID_COLOR } from '../lib/data/bodies.ts';
import { SPACECRAFT_ORGANIZATIONS } from '../lib/data/organizations.ts';
import { ORBITAL_REGIMES } from '../lib/data/regimes.ts';
import { SPACECRAFT_BY_ID } from '../lib/data/spacecraft.ts';
import { Settings } from '../lib/state.ts';
import {
  CelestialBody,
  HexColor,
  isCelestialBodyId,
  isOrbitalRegimeId,
  isOrganizationId,
  isSpacecraftId,
  OrbitalRegime,
  Spacecraft,
  SpacecraftOrganization,
} from '../lib/types.ts';

export enum FocusItemType {
  CELESTIAL_BODY = 'celestial-body',
  ORBITAL_REGIME = 'orbital-regime',
  SPACECRAFT = 'spacecraft',
  ORGANIZATION = 'organization',
}
export type TypedFocusItem =
  | { type: FocusItemType.CELESTIAL_BODY; item: CelestialBody }
  | { type: FocusItemType.ORBITAL_REGIME; item: OrbitalRegime }
  | { type: FocusItemType.SPACECRAFT; item: Spacecraft }
  | { type: FocusItemType.ORGANIZATION; item: SpacecraftOrganization };
export type FocusItem = TypedFocusItem & { color: HexColor; name: string };

export function useFocusItem({ center, bodies }: Settings): FocusItem | undefined {
  const focusItem = useMemo(() => getFocusItem(center, bodies), [center, JSON.stringify(bodies)]);

  useEffect(() => {
    const namePart = focusItem?.name != null ? `${focusItem?.name} • ` : '';
    document.title = `${namePart}Atlas of Space`;
  }, [focusItem?.name]);

  return focusItem;
}

function getFocusItem(id: string | null, bodies: Array<CelestialBody>): FocusItem | undefined {
  if (isCelestialBodyId(id)) {
    const body = bodies.find(b => b.id === id);
    if (body == null) return undefined;
    return {
      type: FocusItemType.CELESTIAL_BODY,
      item: body,
      color: body.style.fgColor,
      name: body.shortName ?? body.name,
    };
  } else if (isOrbitalRegimeId(id)) {
    const regime = ORBITAL_REGIMES[id];
    return {
      type: FocusItemType.ORBITAL_REGIME,
      item: regime,
      color: DEFAULT_ASTEROID_COLOR,
      name: regime.name,
    };
  } else if (isSpacecraftId(id)) {
    const spacecraft = SPACECRAFT_BY_ID[id];
    return {
      type: FocusItemType.SPACECRAFT,
      item: spacecraft,
      color: spacecraft.color,
      name: spacecraft.name,
    };
  } else if (isOrganizationId(id)) {
    const organization = SPACECRAFT_ORGANIZATIONS[id];
    return {
      type: FocusItemType.ORGANIZATION,
      item: organization,
      color: organization.color,
      name: organization.shortName,
    };
  }
  return undefined;
}
