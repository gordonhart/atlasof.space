import { parseHTML } from 'linkedom';
import { errorResponse } from '../src/lib/functions';

type Image = {
  src: string;
  alt: string;
};

// TODO: use the `image` property from Wikidata?
// proxy request to wikipedia and extract the main image
export default async function handle(req: Request) {
  const params = new URL(req.url).searchParams;
  const search = params.get('search');
  if (search == null || search === '') return errorResponse("Bad Request: missing 'search' parameter");
  const baseUrl = 'https://en.wikipedia.org/w/index.php';
  const urlParams = new URLSearchParams({ search });
  const response = await fetch(`${baseUrl}?${urlParams}`);
  const body = await response.text();
  const images = findImgElements(body);
  const mainImage = findMainImage(images);
  const responseInit =
    mainImage != null
      ? { status: 302, headers: { Location: mainImage.src, 'Cache-Control': 'public, max-age=3600' } }
      : { status: 404 };
  return new Response(null, responseInit);
}

const IGNORED_IMAGE_PARTS = ['Sound-icon.svg', 'Wiktionary-logo', 'Vector_search_icon'];
function findMainImage(images: Array<Image>): Image | undefined {
  const matchingImages = images
    .filter(({ src }) => src.startsWith('//upload.wikimedia.org/wikipedia/commons'))
    .filter(({ src }) => !IGNORED_IMAGE_PARTS.some(part => src.includes(part)))
    .map(({ src, alt }) => ({ src: `https:${src}`, alt }));
  return matchingImages[0];
}

function findImgElements(html: string): Array<Image> {
  const { document } = parseHTML(html);
  return Array.from(document.querySelectorAll('img')).map(img => ({
    src: img.src ?? '',
    alt: img.alt ?? '',
  }));
}
