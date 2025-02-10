import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { SPACECRAFT_ORGANIZATIONS } from '../../lib/data/organizations.ts';
import { datetimeToHumanReadable, dateToISO } from '../../lib/epoch.ts';
import { readStreamResponse, slugifyId } from '../../lib/functions.ts';
import { CelestialBody, OrbitalRegime, Spacecraft, SpacecraftVisit } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';

export enum SpacecraftSummaryType {
  SUMMARY = 'summary',
  VISIT = 'visit',
  REGIME = 'regime',
  END = 'end',
}
type Params =
  | { type: SpacecraftSummaryType.SUMMARY; spacecraft: Spacecraft }
  | { type: SpacecraftSummaryType.VISIT; spacecraft: Spacecraft; body: CelestialBody; visit: SpacecraftVisit }
  | { type: SpacecraftSummaryType.REGIME; spacecraft: Spacecraft; regime: OrbitalRegime }
  | { type: SpacecraftSummaryType.END; spacecraft: Spacecraft };
export function useSpacecraftSummaryStream(params: Params) {
  const [isStreaming, setIsStreaming] = useState(false);
  const search = getSearch(params);
  const blobId = getBlobId(params);
  const queryClient = useQueryClient();
  const queryKey = ['GET', 'facts', blobId];

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      setIsStreaming(true);
      const response = await fetch(`/api/visit?${new URLSearchParams({ search, blobId })}`, { signal });
      const setData = (data: string) => queryClient.setQueryData<string>(queryKey, data);
      return await readStreamResponse(response, setIsStreaming, setData);
    },
    staleTime: Infinity,
  });

  return { ...query, isLoading: isStreaming };
}

function getSearch({ spacecraft, ...params }: Params): string {
  const { name, organization, status, end } = spacecraft;
  const orgName = SPACECRAFT_ORGANIZATIONS[organization].shortName;
  switch (params.type) {
    case SpacecraftSummaryType.SUMMARY:
      return `the ${orgName} spacecraft ${name}`;

    case SpacecraftSummaryType.VISIT: {
      const { body, visit } = params;
      const years =
        visit.end != null ? `${visit.start.getFullYear()}-${visit.end.getFullYear()}` : visit.start.getFullYear();
      return `\
the encounter (${visit.type}) between the ${orgName} spacecraft ${name} and the \
${celestialBodyTypeName(body.type).toLowerCase()} ${body.name} in ${years}`;
    }

    case SpacecraftSummaryType.REGIME:
      return `\
the activities of the ${orgName} spacecraft ${name} in the heliocentric orbital regime '${params.regime.name}'`;

    case SpacecraftSummaryType.END: {
      const date = end != null ? ` on ${datetimeToHumanReadable(end)}` : '';
      const details = status.details != null ? ` with the provided details '${status.details}'` : '';
      return `\
the end of the ${orgName} spacecraft ${name}'s mission${date}.

Its status is '${status.status.toLowerCase()}'${details}.`;
    }
  }
}

function getBlobId({ spacecraft, ...params }: Params) {
  const baseBlobId = `${params.type}-${slugifyId(spacecraft.id)}`;
  switch (params.type) {
    case SpacecraftSummaryType.SUMMARY:
    case SpacecraftSummaryType.END:
      return baseBlobId;
    case SpacecraftSummaryType.VISIT:
      return `${baseBlobId}-${slugifyId(params.body.id)}-${dateToISO(params.visit.start)}`;
    case SpacecraftSummaryType.REGIME:
      return `${baseBlobId}-${slugifyId(params.regime.id)}`;
  }
}
