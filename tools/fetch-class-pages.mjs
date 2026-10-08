/**
 * Pre-cache the class/subclass pages needed by build-classes.mjs.
 * - fetches artificer:main -> .class-cache/artificer.html (not in local reference)
 * - extracts subclass slugs from the local class pages' Subclasses list-pages-box
 * - fetches every /{class}:{subclass} -> .subclass-cache/{class}-{slug}.html (retry+backoff)
 * - writes .subclass-cache/_index.json { classSlug: [slugs...] } for the fixer lane
 * Usage: node tools/fetch-class-pages.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const REF = join(ROOT, 'reference', 'DND website');
const CLASS_CACHE = join(ROOT, '.class-cache');
const SUB_CACHE = join(ROOT, '.subclass-cache');
const UA = 'Mozilla/5.0 (compatible; data-builder/1.0)';

// 12 PHB classes are local; artificer must be fetched.
const CLASS_SLUGS = ['artificer', 'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'];
const CLASS_NAMES = { artificer: 'Artificer', barbarian: 'Barbarian', bard: 'Bard', cleric: 'Cleric', druid: 'Druid', fighter: 'Fighter', monk: 'Monk', paladin: 'Paladin', ranger: 'Ranger', rogue: 'Rogue', sorcerer: 'Sorcerer', warlock: 'Warlock', wizard: 'Wizard' };
const NOT_SUBCLASS = new Set(['main', 'spell-list', 'all', 'multiclassing', 'spellcasting']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, tries = 5) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (res.status === 200) return await res.text();
      last = `HTTP ${res.status}`;
    } catch (e) {
      last = String(e);
    }
    const backoff = 500 * 2 ** i;
    console.log(`  retry ${i + 1}/${tries} ${url} (${last}), backoff ${backoff}ms`);
    await sleep(backoff);
  }
  throw new Error(`failed after ${tries} tries: ${url} (${last})`);
}

function extractSubclassSlugs(html, classSlug) {
  // Subclass list lives in a list-pages-box div under an h5 "<Class> Subclasses".
  const h5 = html.match(/<h5[^>]*>[\s\S]*?<\/h5>/g) ?? [];
  for (const h of h5) {
    if (/Subclass/i.test(h)) {
      const region = html.slice(html.indexOf(h), html.indexOf(h) + 20000);
      const slugs = [...region.matchAll(new RegExp(`<a href="/${classSlug}:([a-z0-9-]+)">`, 'gi'))].map((m) => m[1]);
      return [...new Set(slugs)].filter((s) => !NOT_SUBCLASS.has(s));
    }
  }
  return [];
}

mkdirSync(CLASS_CACHE, { recursive: true });
mkdirSync(SUB_CACHE, { recursive: true });

const index = {};
const failures = [];

// 1. artificer page
const artFile = join(CLASS_CACHE, 'artificer.html');
if (!existsSync(artFile)) {
  console.log('fetching artificer:main ...');
  const html = await fetchWithRetry('https://dnd2024.wikidot.com/artificer:main');
  writeFileSync(artFile, html);
  await sleep(300);
} else {
  console.log('artificer:main cached');
}

// 2. per-class subclass slug extraction
for (const slug of CLASS_SLUGS) {
  const page = slug === 'artificer'
    ? readFileSync(artFile, 'utf8')
    : readFileSync(join(REF, `${CLASS_NAMES[slug]} - D&D 5e (2024).html`), 'utf8');
  index[slug] = extractSubclassSlugs(page, slug);
  console.log(`${slug}: ${index[slug].length} subclass(es) -> ${index[slug].join(', ')}`);
}

writeFileSync(join(SUB_CACHE, '_index.json'), JSON.stringify(index, null, 2));
console.log(`wrote .subclass-cache/_index.json (${Object.values(index).flat().length} total)`);

// 3. fetch missing subclass pages
for (const slug of CLASS_SLUGS) {
  for (const sub of index[slug]) {
    const file = join(SUB_CACHE, `${slug}-${sub}.html`);
    if (existsSync(file)) continue;
    console.log(`fetching ${slug}:${sub} ...`);
    try {
      const html = await fetchWithRetry(`https://dnd2024.wikidot.com/${slug}:${sub}`);
      writeFileSync(file, html);
      await sleep(300);
    } catch (e) {
      failures.push(`${slug}:${sub} :: ${e.message}`);
    }
  }
}

if (failures.length) {
  console.error(`\nFAILURES (${failures.length}):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log('\nALL SUBLCASS PAGES CACHED');