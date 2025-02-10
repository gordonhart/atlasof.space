import { MessageStream } from '@anthropic-ai/sdk/lib/MessageStream';
import { Store } from '@netlify/blobs';

export enum AnthropicModel {
  CLAUDE_3_HAIKU = 'claude-3-haiku-20240307',
  CLAUDE_3_5_HAIKU = 'claude-3-5-haiku-20241022',
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet-20241022',
}

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

export function asSse(content: string) {
  return `data: ${JSON.stringify({ content })}\n\n`;
}

export function asSseStream(stream: MessageStream) {
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          const text = chunk.delta?.text || '';
          if (text) {
            controller.enqueue(encoder.encode(asSse(text)));
          }
        }
      } catch (error) {
        console.error('Stream error:', error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });
}

export function fromSseStream(stream: string) {
  return stream
    .split('\n\n')
    .filter(s => s.startsWith('data: '))
    .map(s => JSON.parse(s.slice(6))?.content)
    .join('');
}

export function simulateTokenGeneration(eventStream: string, delayMin = 10, delayMax = 25) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Process in the background
  (async () => {
    const chunks = eventStream.split(' ');
    const encoder = new TextEncoder();
    for (const chunk of chunks) {
      // random delay between delayMin and delayMax milliseconds per "token"
      await new Promise(resolve => setTimeout(resolve, Math.random() * (delayMax - delayMin) + delayMin));
      await writer.write(encoder.encode(chunk + ' '));
    }
    await writer.close();
  })();

  return stream.readable;
}
