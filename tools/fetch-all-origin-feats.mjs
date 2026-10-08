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
  
  // Extract description - everything after "Source: Player's Handbook" and before any tables
  let desc = content;
  // Remove source line
  desc = desc.replace(/<p>Source: [^<]+<\/p>/, '');
  // Remove HTML tags but keep line breaks
  desc = desc.replace(/<br\s*\/?>/g, '\n');
  desc = desc.replace(/<p>/g, '');
  desc = desc.replace(/<\/p>/g, '\n\n');
  desc = desc.replace(/<strong>([^<]+)<\/strong>/g, '$1');
  desc = desc.replace(/<em>([^<]+)<\/em>/g, '*$1*');
  desc = desc.replace(/<[^>]+>/g, '');
  desc = desc.replace(/&nbsp;/g, ' ');
  desc = desc.replace(/&mdash;/g, '—');
  desc = desc.replace(/&lsquo;/g, "'");
  desc = desc.replace(/&rsquo;/g, "'");
  desc = desc.replace(/&ldquo;/g, '"');
  desc = desc.replace(/&rdquo;/g, '"');
  desc = desc.replace(/'/g, "'");
  desc = desc.replace(/&apos;/g, "'");
  desc = desc.replace(/\u0092/g, "'");
  desc = desc.replace(/\u0091/g, "'");
  desc = desc.replace(/\u2019/g, "'");
  desc = desc.replace(/\u2018/g, "'");
  desc = desc.trim();
  
  // Stop at first table or heading
  const tableIdx = desc.indexOf('\n\nArtisan');
  if (tableIdx > 0) desc = desc.substring(0, tableIdx);
  const h4Idx = desc.indexOf('\n\nFast Crafting');
  if (h4Idx > 0) desc = desc.substring(0, h4Idx);
  
  return desc.trim();
}

async function main() {
  // 10 PHB origin feats
  const originFeats = [
    'alert',
    'magic-initiate',
    'savage-attacker',
    'skilled',
    'crafter',
    'musician',
    'tough',
    'healer',
    'lucky',
    'tavern-brawler'
  ];
  
  for (const slug of originFeats) {
    try {
      const html = await fetchFeatPage(slug);
      const desc = parseFeatPage(html, slug);
      console.log('\n=== ' + slug + ' ===');
      console.log(desc);
    } catch (err) {
      console.error(`FAILED ${slug}: ${err.message}`);
    }
  }
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});