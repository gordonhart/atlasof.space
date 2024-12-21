import { SmallBodyNotFound, SmallBodyResponse } from '../src/lib/sbdb';

const DEFAULT_PARAMS = {
  'full-prec': '1', // full-precision numbers
  'phys-par': '1', // include physical parameters
  discovery: '1', // output information about discovery
};

// simple proxy to circumvent CORS restrictions
export default async function handle(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const sstr = params.get('sstr');
  const baseUrl = 'https://ssd-api.jpl.nasa.gov/sbdb.api'; // docs: https://ssd-api.jpl.nasa.gov/doc/sbdb.html
  const urlParams = new URLSearchParams({ sstr, ...DEFAULT_PARAMS });
  const response = await fetch(`${baseUrl}?${urlParams}`);
  const obj: SmallBodyResponse | SmallBodyNotFound = await response.json();
  return Response.json(obj);
}
