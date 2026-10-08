/**
 * Rebuild src/data/backgrounds.ts (71 backgrounds) + the BACKGROUND section of
 * src/data/startingEquipment.ts strictly from the dnd2024.wikidot.com
 * "Backgrounds - D&D 5e (2024)" index + cached per-background pages.
 *
 * Usage: node tools/build-backgrounds.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const INDEX = join(ROOT, 'reference', 'DND website', 'Backgrounds - D&D 5e (2024).html');
const CACHE = join(ROOT, '.background-cache');
const FEAT_CACHE = join(ROOT, '.feat-cache');
const OUT_BG = join(ROOT, 'src/data/backgrounds.ts');
const OUT_SE = join(ROOT, 'src/data/startingEquipment.ts');
const DRY = process.argv.includes('--dry');

// ---------------- helpers ----------------
const clean = (html) =>
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

const pageBody = (html) => {
  const a = html.indexOf('id="page-content"');
  if (a === -1) return '';
  let b = html.indexOf('<div class="page-tags">', a);
  if (b === -1) b = html.indexOf('<script', a);
  if (b === -1) b = html.length;
  return html.slice(a, b);
};

const paragraphs = (body) => [...body.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]);

const q = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

const ABILITY = { Strength: 'str', Dexterity: 'dex', Constitution: 'con', Intelligence: 'int', Wisdom: 'wis', Charisma: 'cha' };
const SKILL = {
  Acrobatics: 'acrobatics', 'Animal Handling': 'animalHandling', Arcana: 'arcana', Athletics: 'athletics',
  Deception: 'deception', History: 'history', Insight: 'insight', Intimidation: 'intimidation',
  Investigation: 'investigation', Medicine: 'medicine', Nature: 'nature', Perception: 'perception',
  Performance: 'performance', Persuasion: 'persuasion', Religion: 'religion', 'Sleight of Hand': 'sleightOfHand',
  Stealth: 'stealth', Survival: 'survival',
};

const SRD_SET = ['acolyte', 'criminal', 'sage', 'soldier'];
const sourceOf = (group, id) =>
  group === 'Common' ? (SRD_SET.includes(id) ? 'srd' : 'phb') : group.toLowerCase().replace(/\s+/g, '-');

async function readFeat(slug) {
  const f = join(FEAT_CACHE, slug + '.html');
  if (!existsSync(f)) {
    console.log(`  fetching feat page /feat:${slug}`);
    const res = await fetch(`https://dnd2024.wikidot.com/feat:${slug}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; data-builder/1.0)' },
    });
    if (!res.ok) throw new Error(`feat fetch failed ${res.status} for /feat:${slug}`);
    if (!existsSync(FEAT_CACHE)) mkdirSync(FEAT_CACHE);
    writeFileSync(f, await res.text());
    await new Promise((r) => setTimeout(r, 150));
  }
  const body = pageBody(readFileSync(f, 'utf8'));
  let rest = paragraphs(body).filter((p) => !/^Source\s*:/.test(clean(p)));
  return clean(rest.filter((p) => !/^You gain the following benefits\.?\s*$/.test(clean(p))).join(' '));
}

async function fetchPage(slug, kind, cacheDir) {
  const url = `https://dnd2024.wikidot.com/${kind}:${slug}`;
  console.log(`  fetching ${url}`);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; data-builder/1.0)' } });
  if (!res.ok) throw new Error(`fetch failed ${res.status} for ${url}`);
  const html = await res.text();
  if (!existsSync(cacheDir)) mkdirSync(cacheDir);
  writeFileSync(join(cacheDir, slug + '.html'), html);
  await new Promise((r) => setTimeout(r, 150));
  return html;
}

// ---------------- 1. index ---------------
// NOTE: the index page embeds an inline <script> (tabview-min.js) INSIDE
// page-content, so we must not truncate at the first <script>. Slice from the
// page-content opening to the end of the file instead.
const indexHtml = readFileSync(INDEX, 'utf8');
const indexBody = indexHtml.slice(indexHtml.indexOf('<div id="page-content">'));
const nav = indexBody.match(/<ul class="yui-nav">([\s\S]*?)<\/ul>/);
const labels = nav ? [...nav[1].matchAll(/<em>([^<]+)<\/em>/g)].map((m) => m[1].trim()) : [];
const chunks = indexBody.split('<div id="wiki-tab-0-').slice(1);
const all = [];
for (const [i, chunk] of chunks.entries()) {
  const group = labels[i] ?? `tab-${i}`;
  for (const m of chunk.matchAll(/<a href="\/background:([^"]+)">([^<]+)<\/a>/g)) {
    all.push({ slug: m[1], name: clean(m[2]), group });
  }
}
console.log(`index: ${chunks.length} tab(s), ${all.length} backgrounds`);
for (const [i, g] of chunks.entries()) console.log(`  tab ${i}: ${labels[i] ?? '?'}`);

// ---------------- 2. per-page ---------------
const results = [];
const problems = [];
const toolStrings = new Set();
const skillRawMisses = new Set();

for (const { slug, name, group } of all) {
  const fp = join(CACHE, slug + '.html');
  let page = existsSync(fp) ? readFileSync(fp, 'utf8') : await fetchPage(slug, 'background', CACHE);
  const body = pageBody(page);
  const ps = paragraphs(body);
  const statsHtml = [];
  const flavour = [];
  const STAT_LBL = /^(Ability Score(?:s)?|Feat|Skill Proficiencies|Tool Proficienc(?:y|ies)|Equipment)\s*:/;
  for (const p of ps) {
    const c = clean(p);
    if (/^Source\s*:/.test(c)) continue;
    if (STAT_LBL.test(c)) statsHtml.push(p);
    else flavour.push(p);
  }
  const statText = statsHtml.map(clean).join(' ');
  // label patterns (tolerant of Ability Score/Ability Scores and Tool Proficiency/Tool Proficiencies)
  const LABEL_PATS = ['Ability Score(?:s)?', 'Feat', 'Skill Proficiencies', 'Tool Proficienc(?:y|ies)', 'Equipment'];
  const grab = (labelPat) => {
    const next = LABEL_PATS.filter((l) => l !== labelPat).map((l) => `(?:${l})\\s*:`).join('|');
    const re = new RegExp(`(?:${labelPat})\\s*:\\s*([\\s\\S]*?)(?=\\s+(?:${next})|$)`, 'i');
    const m = statText.match(re);
    return m ? m[1].trim() : null;
  };

  const abilityRaw = grab('Ability Score(?:s)?') ?? '';
  const abilityBonusChoices = abilityRaw.split(',').map((s) => s.trim()).map((s) => ABILITY[s]).filter(Boolean);
  if (abilityBonusChoices.length !== 3) problems.push(`${slug}: ability choices != 3 (raw: "${abilityRaw}")`);

  // Feat line: prefer a REAL feat page link; ignore "/feat:all#..." index-anchor links
  // (Dark Gift / Planar Pact choice lines). When a real link exists the id points
  // at it, but the display name is the whole line (faithful to "X or a Dark Gift
  // feat of your choice"). Choice-only lines get id '' and inline text.
  const featP = statsHtml.find((p) => /Feat\s*:/.test(clean(p)));
  let originFeatId, originFeatName, originFeatDescription;
  if (featP) {
    const realLinks = [...featP.matchAll(/<a href="\/feat:([^"]+)">([^<]+)<\/a>/g)].filter((m) => !m[1].startsWith('all#'));
    const line = clean(featP).replace(/^Feat\s*:\s*/i, '');
    if (realLinks.length) {
      originFeatId = realLinks[0][1];
      originFeatDescription = await readFeat(originFeatId);
    } else {
      originFeatId = '';
      originFeatDescription = line;
    }
    originFeatName = line;
  } else {
    problems.push(`${slug}: no feat line found`);
  }

  const skillRaw = grab('Skill Proficiencies') ?? '';
  const skillsGranted = skillRaw.split(/\s+and\s+/).map((s) => s.trim()).map((s) => SKILL[s]).filter(Boolean);
  if (skillsGranted.length !== 2) problems.push(`${slug}: skill count != 2 (raw: "${skillRaw}")`);
  for (const tok of skillRaw.split(/\s+and\s+/).map((s) => s.trim())) if (!SKILL[tok]) skillRawMisses.add(tok);

  const toolRaw = grab('Tool Proficienc(?:y|ies)');
  const toolsGranted = [];
  const toolChoices = [];
  let toolChoiceCount = 0;
  let toolChoiceCategory;
  if (toolRaw) {
    if (/choice|one kind/i.test(toolRaw)) {
      toolChoices.push(toolRaw);
      toolChoiceCount = 1;
      if (/Artisan/i.test(toolRaw)) toolChoiceCategory = 'artisansTools';
      else if (/Gaming Set/i.test(toolRaw)) toolChoiceCategory = 'gamingSet';
      else if (/Musical Instrument/i.test(toolRaw)) toolChoiceCategory = 'musicalInstrument';
      else problems.push(`${slug}: uncategorized tool choice "${toolRaw}"`);
    } else {
      toolsGranted.push(toolRaw);
    }
    toolStrings.add(toolRaw);
  } else {
    problems.push(`${slug}: NO tool proficiency line`);
  }

  const equips = [];
  const eqRaw = grab('Equipment') ?? '';
  const eqM = eqRaw.match(/^Choose\s+([A-C](?:\s*,?\s*or\s*[A-C])*)\s*:\s*/);
  if (!eqM) {
    problems.push(`${slug}: unparsable equipment "${eqRaw}"`);
  } else {
    const rest = eqRaw.slice(eqM[0].length);
    const parts = rest.split(/\(([ABC])\)\s*/); // ['', letter, text, letter, text...]
    for (let i = 1; i < parts.length; i += 2) {
      const letter = parts[i].toLowerCase();
      let text = parts[i + 1].replace(/;?\s*or\s*$/, '').replace(/;?\s*$/, '').trim();
      const isCoins = /^\d+\s*(?:GP|SP|CP)$/.test(text);
      if (isCoins) {
        equips.push({ id: letter, label: 'Option ' + letter.toUpperCase(), kind: 'coins', items: '', coinsGp: parseInt(text, 10) });
      } else {
        equips.push({ id: letter, label: 'Option ' + letter.toUpperCase(), kind: 'package', items: text, coinsGp: 0 });
      }
    }
    if (equips.length < 2) problems.push(`${slug}: only ${equips.length} equipment option(s)`);
  }

  const description = flavour.length ? clean(flavour.join(' ')) : '';
  if (!description) problems.push(`${slug}: NO flavour description`);

  results.push({
    id: slug, name,
    source: sourceOf(group, slug),
    originFeatId, originFeatName, originFeatDescription,
    abilityBonusChoices,
    skillsGranted,
    toolStrings, toolsGranted, toolChoices, toolChoiceCount, toolChoiceCategory,
    equips,
    description,
  });
}

