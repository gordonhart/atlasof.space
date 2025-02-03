import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { datetimeToHumanReadable } from '../lib/epoch.ts';
import { readStreamResponse } from '../lib/functions.ts';
import { CelestialBody, Spacecraft, SpacecraftVisit } from '../lib/types.ts';
import { celestialBodyTypeName } from '../lib/utils.ts';

type Params = {
  search:
    | { type: 'visit'; spacecraft: Spacecraft; body: CelestialBody; visit: SpacecraftVisit }
    | { type: 'end'; spacecraft: Spacecraft };
};
export function useSpacecraftVisitSummaryStream(params: Params) {
  const [isStreaming, setIsStreaming] = useState(false);
  const search = getSearch(params);
  const queryClient = useQueryClient();
  const queryKey = ['GET', 'facts', search];

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/visit?search=${encodeURIComponent(search)}`, { signal });
      const setData = (data: string) => queryClient.setQueryData<string>(queryKey, data);
      return await readStreamResponse(response, setIsStreaming, setData);
    },
    staleTime: Infinity,
  });

  return { ...query, isLoading: isStreaming };
}

function getSearch({ search }: Params): string {
  if (search.type === 'visit') {
    const { spacecraft, body, visit } = search;
    const years =
      visit.end != null ? `${visit.start.getFullYear()}-${visit.end.getFullYear()}` : visit.start.getFullYear();
    return `\
the encounter between the ${spacecraft.organization} spacecraft ${spacecraft.name} and the \
${celestialBodyTypeName(body.type).toLowerCase()} ${body.name} in ${years}`;
  }
  const { spacecraft } = search;
  const year = spacecraft.end != null ? ` on ${datetimeToHumanReadable(spacecraft.end)}` : '';
  const details = spacecraft.status.details != null ? ` with the provided details '${spacecraft.status.details}'` : '';
  return `\
the end of the ${spacecraft.organization} spacecraft ${spacecraft.name}'s mission${year}.

Its status is '${spacecraft.status.status.toLowerCase()}'${details}.`;
}
