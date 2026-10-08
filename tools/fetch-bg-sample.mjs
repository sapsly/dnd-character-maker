import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join('C:\\Users\\kaieh\\Documents\\usefull\\DND Chracter maker', '.background-cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

async function fetchBgPage(slug) {
  const cacheFile = path.join(CACHE_DIR, `${slug}.html`);
  
  if (fs.existsSync(cacheFile)) {
    return fs.readFileSync(cacheFile, 'utf8');
  }
  
  const url = `https://dnd2024.wikidot.com/background:${slug}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'DND-Character-Manager/1.0 (background catalog build; +https://github.com)'
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

function parseBgPage(html, slug) {
  // Find page-content div
  const contentMatch = html.match(/<div id="page-content">([\s\S]*?)(?:<div class="page-tags">|<script|$)/);
  if (!contentMatch) {
    console.warn(`  Could not find page-content for ${slug}`);
    return null;
  }
  
  const content = contentMatch[1];
  console.log(`\n=== ${slug} ===`);
  console.log(content.substring(0, 2000));
  return content;
}

async function main() {
  const testSlugs = ['acolyte', 'artisan', 'aberrant-heir', 'haunted-one'];
  
  for (const slug of testSlugs) {
    try {
      const html = await fetchBgPage(slug);
      parseBgPage(html, slug);
    } catch (err) {
      console.error(`FAILED ${slug}: ${err.message}`);
    }
  }
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});