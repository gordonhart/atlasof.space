import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { CelestialBody, CelestialBodyType, isOrbitalRegime, OrbitalRegime } from '../lib/types.ts';
import { celestialBodyTypeName } from '../lib/utils.ts';

export function useSummaryStream(obj: CelestialBody | OrbitalRegime) {
  const [isStreaming, setIsStreaming] = useState(false);
  const search = useMemo(() => getSearch(obj), [JSON.stringify(obj)]);

  const queryClient = useQueryClient();
  const queryKey = ['GET', 'facts', search];

  // TODO: dedupe logic with useFactsStream
  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      setIsStreaming(true);
      const response = await fetch(`/api/summary?search=${encodeURIComponent(search)}`, { signal });
      const reader = response.body?.getReader();
      if (reader == null) return '';
      let out = '';
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const messages = buffer.split('\n\n'); // Process complete SSE messages
        buffer = messages.pop() || ''; // Keep incomplete chunk in buffer
        for (const message of messages) {
          if (message.startsWith('data: ')) {
            const data = JSON.parse(message.slice(6));
            out = `${out}${data.content}`;
            queryClient.setQueryData<string>(queryKey, out);
          }
        }
      }

      // TODO: error handling..? don't want failures to look like infinite loads
      setIsStreaming(false);
      return out;
    },
    staleTime: Infinity,
  });

  return { ...query, isLoading: isStreaming };
}

function getSearch(obj: CelestialBody | OrbitalRegime) {
  if (isOrbitalRegime(obj)) {
    return `the heliocentric orbital regime '${obj.name}'`;
  }
  switch (obj.type) {
    case CelestialBodyType.MOON:
      return `${obj.elements.wrt}'s moon ${obj.name}`;
    default:
      return `the ${celestialBodyTypeName(obj.type).toLowerCase()} ${obj.name}`;
  }
}
