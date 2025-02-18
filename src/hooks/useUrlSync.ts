import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { itemIdAsRoute } from '../lib/routes.ts';
import { useAppState } from '../lib/state.ts';
import { asCelestialBodyId, asOrbitalRegimeId, asOrganizationId, asSpacecraftId } from '../lib/types.ts';

export function useUrlSync() {
  const { bodyId, regimeId, spacecraftId, organizationId } = useParams();
  const navigate = useNavigate();
  const center = useAppState(state => state.settings.center);
  const updateSettings = useAppState(state => state.updateSettings);

  const urlCenter = useMemo(() => {
    if (bodyId != null) return asCelestialBodyId(bodyId);
    if (regimeId != null) return asOrbitalRegimeId(regimeId);
    if (spacecraftId != null) return asSpacecraftId(spacecraftId);
    if (organizationId != null) return asOrganizationId(organizationId);
    return null;
  }, [bodyId, regimeId, spacecraftId, organizationId]);

  // sync URL changes to state
  useEffect(() => {
    if (urlCenter != center) updateSettings({ center: urlCenter });
  }, [urlCenter]);

  // sync state changes to URL
  useEffect(() => {
    if (center != urlCenter) navigate(itemIdAsRoute(center));
  }, [center]);
}
