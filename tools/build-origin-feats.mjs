/**
 * Rebuild the Origin-feat block of src/data/feats.ts strictly from the
 * dnd2024.wikidot.com /feat:{slug} pages cached in .feat-cache/.
 *
 * General feats, fighting styles and epic boons are copied through verbatim.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CACHE = join(ROOT, '.feat-cache');
const BG_CACHE = join(ROOT, '.background-cache');
const OUT = join(ROOT, 'src/data/feats.ts');
const DRY = process.argv.includes('--dry');

// ---------------- shared helpers ----------------
export const clean = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;|&lsquo;/g, "'").replace(/&rdquo;|&ldquo;/g, '"')
    .replace(/&mdash;|&ndash;/g, '-').replace(/&hellip;/g, '...')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\u2019|\u2018/g, "'").replace(/\u201C|\u201D/g, '"')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

export const pageBody = (html) => {
  const a = html.indexOf('id="page-content"');
  if (a === -1) return '';
  let b = html.indexOf('<div class="page-tags">', a);
  if (b === -1) b = html.indexOf('<script', a);
  if (b === -1) b = html.length;
  return html.slice(a, b);
};

export const paragraphs = (body) => [...body.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]);

export const q = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

/** Full text of a feat from its wikidot page (fetches on cache miss). */
export async function readFeat(slug, cacheDir = CACHE) {
  const f = join(cacheDir, slug + '.html');
  if (!existsSync(f)) {
    console.log(`  fetching feat page /feat:${slug}`);
    const res = await fetch(`https://dnd2024.wikidot.com/feat:${slug}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; data-builder/1.0)' },
    });
    if (!res.ok) throw new Error(`feat fetch failed ${res.status} for /feat:${slug}`);
    if (!existsSync(cacheDir)) mkdirSync(cacheDir);
    writeFileSync(f, await res.text());
    await new Promise((r) => setTimeout(r, 150));
  }
  const body = pageBody(readFileSync(f, 'utf8'));
  const ps = paragraphs(body);
  let rest = ps.filter((p) => !/^Source\s*:/i.test(clean(p)));
  let prerequisites;
  for (const p of rest) {
    const inner = p.replace(/^<p>|<\/p>\s*$/g, '');
    if (/^<strong>Prerequisite:<\/strong>/i.test(inner)) {
      prerequisites = clean(inner.replace(/^<strong>Prerequisite:<\/strong>/i, ''));
      rest = rest.filter((x) => x !== p);
    }
  }
  const description = clean(
    rest
      .filter((p) => !/^You gain the following benefits\.?\s*$/i.test(clean(p)))
      .join(' '),
  );
  return { prerequisites, description };
}

export const humanize = (slug) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// ---------------- main ----------------
// The origin-feat set is driven by what the site's background pages reference
// (backgrounds only grant origin feats). Scan the cached background pages for
// their /feat: links; any feat whose page is missing gets fetched.
const slugs = (() => {
  if (!existsSync(BG_CACHE)) {
    console.error('ERROR: .background-cache missing - run build-backgrounds.mjs first');
    process.exit(1);
  }
  const ids = new Set();
  for (const f of readdirSync(BG_CACHE).filter((x) => x.endsWith('.html'))) {
    const html = readFileSync(join(BG_CACHE, f), 'utf8');
    for (const m of html.matchAll(/<a href="\/feat:([^"]+)">/g)) {
      if (!m[1].startsWith('all#')) ids.add(m[1]);
    }
  }
  return [...ids].sort();
})();

// display names: prefer the link text used on the background pages (faithful
// to "Vampire's Plaything", "Lords' Alliance Agent", ...), fall back to slug humanizing
const displayNames = new Map();
for (const f of readdirSync(BG_CACHE).filter((x) => x.endsWith('.html'))) {
  const html = readFileSync(join(BG_CACHE, f), 'utf8');
  for (const m of html.matchAll(/<a href="\/feat:([^"]+)">([^<]+)<\/a>/g)) {
    if (!m[1].startsWith('all#') && !displayNames.has(m[1])) displayNames.set(m[1], clean(m[2]));
  }
}
const nameOf = (slug) =>
  slug === 'magic-initiate' ? 'Magic Initiate' : (displayNames.get(slug) ?? humanize(slug));

console.log(`feats referenced by background pages: ${slugs.length} -> ${slugs.join(', ')}`);
const feats = await Promise.all(
  slugs.map(async (slug) => {
    const { prerequisites, description } = await readFeat(slug);
    return {
      id: slug,
      name: nameOf(slug),
      prerequisites,
      description,
      chars: description.length,
    };
  }),
);

// sanity: names should match the display names used on background pages
console.log('name check:');
for (const f of feats) console.log(`  ${f.id.padEnd(16)} -> ${f.name}  (${f.chars} chars)${f.prerequisites ? `  [PREREQ: ${f.prerequisites}]` : ''}`);

console.log(`origin feat entries: ${feats.length}`);

const entries = feats
  .map((f) =>
    [
      '  {',
      `    id: ${q(f.id)},`,
      `    name: ${q(f.name)},`,
      "    source: 'origin',",
      '    usableAsOriginFeat: true,',
      ...(f.prerequisites ? [`    prerequisites: ${q(f.prerequisites)},`] : []),
      '    description:',
      `      ${q(f.description)},`,
      '  },',
    ].join('\n'),
  )
  .join('\n\n');

const src = readFileSync(OUT, 'utf8');
const generalMarker = '  // ---------------- General feats ----------------';
const cut = src.indexOf(generalMarker);
const originMarker = src.indexOf('// ---------------- Origin feats ----------------');
if (cut === -1 || originMarker === -1) throw new Error('feats.ts markers not found');
const originLineEnd = src.indexOf('\n', originMarker);
const prefix = src.slice(0, originLineEnd + 1);
const suffix = src.slice(cut);

const next = `${prefix}${entries}\n\n${suffix}`;
if (DRY) {
  console.log('--- DRY RUN (not writing) ---');
  console.log(`origin entries: ${feats.length}  new feats.ts size: ${next.length} bytes (was ${src.length})`);
} else {
  writeFileSync(OUT, next);
  console.log(`wrote ${OUT} (${next.length} bytes)`);
}