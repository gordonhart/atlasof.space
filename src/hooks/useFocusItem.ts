import { useEffect, useMemo } from 'react';
import { ORBITAL_REGIMES, orbitalRegimeDisplayName } from '../lib/regimes.ts';
import { SPACECRAFT_BY_ID } from '../lib/spacecraft.ts';
import { Settings } from '../lib/state.ts';
import {
  isCelestialBody,
  isCelestialBodyId,
  isOrbitalRegime,
  isOrbitalRegimeId,
  isSpacecraft,
  isSpacecraftId,
} from '../lib/types.ts';
import { DEFAULT_ASTEROID_COLOR, DEFAULT_SPACECRAFT_COLOR } from '../lib/utils.ts';

export function useFocusItem({ center, bodies }: Settings) {
  const focusItem = useMemo(() => {
    return isCelestialBodyId(center)
      ? bodies.find(({ id }) => id === center)
      : isOrbitalRegimeId(center)
        ? ORBITAL_REGIMES.find(({ id }) => id === center)
        : isSpacecraftId(center)
          ? SPACECRAFT_BY_ID[center]
          : undefined;
  }, [center, JSON.stringify(bodies)]);

  const focusColor = isCelestialBody(focusItem)
    ? focusItem.style.fgColor
    : isSpacecraft(focusItem)
      ? DEFAULT_SPACECRAFT_COLOR
      : DEFAULT_ASTEROID_COLOR;

  useEffect(() => {
    const name = isCelestialBody(focusItem)
      ? (focusItem.shortName ?? focusItem.name)
      : isOrbitalRegime(focusItem)
        ? orbitalRegimeDisplayName(focusItem.id)
        : isSpacecraft(focusItem)
          ? focusItem.name
          : undefined;
    const namePart = name != null ? `${name} • ` : '';
    document.title = `${namePart}Atlas of Space`;
  }, [focusItem]);

  return { focusItem, focusColor };
}
