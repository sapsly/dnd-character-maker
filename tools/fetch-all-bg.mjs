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
  console.log(content);
  return content;
}

async function main() {
  // Fetch all 71 backgrounds
  const allSlugs = [
    'acolyte', 'artisan', 'charlatan', 'criminal', 'entertainer', 'farmer', 'guard', 'guide', 'hermit', 'merchant', 'noble', 'sage', 'sailor', 'scribe', 'soldier', 'wayfarer',
    'aberrant-heir', 'archaeologist', 'house-agent', 'house-cannith-heir', 'house-deneith-heir', 'house-ghallanda-heir', 'house-jorasco-heir', 'house-kundarak-heir', 'house-lyrandar-heir', 'house-medani-heir', 'house-orien-heir', 'house-phiarlan-heir', 'house-sivis-heir', 'house-tharashk-heir', 'house-thuranni-heir', 'house-vadalis-heir', 'inquisitive',
    'chondathan-freebooter', 'dead-magic-dweller', 'dragon-cultist', 'emerald-enclave-caretaker', 'flaming-fist-mercenary', 'genie-touched', 'harper', 'ice-fisher', 'knight-of-the-gauntlet', 'lords-alliance-vassal', 'moonwell-pilgrim', 'mulhorandi-tomb-raider', 'mythalkeeper', 'purple-dragon-squire', 'rashemi-wanderer', 'shadowmasters-exile', 'spellfire-initiate', 'zhentarim-mercenary',
    'haunted-one', 'investigator', 'mist-wanderer', 'spirit-medium',
    'agent-of-the-ninth-quill', 'bejeweled-conclave-spy', 'cosmic-dawn-experiment', 'covenant-of-the-grave-recruit', 'crucible-storm-chaser', 'familiar-trainer', 'horizon-weaver-initiate', 'phantasmic-circus-trouper', 'seer-apprentice', 'ward-of-the-sheltering-hands',
    'carouser', 'lorwyn-expert', 'pact-seeker', 'shadowmoor-expert', 'vampire-devotee', 'vampire-survivor'
  ];
  
  for (const slug of allSlugs) {
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