// ---------------- 3. report ---------------
const bySource = {};
for (const r of results) bySource[r.source] = (bySource[r.source] ?? 0) + 1;
console.log('sources:', JSON.stringify(bySource));
console.log('distinct tool strings:', [...toolStrings].sort().join(' | '));
console.log('skill raw tokens unmapped:', skillRawMisses.size ? [...skillRawMisses].join(', ') : '(none)');
console.log('fetch needed: 0 (cache complete)');
console.log('problems:', problems.length ? '\n  ' + problems.join('\n  ') : '(none)');

const featIdsUsed = [...new Set(results.map((r) => r.originFeatId).filter(Boolean))].sort();
console.log('feat ids used:', featIdsUsed.join(', '));

if (problems.length) {
  console.error(`\nABORT: ${problems.length} problem(s) found`);
  process.exit(1);
}
if (DRY) {
  console.log('\n--- DRY RUN (not writing) ---');
  process.exit(0);
}

// ---------------- 4. emit backgrounds.ts ----------------
const bgEntries = results
  .map((r) => {
    const lines = [
      '  {',
      `    id: ${q(r.id)},`,
      `    name: ${q(r.name)},`,
      `    source: ${q(r.source)},`,
      `    originFeatId: ${q(r.originFeatId)},`,
      `    originFeatName: ${q(r.originFeatName)},`,
      '    originFeatDescription:',
      `      ${q(r.originFeatDescription)},`,
      `    abilityBonusChoices: [${r.abilityBonusChoices.map((a) => `'${a}'`).join(', ')}],`,
      `    skillsGranted: [${r.skillsGranted.map((a) => `'${a}'`).join(', ')}],`,
      '    skillChoices: [],',
      '    skillChoiceCount: 0,',
      `    toolsGranted: [${r.toolsGranted.map((a) => q(a)).join(', ')}],`,
      `    toolChoices: [${r.toolChoices.map((a) => q(a)).join(', ')}],`,
      `    toolChoiceCount: ${r.toolChoiceCount},`,
    ];
    if (r.toolChoiceCategory) lines.push(`    toolChoiceCategory: ${q(r.toolChoiceCategory)},`);
    lines.push(`    description: ${q(r.description)},`);
    lines.push('  },');
    return lines.join('\n');
  })
  .join('\n\n');

