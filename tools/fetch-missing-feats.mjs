import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join('C:\\Users\\kaieh\\Documents\\usefull\\DND Chracter maker', '.feat-cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

async function fetchFeatPage(slug) {
  const cacheFile = path.join(CACHE_DIR, `${slug}.html`);
  
  if (fs.existsSync(cacheFile)) {
    return fs.readFileSync(cacheFile, 'utf8');
  }
  
  const url = `https://dnd2024.wikidot.com/feat:${slug}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'DND-Character-Manager/1.0 (feat fetch; +https://github.com)'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  
  const html = await response.text();
  fs.writeFileSync(cacheFile, html, 'utf8');
  
  // Polite delay
  await new Promise(r => setTimeout(r, 100));
  
  return html;
}

function parseFeatPage(html, slug) {
  const contentMatch = html.match(/<div id="page-content">([\s\S]*?)(?:<div class="page-tags">|<script|$)/);
  if (!contentMatch) {
    console.warn(`  Could not find page-content for ${slug}`);
    return null;
  }
  
  const content = contentMatch[1];
  console.log(`\n=== ${slug} ===`);
  console.log(content);
  return content;
}

async function main() {
  const missingFeats = ['crafter', 'musician', 'tough', 'healer', 'lucky', 'tavern-brawler'];
  
  for (const slug of missingFeats) {
    try {
      const html = await fetchFeatPage(slug);
      parseFeatPage(html, slug);
    } catch (err) {
      console.error(`FAILED ${slug}: ${err.message}`);
    }
  }
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});