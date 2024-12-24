import Anthropic from '@anthropic-ai/sdk';
import { getStore, Store } from '@netlify/blobs';
import { AnthropicModel } from '../src/lib/llm';

async function getWikidataId(search: string): Promise<string | undefined> {
  const baseUrl = 'https://www.wikidata.org/w/api.php';
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: search,
    format: 'json',
  });
  const response = await fetch(`${baseUrl}?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch ID from Wikidata');
  }
  const body = await response.json();
  return body.query.search[0].title;
}

type WikidataDatum = {
  label: string;
  value: string;
  units: string | null;
};
async function getWikidataInfo(id: string): Promise<Array<WikidataDatum>> {
  const endpointUrl = 'https://query.wikidata.org/sparql';
  const sparqlQuery = `\
SELECT ?property ?propertyLabel ?value ?valueLabel ?unit ?unitLabel
WHERE {
  wd:${id} ?p ?statement .
  ?property wikibase:claim ?p ;
            wikibase:statementProperty ?ps .

  # Retrieve the main value
  ?statement ?ps ?value .
  
  # Handle quantities and their units
  OPTIONAL {
    ?statement ?ps ?quantity.
    FILTER(DATATYPE(?quantity) = xsd:decimal || DATATYPE(?quantity) = wikibase:quantityAmount)
    ?statement ?psv ?valueNode .
    ?valueNode wikibase:quantityAmount ?value ;
              wikibase:quantityUnit ?unit .
  }

  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
  }
}`;

  const params = new URLSearchParams({
    query: sparqlQuery,
    format: 'json',
  });
  const response = await fetch(`${endpointUrl}?${params}`, {
    headers: {
      'User-Agent': 'Atlas of Space/1.0 (gordon.hart2@gmail.com)',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch info from Wikidata');
  }
  const body = await response.json();

  const bindings: Array<object> = body.results.bindings;
  /*
  example "bindings" object: {
    value: { datatype: 'http://www.w3.org/2001/XMLSchema#decimal', type: 'literal', value: '1.702' },
    unit: { type: 'uri', value: 'http://www.wikidata.org/entity/Q13147228' },
    property: { type: 'uri', value: 'http://www.wikidata.org/entity/P2054' },
    propertyLabel: { 'xml:lang': 'en', type: 'literal', value: 'density' },
    valueLabel: { type: 'literal', value: '1.702' },
    unitLabel: { 'xml:lang': 'en', type: 'literal', value: 'gram per cubic centimetre' }
  },
   */

  return bindings.map(({ valueLabel, propertyLabel, unitLabel }) => ({
    label: propertyLabel.value,
    value: valueLabel.value,
    units: unitLabel?.value,
  }));
}

function wikidataInfoAsCsv(wikidataInfo: Array<WikidataDatum>): string {
  const rows = wikidataInfo.map(({ label, value, units }) => `"${label}","${value}","${units ?? ''}"`).join('\n');
  return `label,value,units\n${rows}`;
}

async function formatWithClaude(search: string, wikidataInfo: Array<WikidataDatum>) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const system = `\
You are a data retrieval assistant for the Atlas of Space, an educational tool to help learn about our solar system.

Keep your responses brief. You do not have a personality, you simply state facts.`;
  const prompt = `\
What facts can you tell me about '${search}'? I'm interested in things like the following:

- Discovery date
- Discoverer and circumstances
- Information about name and origins
- Dimensions
- Rotation period (if known)
- Albedo
- Material composition (if known)
- Relevant spacecraft missions and dates
- Major satellites (if any)

Format your answer as markdown bullet points, with **bolded** keys. Do not include orbital characteristics. Do not preface your \
answer or return anything other than bullet points.

Here's an example of a good response for Saturn's moon Enceladus:

\`\`\`md
- **Discovery date**: August 28, 1789
- **Discovered by**: William Herschel, a German-British astronomer
- **Name origins**: Named after the giant Enceladus from Greek mythology
- **Dimensions**: Diameter of 504.2 km
- **Rotation period**: 1.370218 days, tidally locked to Saturn
- **Albedo**: 1.375
- **Material composition**: Mostly water ice with some rock
- **Spacecraft missions**: 
  - Voyager 1 and Voyager 2 flybys in 1980 and 1981
  - Cassini orbiter observations from 2004 to 2017
\`\`\`

Here's another good example for the planet Jupiter:

\`\`\`md
- **Discovery date**: Visible to naked eye since ancient times
- **Name origins**: Named after the Roman king of gods, Jupiter
- **Dimensions**: Diameter: 142,984 km
- **Rotation period**: 9.925 hours
- **Albedo**: 0.343
- **Material composition**: Primarily hydrogen and helium gas giant with liquid metallic hydrogen core
- **Spacecraft missions**:
  - Pioneer 10 and 11 (1973-1974)
  - Voyager 1 and 2 (1979)
  - Galileo orbiter (1995-2003)
  - Juno orbiter (2016-present)
- **Satellites**:
  - Io
  - Europa
  - Ganymede
  - Callisto
  - At least 91 other minor moons
\`\`\`

I've collected this data from Wikidata to help you provide this information:

\`\`\`csv
${wikidataInfoAsCsv(wikidataInfo)}
\`\`\``;

  const stream = await client.messages.stream({
    model: AnthropicModel.CLAUDE_3_5_SONNET,
    system,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  });

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          const text = chunk.delta?.text || '';
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
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

async function storeResponse(store: Store, key: string, stream: ReadableStream) {
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

function simulateTokenGeneration(eventStream: string) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const [delayMin, delayMax] = [10, 25]; // Random delay between 10-25ms per "token"

  // Process in the background
  (async () => {
    const chunks = eventStream.split(' ');
    const encoder = new TextEncoder();
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * (delayMax - delayMin) + delayMin));
      await writer.write(encoder.encode(chunk + ' '));
    }
    await writer.close();
  })();

  return stream.readable;
}

export default async function handle(request: Request) {
  const params = new URL(request.url).searchParams;
  const search = params.get('search');
  const responseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  const store = getStore('facts');
  const stored = await store.get(search);
  if (stored != null) {
    return new Response(simulateTokenGeneration(stored), { headers: responseHeaders });
  }

  const id = await getWikidataId(search);
  const info = await getWikidataInfo(id);
  const stream = await formatWithClaude(search, info);
  const [streamForResponse, streamForStore] = stream.tee();

  // Process the cache stream in the background
  storeResponse(store, search, streamForStore);

  return new Response(streamForResponse, { headers: responseHeaders });
}