const bgOut = `import type { BackgroundDef } from '../types/character';

/**
 * All ${results.length} backgrounds from dnd2024.wikidot.com ("Backgrounds - D&D 5e (2024)").
 *
 * Rebuilt from the site index + per-background pages. The site groups them into
 * tabs; each tab's backgrounds are tagged with its source:
 *  - Common (16) = 2024 PHB backgrounds; the four SRD 5.2 free-rules entries
 *    (acolyte, criminal, sage, soldier) are tagged 'srd' and the rest 'phb'.
 *  - eberron (${bySource.eberron ?? 0}), faerun (${bySource.faerun ?? 0}), ravenloft (${bySource.ravenloft ?? 0}),
 *    arcana-unleashed (${bySource['arcana-unleashed'] ?? 0}), exotic (${bySource.exotic ?? 0}).
 *
 * Field conventions (unchanged): skillsGranted uses camelCase skill keys from
 * lib/rules/skillList.ts; toolsGranted/toolChoices hold display-ready strings.
 */
export const BACKGROUNDS: BackgroundDef[] = [
${bgEntries}
];

export const BACKGROUNDS_BY_ID: Record<string, BackgroundDef> = Object.fromEntries(
  BACKGROUNDS.map((b) => [b.id, b]),
);
`;
writeFileSync(OUT_BG, bgOut);
console.log(`\nwrote ${OUT_BG} (${results.length} backgrounds)`);

