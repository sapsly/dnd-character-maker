/**
 * Rebuild src/data/feats.ts — the full feat catalog — strictly from
 * dnd2024.wikidot.com: the /feat:all master page (sections + display names)
 * and the cached per-feat pages in .feat-cache/.
 *
 * Category mapping (wiki section -> FeatDef fields):
 *   Origin Feats        -> category 'origin',         source 'origin',      usableAsOriginFeat
 *   General Feats       -> category 'general',        source 'general'
 *   Fighting Style Feats-> category 'fighting-style', source 'general'
 *   Epic Boon Feats     -> category 'epic-boon',      source 'item'
 *   Dragonmark Feats    -> category 'dragonmark',     source 'origin',      usableAsOriginFeat
 *   Planar Pact Feats   -> category 'planar-pact',    source 'general'
 *   Dark Gift Feats     -> category 'dark-gift',      source 'origin',      usableAsOriginFeat
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CACHE = join(ROOT, '.feat-cache');
const OUT = join(ROOT, 'src/data/feats.ts');
const DRY = process.argv.includes('--dry');

// ---------------- helpers (mirror build-origin-feats.mjs; that module runs on import) ----------------
export const clean = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&rdquo;|&ldquo;/g, '"')
    .replace(/&mdash;|&ndash;/g, '-')
    .replace(/&hellip;/g, '...')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\u2019|\u2018/g, "'")
    .replace(/\u201C|\u201D/g, '"')
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

const q = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

// ---------------- 1. Build section -> ordered [slug, name] from /feat:all ----------------
const allHtml = readFileSync(join(CACHE, '_all.html'), 'utf8');
const tocRe = /<h1 id="toc(\d+)"><span>([^<]+)<\/span><\/h1>/g;
const toc = [...allHtml.matchAll(tocRe)];

const SECTION_MAP = {
  'origin feats': { category: 'origin', source: 'origin', origin: true },
  'general feats': { category: 'general', source: 'general' },
  'fighting style feats': { category: 'fighting-style', source: 'general' },
  'epic boon feats': { category: 'epic-boon', source: 'item' },
  'dragonmark feats': { category: 'dragonmark', source: 'origin', origin: true },
  'planar pact feats': { category: 'planar-pact', source: 'general' },
  'dark gift feats': { category: 'dark-gift', source: 'origin', origin: true },
};

const linkRe = /<a href="\/feat:([a-z0-9-]+)">([^<]+)<\/a>/g;

const sections = [];
for (let i = 0; i < toc.length; i++) {
  const title = clean(toc[i][2]).toLowerCase();
  const mapping = SECTION_MAP[title];
  if (!mapping) {
    console.log(`SKIP non-feat toc section: ${toc[i][2]}`);
    continue;
  }
  const start = toc[i].index + toc[i][0].length;
  const end = i + 1 < toc.length ? toc[i + 1].index : allHtml.length;
  const slice = allHtml.slice(start, end);
  const seen = new Set();
  const entries = [];
  for (const m of slice.matchAll(linkRe)) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      entries.push({ slug: m[1], name: clean(m[2]) });
    }
  }
  sections.push({ title, mapping, entries });
  console.log(`${title.padEnd(22)} ${entries.length} feats`);
}

const total = sections.reduce((n, s) => n + s.entries.length, 0);
console.log(`TOTAL from /feat:all: ${total}`);

// cross-section duplicate check
const slugSection = new Map();
for (const s of sections) {
  for (const e of s.entries) {
    if (slugSection.has(e.slug)) {
      console.log(`DUP slug ${e.slug} in "${slugSection.get(e.slug)}" and "${s.title}" (keeping first)`);
    } else {
      slugSection.set(e.slug, s.title);
    }
  }
}

// ---------------- 2. Parse each cached page ----------------
const emHeaderRe = /^<em>([\s\S]*?)<\/em>$/i;
const boilRe = /^You gain the following (?:benefits|features?)\.\s*$/i;
const categoryFeatRe = /^([^(]+?)\s*Feat\s*\(Prerequisite:\s*(.+)\)$/i;
const barePrereqRe = /^Prerequisite:\s*(.+)$/i;
const repeatableRe = /^Repeatable:\s*(.+)$/i;
const bareCategoryRe = /^(Origin|General|Fighting Style|Epic Boon|Dragonmark|Planar Pact|Dark Gift) Feat$/i;

function parseFeatPage(slug) {
  const f = join(CACHE, slug + '.html');
  if (!existsSync(f)) throw new Error(`missing feat page ${slug}`);
  const body = pageBody(readFileSync(f, 'utf8'));

  // paragraphs
  const ps = [...body.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
  let prerequisites;
  const textParts = [];
  for (const p of ps) {
    const inner = p.replace(/^<p>|<\/p>\s*$/g, '').trim();
    const em = inner.match(emHeaderRe);
    if (em) {
      const head = clean(em[1]);
      if (repeatableRe.test(head)) continue; // no UI value
      const cat = head.match(categoryFeatRe);
      if (cat) {
        prerequisites = cat[2].trim();
        continue;
      }
      const pre = head.match(barePrereqRe);
      if (pre) {
        prerequisites = pre[1].trim();
        continue;
      }
      if (bareCategoryRe.test(head)) continue; // redundant category marker
      textParts.push(head);
      continue;
    }
    const text = clean(inner);
    if (/^Source\s*:/i.test(text)) continue;
    if (boilRe.test(text)) continue;
    if (text) textParts.push(text);
  }
  let description = textParts.join(' ');

  // tables (spell lists, tool lists, etc.)
  const tables = [];
  for (const t of body.matchAll(/<table class="wiki-content-table">([\s\S]*?)<\/table>/g)) {
    const rows = [...t[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) =>
      [...r[1].matchAll(/<t[dh]>([\s\S]*?)<\/t[dh]>/g)].map((c) => clean(c[1])),
    );
    const hasHeader = /<th>/i.test(t[1]);
    const bodyRows = hasHeader ? rows.slice(1) : rows;
    const flat = bodyRows
      .map((cells) => cells.filter((c) => c).join(': '))
      .filter((r) => r)
      .join(' / ');
    if (flat) tables.push(flat);
  }
  if (tables.length) description = `${description} ${tables.join(' / ')}`.replace(/\s+/g, ' ').trim();

  description = description.trim();
  if (!description) throw new Error(`empty description for ${slug}`);

  return { prerequisites, description };
}

// ---------------- 3. Emit ----------------
const lines = [];
let entryCount = 0;
for (const s of sections) {
  const label = s.title
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  lines.push(`  // ---------------- ${label} ----------------`);
  for (const e of s.entries) {
    const { prerequisites, description } = parseFeatPage(e.slug);
    const fields = [
      `    id: ${q(e.slug)},`,
      `    name: ${q(e.name)},`,
      `    category: '${s.mapping.category}',`,
      `    source: '${s.mapping.source}',`,
      ...(s.mapping.origin ? ['    usableAsOriginFeat: true,'] : []),
      ...(prerequisites ? [`    prerequisites: ${q(prerequisites)},`] : []),
      '    description:',
      `      ${q(description)},`,
    ];
    lines.push('  {', ...fields, '  },', '');
    entryCount += 1;
  }
}

const src = `/**
 * Feats catalog rebuilt from dnd2024.wikidot.com (209-feat inventory; /feat:all).
 *
 * 2024 separates feats into categories:
 *  - Origin feats (granted at 1st level by Background or species; swappable).
 *  - General feats (taken via an ASI/feat slot, typically Level 4+).
 *  - Fighting Style feats (require Fighting Style class feature).
 *  - Epic Boon feats (Level 19+).
 *  - Dragonmark, Planar Pact and Dark Gift feats (setting-specific).
 *
 * \`category\` mirrors the wiki's /feat:all sections; \`source\` preserves the
 * legacy filtering buckets ('origin' | 'general' | 'item').
 *
 * Prerequisites are stored as short human-readable strings rather than
 * structured objects: they are only ever displayed in the UI, and the SRD
 * wording varies enough that parsing them would add fragility for no gain.
 */
import type { FeatDef } from '../types/character';

export const FEATS: FeatDef[] = [
${lines.join('\n')}
];

export const FEATS_BY_ID: Record<string, FeatDef> = Object.fromEntries(
  FEATS.map((f) => [f.id, f]),
);

export const ORIGIN_FEATS: FeatDef[] = FEATS.filter((f) => f.source === 'origin');
export const GENERAL_FEATS: FeatDef[] = FEATS.filter((f) => f.source === 'general');
`;

if (DRY) {
  console.log(`--- DRY RUN --- entries=${entryCount}  new size=${src.length} bytes`);
} else {
  writeFileSync(OUT, src);
  console.log(`wrote ${OUT}: ${entryCount} entries, ${src.length} bytes`);
}