import { useEffect, useMemo } from 'react';
import { DEFAULT_ASTEROID_COLOR } from '../lib/data/bodies.ts';
import { SPACECRAFT_ORGANIZATIONS } from '../lib/data/organizations.ts';
import { ORBITAL_REGIMES, orbitalRegimeDisplayName } from '../lib/data/regimes.ts';
import { SPACECRAFT_BY_ID } from '../lib/data/spacecraft.ts';
import { Settings } from '../lib/state.ts';
import {
  isCelestialBody,
  isCelestialBodyId,
  isOrbitalRegime,
  isOrbitalRegimeId,
  isOrganization,
  isOrganizationId,
  isSpacecraft,
  isSpacecraftId,
} from '../lib/types.ts';

export function useFocusItem({ center, bodies }: Settings) {
  const focusItem = useMemo(() => {
    return isCelestialBodyId(center)
      ? bodies.find(({ id }) => id === center)
      : isOrbitalRegimeId(center)
        ? ORBITAL_REGIMES.find(({ id }) => id === center)
        : isSpacecraftId(center)
          ? SPACECRAFT_BY_ID[center]
          : isOrganizationId(center)
            ? SPACECRAFT_ORGANIZATIONS[center]
            : undefined;
  }, [center, JSON.stringify(bodies)]);

  const focusColor = isCelestialBody(focusItem)
    ? focusItem.style.fgColor
    : isSpacecraft(focusItem)
      ? focusItem.color
      : isOrganization(focusItem)
        ? focusItem.color
        : DEFAULT_ASTEROID_COLOR;

  useEffect(() => {
    const name = isCelestialBody(focusItem)
      ? (focusItem.shortName ?? focusItem.name)
      : isOrbitalRegime(focusItem)
        ? orbitalRegimeDisplayName(focusItem.id)
        : isSpacecraft(focusItem)
          ? focusItem.name
          : isOrganization(focusItem)
            ? focusItem.shortName
            : undefined;
    const namePart = name != null ? `${name} • ` : '';
    document.title = `${namePart}Atlas of Space`;
  }, [focusItem]);

  return { focusItem, focusColor };
}
