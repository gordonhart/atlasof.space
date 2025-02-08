import Anthropic from '@anthropic-ai/sdk';
import { getStore } from '@netlify/blobs';
import { storeResponse } from '../src/lib/functions';
import { AnthropicModel, asSseStream, simulateTokenGeneration } from '../src/lib/llm';

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

  const bindings: Array<unknown> = body.results.bindings;
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
- Dimensions (for non-spherical small bodies only)
- Rotation facts (e.g. tidally locked or not)
- Albedo (if known)
- Material composition (if known)
- Density (if known)

I'm not interested in the following:

- Rotation period (if known)
- Relevant spacecraft missions and dates
- Major satellites (if any)
- Anything 'unknown'

Format your answer as markdown bullet points, with **bolded** keys. Do not include orbital characteristics. Do not \
preface your answer or return anything other than bullet points.

Here are a few examples of good responses:

<example name="Saturn's moon Enceladus">
- **Discovery date**: August 28, 1789
- **Discovered by**: William Herschel, a German-British astronomer
- **Name origins**: Named after the giant Enceladus from Greek mythology
- **Rotation**: Tidally locked to Saturn
- **Albedo**: 1.375
- **Material composition**: Mostly water ice with some rock
</example>

<example name="Jupiter+planet">
- **Discovery date**: Visible to naked eye since ancient times
- **Name origins**: Named after the Roman king of gods, Jupiter
- **Albedo**: 0.343
- **Material composition**: Primarily hydrogen and helium gas giant with liquid metallic hydrogen core
</example>

I've collected this data from Wikidata to help you provide this information:

\`\`\`csv
${wikidataInfoAsCsv(wikidataInfo)}
\`\`\``;

  const stream = client.messages.stream({
    model: AnthropicModel.CLAUDE_3_5_SONNET,
    system,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  });

  return asSseStream(stream);
}

export default async function handle(request: Request) {
  const params = new URL(request.url).searchParams;
  const search = params.get('search');
  const blobId = params.get('blobId') ?? search;
  const responseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  const store = getStore('facts');
  const stored = await store.get(blobId);
  if (stored != null) {
    return new Response(simulateTokenGeneration(stored, 5, 15), { headers: responseHeaders });
  }

  const id = await getWikidataId(search);
  const info = await getWikidataInfo(id);
  const stream = await formatWithClaude(search, info);
  const [streamForResponse, streamForStore] = stream.tee();

  // Process the cache stream in the background
  storeResponse(store, blobId, streamForStore);

  return new Response(streamForResponse, { headers: responseHeaders });
}
