import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { SPACECRAFT_ORGANIZATIONS } from '../../lib/data/organizations.ts';
import { ORBITAL_REGIMES } from '../../lib/data/regimes.ts';
import { readStreamResponse } from '../../lib/functions.ts';
import { CelestialBodyType, isOrbitalRegime, isSpacecraft, isOrganization } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { FocusItem } from '../useFocusItem.ts';

export function useSummaryStream(item: Pick<FocusItem, 'item' | 'type'>) {
  const search = useMemo(() => getSearch(item), [JSON.stringify(item)]);
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

function getSearch(item: Pick<FocusItem, 'item' | 'type'>) {
  if (isOrbitalRegime(item)) {
    // provide the full set to anchor that e.g. the 'Outer System' is distinct from the 'Kuiper Belt'
    const orbitalRegimes = Object.values(ORBITAL_REGIMES)
      .map(({ name }) => name)
      .join(', ');
    return `the heliocentric orbital regime '${item.name}' (of the set with ${orbitalRegimes})`;
  }
  if (isSpacecraft(item)) {
    return `the ${SPACECRAFT_ORGANIZATIONS[item.organization].shortName} spacecraft ${item.name}`;
  }
  if (isOrganization(item)) {
    return `the space exploration organization ${item.name} (${item.shortName})`;
  }
  // celestial body
  switch (item.type) {
    case CelestialBodyType.MOON:
      return `${item.elements.wrt}'s moon ${item.name}`;
    default:
      return `the ${celestialBodyTypeName(item.type).toLowerCase()} ${item.name}`;
  }
}
