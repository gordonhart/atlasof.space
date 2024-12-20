import { SmallBodyNotFound, SmallBodyResponse } from '../src/lib/sbdb';

// simple proxy to circumvent CORS restrictions
export default async function proxyRequest(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const sstr = params.get('sstr');
  const baseUrl = 'https://ssd-api.jpl.nasa.gov/sbdb.api'; // docs: https://ssd-api.jpl.nasa.gov/doc/sbdb.html
  const urlParams = new URLSearchParams({ sstr, 'full-prec': '1', 'phys-par': '1' });
  const response = await fetch(`${baseUrl}?${urlParams}`);
  const obj: SmallBodyResponse | SmallBodyNotFound = await response.json();
  return Response.json(obj);
}
