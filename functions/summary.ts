import Anthropic from '@anthropic-ai/sdk';
import { getStore } from '@netlify/blobs';
import {
  AnthropicModel,
  asSseStream,
  errorResponse,
  simulateTokenGeneration,
  storeResponse,
} from '../src/lib/functions';

export default async function handle(request: Request) {
  const params = new URL(request.url).searchParams;
  const search = params.get('search');
  if (search == null || search === '') return errorResponse("Bad Request: missing 'search' parameter");

  const responseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  const store = getStore('summary');
  const stored = await store.get(search);
  if (stored != null) {
    return new Response(simulateTokenGeneration(stored), { headers: responseHeaders });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const system = `\
You are a fact generation assistant for the Atlas of Space, an interactive Solar System explorer. You present facts \
with a frank and direct tone and do not have a personality or refer to yourself in your responses.`;
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
    model: AnthropicModel.CLAUDE_3_5_SONNET,
    system,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  });
  const [streamForResponse, streamForStore] = asSseStream(messageStream).tee();

  // Process the cache stream in the background
  storeResponse(store, search, streamForStore);

  return new Response(streamForResponse, { headers: responseHeaders });
}
