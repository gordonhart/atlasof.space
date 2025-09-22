import Anthropic from '@anthropic-ai/sdk';
import { getStore } from '@netlify/blobs';
import {
  AnthropicModel,
  asSse,
  asSseStream, currentDateSentence,
  errorResponse,
  fromSseStream,
  simulateTokenGeneration,
  storeResponse, SYSTEM_PROMPT,
} from '../src/lib/functions';

export default async function handle(request: Request) {
  const params = new URL(request.url).searchParams;
  const search = params.get('search');
  if (search == null || search === '') return errorResponse("Bad Request: missing 'search' parameter");
  const blobId = params.get('blobId') ?? search;
  const stream = params.get('stream') !== 'false';

  const responseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  const store = getStore('visit');
  const stored = await store.get(blobId);
  if (stored != null) {
    const content = stream ? simulateTokenGeneration(stored) : asSse(fromSseStream(stored));
    return new Response(content, { headers: responseHeaders });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = `\
Generate a brief 1-sentence summary of ${search}. Do not restate the organization that launched the spacecraft. \
Examples of good summaries:

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
    model: AnthropicModel.CLAUDE_4_SONNET,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 3,
      },
    ],
  });
  const [streamForResponse, streamForStore] = asSseStream(messageStream).tee();

  // Process the cache stream in the background
  storeResponse(store, blobId, streamForStore);

  return new Response(streamForResponse, { headers: responseHeaders });
}
