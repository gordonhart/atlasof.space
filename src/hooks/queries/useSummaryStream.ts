import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { SPACECRAFT_ORGANIZATIONS } from '../../lib/data/organizations.ts';
import { ORBITAL_REGIMES } from '../../lib/data/regimes.ts';
import { readStreamResponse } from '../../lib/functions.ts';
import { CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { FocusItemType, TypedFocusItem } from '../useFocusItem.ts';

export function useSummaryStream(props: TypedFocusItem) {
  const search = useMemo(() => getSearch(props), [JSON.stringify(props)]);
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

function getSearch(item: TypedFocusItem) {
  switch (item.type) {
    case FocusItemType.CELESTIAL_BODY: {
      switch (item.item.type) {
        case CelestialBodyType.MOON:
          return `${item.item.elements.wrt}'s moon ${item.item.name}`;
        default:
          return `the ${celestialBodyTypeName(item.item.type).toLowerCase()} ${item.item.name}`;
      }
    }
    case FocusItemType.ORBITAL_REGIME: {
      // provide the full set to anchor that e.g. the 'Outer System' is distinct from the 'Kuiper Belt'
      const orbitalRegimes = Object.values(ORBITAL_REGIMES)
        .map(({ name }) => name)
        .join(', ');
      return `the heliocentric orbital regime '${item.item.name}' (of the set with ${orbitalRegimes})`;
    }
    case FocusItemType.SPACECRAFT:
      return `the ${SPACECRAFT_ORGANIZATIONS[item.item.organization].shortName} spacecraft ${item.item.name}`;
    case FocusItemType.ORGANIZATION:
      return `the space exploration organization ${item.item.name} (${item.item.shortName})`;
  }
}
