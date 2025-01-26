const CDN_URL = 'https://atlasofspace.b-cdn.net';

export function asCdnUrl(filename: string) {
  return `${CDN_URL}/${filename}`;
}
