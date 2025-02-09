import { useParams } from 'react-router-dom';
import {
  asCelestialBodyId,
  asOrbitalRegimeId,
  asOrganizationId,
  asSpacecraftId,
  OrbitalRegimeId,
} from '../lib/types.ts';

export function useUrlState() {
  const { bodyId, regimeId, spacecraftId, organizationId } = useParams();
  const center =
    bodyId != null
      ? asCelestialBodyId(bodyId)
      : regimeId != null
        ? asOrbitalRegimeId(regimeId as OrbitalRegimeId)
        : spacecraftId != null
          ? asSpacecraftId(spacecraftId)
          : organizationId != null
            ? asOrganizationId(organizationId)
            : null;
  return { center };
}
