import { useParams } from 'react-router-dom';
import { asCelestialBodyId, asOrbitalRegimeId, asSpacecraftId, OrbitalRegimeId } from '../lib/types.ts';

export function useUrlState() {
  const { bodyId, regimeId, spacecraftId } = useParams();
  const center =
    bodyId != null
      ? asCelestialBodyId(bodyId)
      : regimeId != null
        ? asOrbitalRegimeId(regimeId as OrbitalRegimeId)
        : spacecraftId != null
          ? asSpacecraftId(spacecraftId)
          : null;
  return { center };
}
