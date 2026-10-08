import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\kaieh\\Documents\\usefull\\DND Chracter maker';
const CACHE_DIR = path.join(ROOT, '.feat-cache');

const allHtml = fs.readFileSync(path.join(CACHE_DIR, '_all.html'), 'utf8');

// Derive the full slug set from the master index page
const slugs = [...new Set([...allHtml.matchAll(/\/feat:([a-z0-9-]+)"/g)].map((m) => m[1]))];
console.log(`Total unique feat slugs on /feat:all: ${slugs.length}`);

async function fetchFeatPage(slug) {
  const cacheFile = path.join(CACHE_DIR, `${slug}.html`);
  if (fs.existsSync(cacheFile)) {
    return false; // cached
  }
  const url = `https://dnd2024.wikidot.com/feat:${slug}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'DND-Character-Manager/1.0 (feat bulk fetch; +https://github.com)' },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const html = await response.text();
  fs.writeFileSync(cacheFile, html, 'utf8');
  await new Promise((r) => setTimeout(r, 120));
  return true;
}

async function main() {
  let fetched = 0;
  let failed = 0;
  let skipped = 0;
  for (const slug of slugs) {
    try {
      if (await fetchFeatPage(slug)) {
        fetched += 1;
      } else {
        skipped += 1;
      }
    } catch (err) {
      failed += 1;
      console.error(`FAILED ${slug}: ${err.message}`);
    }
  }
  console.log(`\nDone. fetched=${fetched} skipped(cached)=${skipped} failed=${failed}`);
  console.log(`Cache now holds ${fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith('.html')).length} pages`);
}

main().catch((err) => {
  console.error('Bulk fetch failed:', err);
  process.exit(1);
});