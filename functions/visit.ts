import Anthropic from '@anthropic-ai/sdk';
import { getStore } from '@netlify/blobs';
import { storeResponse } from '../src/lib/functions';
import { AnthropicModel, asSseStream, simulateTokenGeneration } from '../src/lib/llm';

export default async function handle(request: Request) {
  const params = new URL(request.url).searchParams;
  const search = params.get('search');

  const responseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  const store = getStore('visit');
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

<example name="the NASA spacecraft Mariner 2">
An interplanetary probe launched in 1972 that became the first spacecraft to cross the asteroid belt, visit Jupiter, \
and leave the Solar System, sending its final signal in 2003 after traveling over 7.6 billion miles.
</example>

<example name="the encounter between the NASA spacecraft Apollo 11 and the moon Luna in 1969">
Apollo 11 became the first manned spacecraft to land on the Moon on June 20, 1969, when Neil Armstrong and Buzz Aldrin \
landed on Mare Tranquillitatis for their historic 21-hour stay.
</example>

<example name="the encounter between the JAXA spacecraft Hayabusa2 and the asteroid 162173 Ryugu in 2014-2020">
Hayabusa2 rendezvoused with Ryugu on June 27, 2018, remaining in orbit for over a year and deploying the MINERVA-II \
and MASCOT landers before collecting a 5.4 gram sample that was returned to Earth.
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
