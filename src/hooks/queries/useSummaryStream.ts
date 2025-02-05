import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { readStreamResponse } from '../../lib/functions.ts';
import { orbitalRegimeDisplayName } from '../../lib/regimes.ts';
import { SPACECRAFT_ORGANIZATIONS } from '../../lib/spacecraft.ts';
import {
  CelestialBody,
  CelestialBodyType,
  OrbitalRegimeId,
  isOrbitalRegime,
  isSpacecraft,
  OrbitalRegime,
  Spacecraft,
} from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';

export function useSummaryStream(obj: CelestialBody | OrbitalRegime | Spacecraft) {
  const search = useMemo(() => getSearch(obj), [JSON.stringify(obj)]);
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = ['GET', 'facts', search];

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      setIsStreaming(true);
      const response = await fetch(`/api/summary?search=${encodeURIComponent(search)}`, { signal });
      const setData = (data: string) => queryClient.setQueryData<string>(queryKey, data);
      return await readStreamResponse(response, setIsStreaming, setData);
    },
    staleTime: Infinity,
  });

  return { ...query, isLoading: isStreaming };
}

function getSearch(obj: CelestialBody | OrbitalRegime | Spacecraft) {
  if (isOrbitalRegime(obj)) {
    // provide the full set to anchor that e.g. the 'Outer System' is distinct from the 'Kuiper Belt'
    const orbitalRegimes = Object.values(OrbitalRegimeId).map(orbitalRegimeDisplayName).join(', ');
    return `the heliocentric orbital regime '${orbitalRegimeDisplayName(obj.id)}' (of the set with ${orbitalRegimes})`;
  }
  if (isSpacecraft(obj)) {
    return `the ${SPACECRAFT_ORGANIZATIONS[obj.organization].shortName} spacecraft ${obj.name}`;
  }
  switch (obj.type) {
    case CelestialBodyType.MOON:
      return `${obj.elements.wrt}'s moon ${obj.name}`;
    default:
      return `the ${celestialBodyTypeName(obj.type).toLowerCase()} ${obj.name}`;
  }
}
