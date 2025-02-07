import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { readStreamResponse, slugifyId } from '../../lib/functions.ts';
import { CelestialBody } from '../../lib/types.ts';

export function useFactsStream({ id, name, type, assets }: CelestialBody) {
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();
  const search = assets?.search ?? `${name}+${type}`;
  const blobId = `facts-${slugifyId(id)}`;
  const queryKey = ['GET', 'facts', search];

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      setIsStreaming(true);
      const response = await fetch(`/api/facts?${new URLSearchParams({ search, blobId })}`, { signal });
      const setData = (data: string) => queryClient.setQueryData<string>(queryKey, data);
      return await readStreamResponse(response, setIsStreaming, setData);
    },
    staleTime: Infinity,
  });

  return { ...query, isLoading: isStreaming };
}
