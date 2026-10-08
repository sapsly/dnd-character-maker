import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\kaieh\\Documents\\usefull\\DND Chracter maker';

const FEAT_CACHE = path.join(ROOT, '.feat-cache');
const EQUIP_CACHE = path.join(ROOT, '.equipment-cache');
for (const dir of [FEAT_CACHE, EQUIP_CACHE]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function fetchPage(url, cacheFile) {
  if (fs.existsSync(cacheFile)) {
    console.log(`cached  ${url}`);
    return;
  }
  const response = await fetch(url, {
    headers: { 'User-Agent': 'DND-Character-Manager/1.0 (phase2 fetch; +https://github.com)' },
  });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  const html = await response.text();
  fs.writeFileSync(cacheFile, html, 'utf8');
  console.log(`fetched ${url} (${html.length} bytes)`);
  await new Promise((r) => setTimeout(r, 150));
}

async function main() {
  // Feats master index page (tabbed: Origin/General/Fighting Style/Epic Boon/Dragonmark/...)
  await fetchPage('https://dnd2024.wikidot.com/feat:all', path.join(FEAT_CACHE, '_all.html'));

  // Equipment index pages
  const equipmentPages = [
    ['equipment:weapon', 'weapon.html'],
    ['equipment:armor', 'armor.html'],
    ['equipment:adventuring-gear', 'adventuring-gear.html'],
    ['equipment:tool', 'tool.html'],
    ['equipment:mounts-and-vehicles', 'mounts-and-vehicles.html'],
  ];
  for (const [slug, file] of equipmentPages) {
    await fetchPage(`https://dnd2024.wikidot.com/${slug}`, path.join(EQUIP_CACHE, file));
  }
}

main().catch((err) => {
  console.error('Fetch failed:', err);
  process.exit(1);
});