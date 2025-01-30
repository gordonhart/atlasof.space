import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { readStreamResponse } from '../lib/functions.ts';
import { Spacecraft, SpacecraftVisit } from '../lib/spacecraft.ts';
import { CelestialBody } from '../lib/types.ts';
import { celestialBodyTypeName } from '../lib/utils.ts';

export function useSpacecraftVisitSummaryStream(spacecraft: Spacecraft, body: CelestialBody, visit: SpacecraftVisit) {
  const years =
    visit.end != null ? `${visit.start.getFullYear()}-${visit.end.getFullYear()}` : visit.start.getFullYear();
  const search = `\
the encounter between the ${spacecraft.organization} spacecraft ${spacecraft.name} and the \
${celestialBodyTypeName(body.type).toLowerCase()} ${body.name} in ${years}`;
  const [isStreaming, setIsStreaming] = useState(false);
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
