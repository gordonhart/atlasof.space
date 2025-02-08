import { Store } from '@netlify/blobs';

export async function storeResponse(store: Store, key: string, stream: ReadableStream) {
  const reader = stream.getReader();
  let finalResult = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      finalResult += new TextDecoder().decode(value);
    }
    await store.set(key, finalResult);
  } catch (error) {
    console.error('Error processing stream:', error);
  }
}

export async function readStreamResponse(
  response: Response,
  setActive: (active: boolean) => void,
  setData: (data: string) => void
) {
  setActive(true);
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
        setData(out);
      }
    }
  }

  // TODO: error handling..? don't want failures to look like infinite loads
  setActive(false);
  return out;
}

export function slugifyId(id: string): string {
  return id.replace(/\//g, '-');
}

export function errorResponse(message: string) {
  return new Response(JSON.stringify({ message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
}
