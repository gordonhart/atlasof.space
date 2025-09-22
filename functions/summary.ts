import Anthropic from '@anthropic-ai/sdk';
import { getStore } from '@netlify/blobs';
import {
  AnthropicModel,
  asSse,
  asSseStream,
  errorResponse,
  fromSseStream,
  simulateTokenGeneration,
  storeResponse,
  SYSTEM_PROMPT,
} from '../src/lib/functions';

export default async function handle(request: Request) {
  const params = new URL(request.url).searchParams;
  const search = params.get('search');
  if (search == null || search === '') return errorResponse("Bad Request: missing 'search' parameter");
  const stream = params.get('stream') !== 'false';

  const responseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  const store = getStore('summary');
  const stored = await store.get(search);
  if (stored != null) {
    const content = stream ? simulateTokenGeneration(stored) : asSse(fromSseStream(stored));
    return new Response(content, { headers: responseHeaders });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = `\
Generate a 1-sentence summary of ${search}. Examples of good summaries:

<example name="Phobos">
A small, irregularly shaped moon that orbits once every 7 hours only ~6000km from the surface of the planet.
</example>

<example name="Iapetus">
A distinctive moon characterized by its inclined orbit, its two-toned coloring, with one bright white and one brown \
hemisphere, and by a prominent equatorial ridge that makes it resemble a walnut.
</example>`;
  const messageStream = client.messages.stream({
    model: AnthropicModel.CLAUDE_4_SONNET,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  });
  const [streamForResponse, streamForStore] = asSseStream(messageStream).tee();

  // Process the cache stream in the background
  storeResponse(store, search, streamForStore);

  return new Response(streamForResponse, { headers: responseHeaders });
}
