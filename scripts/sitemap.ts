import * as fs from 'fs/promises';
import * as path from 'path';
import { dateToISO } from '../src/lib/epoch';
import { ROUTES } from '../src/lib/routes';

const BASE_URL = 'https://atlasof.space';
const OUTPUT_PATH = path.join(process.cwd(), 'dist', 'sitemap.xml');

type UrlEntry = {
  loc: string;
  lastmod: string;
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

function generateUrlEntry({ loc, lastmod, changeFreq, priority }: UrlEntry): string {
  const changeFreqElement = changeFreq ? `\n    <changefreq>${changeFreq}</changefreq>` : '';
  const priorityElement = priority ? `\n    <priority>${priority}</priority>` : '';
  return `\
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>${changeFreqElement}${priorityElement}
  </url>`;
}

async function generateSitemap() {
  try {
    const today = dateToISO(new Date());
    const urlEntries = ROUTES.map(route => {
      const entry: UrlEntry = {
        loc: `${BASE_URL}${route}`,
        lastmod: today,
        // Set custom changeFreq and priority for homepage
        ...(route === '/' ? { changeFreq: 'daily', priority: 1.0 } : { changeFreq: 'weekly', priority: 0.8 }),
      };
      return generateUrlEntry(entry);
    });
    const sitemap = `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;
    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await fs.writeFile(OUTPUT_PATH, sitemap, 'utf-8');
    console.log(`Sitemap generated successfully at ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