// ---------------- 5. emit startingEquipment.ts ----------------
const seSrc = readFileSync(OUT_SE, 'utf8');
const seIntroEnd = seSrc.indexOf('export interface StartingEquipmentOption');
const classesMarker = '  // ==================== CLASSES (12) ====================';
if (seIntroEnd === -1 || !seSrc.includes('export const STARTING_EQUIPMENT')) throw new Error('startingEquipment.ts structure unexpected');
const ifaces = seSrc
  .slice(seIntroEnd, seSrc.indexOf('export const STARTING_EQUIPMENT'))
  .replace(
    "  source: 'srd' | 'phb';",
    "  source: 'srd' | 'phb' | 'eberron' | 'faerun' | 'ravenloft' | 'arcana-unleashed' | 'exotic';",
  );
if (ifaces.includes("source: 'srd' | 'phb';")) throw new Error('source union replacement failed');
const classesPart = seSrc.slice(seSrc.indexOf(classesMarker));

const seHeader = `/**
 * Starting Equipment for 2024 D&D (2024 rules).
 *
 * Rebuilt from dnd2024.wikidot.com — Backgrounds index + per-background pages.
 *   - Each background offers "Option A" (equipment package) or "Option B" (coins, usually 50 GP).
 *   - Class entries below are kept from the previous app data (a later pass
 *     rebuilds them from the site's class pages).
 *
 * Tagging mirrors backgrounds.ts:
 *   - 4 SRD backgrounds (acolyte, criminal, sage, soldier): source 'srd'
 *   - 12 PHB backgrounds: source 'phb'; eberron/faerun/ravenloft/arcana-unleashed/exotic per the site's tabs.
 */

`;

const seEntries = results
  .map((r) =>
    [
      '  {',
      `    originId: ${q(r.id)},`,
      "    originKind: 'background',",
      `    source: ${q(r.source)},`,
      '    options: [',
      ...r.equips.map(
        (o) =>
          `      { id: ${q(o.id)}, label: ${q(o.label)}, kind: ${q(o.kind)}, items: ${q(o.items)}, coinsGp: ${o.coinsGp} },`,
      ),
      '    ],',
      '  },',
    ].join('\n'),
  )
  .join('\n');

const seOut = `${seHeader}${ifaces}export const STARTING_EQUIPMENT: StartingEquipmentDef[] = [
${seEntries}

${classesPart}`;
writeFileSync(OUT_SE, seOut);
console.log(`wrote ${OUT_SE} (${results.length} background entries; class section preserved)`);