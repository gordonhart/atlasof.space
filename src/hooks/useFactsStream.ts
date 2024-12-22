import { useEffect } from 'react';

const FACTS_CACHE: Record<string, string> = {};

export function useFactsStream(search: string) {
  useEffect(() => {
    getFacts(search);
  }, [search]);

  return { facts: FACTS_CACHE[search] };
}

async function getFacts(search: string) {
  if (search in FACTS_CACHE) {
    return;
  }
  FACTS_CACHE[search] = '';
  const response = await fetch(`/api/facts?search=${encodeURIComponent(search)}`);
  const reader = response.body?.getReader();
  if (reader == null) {
    return;
  }
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process complete SSE messages
    const messages = buffer.split('\n\n');
    buffer = messages.pop() || ''; // Keep incomplete chunk in buffer

    for (const message of messages) {
      if (message.startsWith('data: ')) {
        const data = JSON.parse(message.slice(6));
        FACTS_CACHE[search] = `${FACTS_CACHE[search]}${data.content}`;
      }
    }
  }
}
