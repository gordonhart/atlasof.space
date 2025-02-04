import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { datetimeToHumanReadable } from '../lib/epoch.ts';
import { readStreamResponse } from '../lib/functions.ts';
import { orbitalRegimeDisplayName } from '../lib/regimes.ts';
import { SPACECRAFT_ORGANIZATIONS } from '../lib/spacecraft.ts';
import { CelestialBody, OrbitalRegime, Spacecraft, SpacecraftVisit } from '../lib/types.ts';
import { celestialBodyTypeName } from '../lib/utils.ts';

type Params =
  | { type: 'summary'; spacecraft: Spacecraft }
  | { type: 'visit'; spacecraft: Spacecraft; body: CelestialBody; visit: SpacecraftVisit }
  | { type: 'regime'; spacecraft: Spacecraft; regime: OrbitalRegime }
  | { type: 'end'; spacecraft: Spacecraft };
export function useSpacecraftSummaryStream(params: Params) {
  const [isStreaming, setIsStreaming] = useState(false);
  const search = getSearch(params);
  const queryClient = useQueryClient();
  const queryKey = ['GET', 'facts', search];

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      setIsStreaming(true);
      const response = await fetch(`/api/visit?search=${encodeURIComponent(search)}`, { signal });
      const setData = (data: string) => queryClient.setQueryData<string>(queryKey, data);
      return await readStreamResponse(response, setIsStreaming, setData);
    },
    staleTime: Infinity,
  });

  return { ...query, isLoading: isStreaming };
}

function getSearch({ spacecraft, ...params }: Params): string {
  const orgName = SPACECRAFT_ORGANIZATIONS[spacecraft.organization].shortName;
  if (params.type === 'summary') {
    return `the ${orgName} spacecraft ${spacecraft.name}`;
  }

  if (params.type === 'visit') {
    const { body, visit } = params;
    const years =
      visit.end != null ? `${visit.start.getFullYear()}-${visit.end.getFullYear()}` : visit.start.getFullYear();
    return `\
the encounter between the ${orgName} spacecraft ${spacecraft.name} and the \
${celestialBodyTypeName(body.type).toLowerCase()} ${body.name} in ${years}`;
  }

  if (params.type === 'regime') {
    const { regime } = params;
    return `\
the activities of the ${orgName} spacecraft ${spacecraft.name} in the heliocentric orbital regime \
'${orbitalRegimeDisplayName(regime.id)}'`;
  }

  // params.type === 'end'
  const date = spacecraft.end != null ? ` on ${datetimeToHumanReadable(spacecraft.end)}` : '';
  const details = spacecraft.status.details != null ? ` with the provided details '${spacecraft.status.details}'` : '';
  return `\
the end of the ${orgName} spacecraft ${spacecraft.name}'s mission${date}.

Its status is '${spacecraft.status.status.toLowerCase()}'${details}.`;
}
