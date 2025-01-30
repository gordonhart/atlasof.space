import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { readStreamResponse } from '../lib/functions.ts';

export function useFactsStream(search: string) {
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = ['GET', 'facts', search];

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      setIsStreaming(true);
      const response = await fetch(`/api/facts?search=${encodeURIComponent(search)}`, { signal });
      const setData = (data: string) => queryClient.setQueryData<string>(queryKey, data);
      return await readStreamResponse(response, setIsStreaming, setData);
    },
    staleTime: Infinity,
  });

  return { ...query, isLoading: isStreaming };
}
