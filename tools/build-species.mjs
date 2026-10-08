/**
 * Rebuild src/data/species.ts (25 species) + src/data/lineages.ts (10 lineages)
 * strictly from the dnd2024.wikidot.com "Species - D&D 5e (2024)" index + cached
 * per-species pages in .species-cache/.
 *
 * Usage: node tools/build-species.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const INDEX = join(ROOT, 'reference', 'DND website', 'Species - D&D 5e (2024).html');
const CACHE = join(ROOT, '.species-cache');
const OUT_SPECIES = join(ROOT, 'src/data/species.ts');
const OUT_LINEAGES = join(ROOT, 'src/data/lineages.ts');
const SPELLS_DIR = join(ROOT, 'src/data');
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

const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const spellLinks = (html) =>
  [...html.matchAll(/<a href="\/spell:([^"]+)">([^<]+)<\/a>/g)].map((m) => ({ id: m[1], name: clean(m[2]) }));

async function fetchPage(slug) {
  const url = `https://dnd2024.wikidot.com/species:${slug}`;
  console.log(`  fetching ${url}`);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; data-builder/1.0)' } });
  if (!res.ok) throw new Error(`fetch failed ${res.status} for ${url}`);
  const html = await res.text();
  if (!existsSync(CACHE)) mkdirSync(CACHE);
  writeFileSync(join(CACHE, slug + '.html'), html);
  await new Promise((r) => setTimeout(r, 150));
  return html;
}

// ---------------- 1. index ----------------
// The species index embeds tabview-min.js INSIDE page-content, so slice to EOF
// (same trap as the backgrounds index).
const indexHtml = readFileSync(INDEX, 'utf8');
const indexBody = indexHtml.slice(indexHtml.indexOf('<div id="page-content">'));
const nav = indexBody.match(/<ul class="yui-nav">([\s\S]*?)<\/ul>/);
const labels = nav ? [...nav[1].matchAll(/<em>([^<]+)<\/em>/g)].map((m) => m[1].trim()) : [];
const chunks = indexBody.split('<div id="wiki-tab-0-').slice(1);
const rows = [];
for (const [i, chunk] of chunks.entries()) {
  const group = labels[i] ?? `tab-${i}`;
  for (const m of chunk.matchAll(/<a href="\/species:([^"]+)">([^<]+)<\/a>/g)) {
    rows.push({ slug: m[1], name: clean(m[2]), group });
  }
}
console.log(`index: ${chunks.length} tab(s): ${labels.join(' / ')}`);
for (const [i, g] of chunks.entries()) {
  const n = [...g.matchAll(/<a href="\/species:/g)].length;
  console.log(`  tab ${labels[i]}: ${n} row(s)`);
}

// Dedupe (the Exotic tab repeats Dhampir); keep first occurrence.
const seen = new Set();
const species = [];
for (const r of rows) {
  if (seen.has(r.slug)) {
    console.log(`  (dedupe) ${r.slug} listed again under "${r.group}"`);
    continue;
  }
  seen.add(r.slug);
  species.push(r);
}
console.log(`unique species: ${species.length}`);

// ---------------- 2. per-page parse ----------------
const problems = [];
const resolveSet = new Set();
const speciesDefs = [];
const lineageRows = []; // { species, name, level1Html, level3Html, level5Html } from tables
const gnomeLineages = []; // { name, html }
const grantTraits = []; // { species, name, html } species-wide cantrip traits

for (const { slug, name } of species) {
  const fp = join(CACHE, slug + '.html');
  let page = existsSync(fp) ? readFileSync(fp, 'utf8') : await fetchPage(slug);
  const body = pageBody(page);

  // --- flavour: ps before the first h3/h4/h5 heading ---
  const firstHeading = body.search(/<h[3-5][^>]*>/);
  const headRegion = firstHeading === -1 ? body : body.slice(0, firstHeading);
  const flavourPs = paragraphs(headRegion).filter((p) => !/^Source\s*:/.test(clean(p)));
  const description = clean(flavourPs.join(' '));
  if (!description) problems.push(`${slug}: no flavour description`);

  // --- stats: leading ps right after the Traits heading (3 markup variants) ---
  // traitsH can be h1..h6 (aasimar uses h1), with optional <strong> inside the
  // span (hexblood/lupin/reborn). The traits region is bounded at the NEXT
  // heading so later lore sections (halfling Kithkin, elf Elven Lineages,
  // dragonborn Draconic Ancestors) never bleed into trait parsing.
  const traitsH = body.search(/<h[1-6][^>]*>\s*<span>(?:<[^>]+>)*[^<]*?Traits[\s\S]*?<\/span>\s*<\/h[1-6]>/i);
  if (traitsH === -1) problems.push(`${slug}: no Traits heading`);
  let regionEnd = body.length;
  if (traitsH !== -1) {
    const after = body.slice(traitsH + 1);
    const nextH = after.search(/<h[1-6][^>]*>/);
    if (nextH !== -1) regionEnd = traitsH + 1 + nextH;
  }
  const ps = traitsH === -1 ? [] : paragraphs(body.slice(traitsH, regionEnd));
  const statPs = ps.filter((p) => /^(Creature Type|Size|Speed)[:.]/.test(clean(p)));
  const statsText = clean(statPs.join(' '));
  // size value runs to the next label; lazy so "or Small (…), chosen when you
  // select this species" keeps its flexible text for normalization.
  const sizeRaw = statsText.match(/Size[:.]\s*([\s\S]+?)\s*(?=Speed\s*[:.]|$)/i)?.[1]?.trim() ?? '';
  const speedM = statsText.match(/Speed[:.]\s*[^0-9]*?(\d+)\s*(?:feet|ft)/i);
  let size = '';
  if (/or\s+Small/i.test(sizeRaw)) size = 'Small or Medium';
  else if (/Small\b/.test(sizeRaw)) size = 'Small'; // covers "You are Small (…)"
  else if (/^Medium\b/.test(sizeRaw)) size = 'Medium';
  else if (/Large/.test(sizeRaw)) size = 'Large';
  else problems.push(`${slug}: UNKNOWN size "${sizeRaw}"`);
  if (!speedM) problems.push(`${slug}: no Speed found (stats: "${statsText}")`);
  const speed = speedM ? parseInt(speedM[1], 10) : 0;

  // --- traits ---
  const traits = [];
  let cur = null;
  for (const p of ps) {
    const c = clean(p);
    if (/^(Creature Type|Size|Speed)[:.]/.test(c)) continue; // stats ps
    if (/^As an?\s/i.test(c) && /special traits/.test(c)) continue; // lead-in p
    // paragraphs() returns the p's INNER html, so the opener regex starts at
    // <strong>, not <p>.
    const m = p.match(/^<strong>([^<]+?)\.<\/strong>/);
    if (m) {
      const tname = clean(m[1]);
      if (slug === 'gnome' && (tname === 'Forest Gnome' || tname === 'Rock Gnome')) {
        // these are lineage options, not traits
        gnomeLineages.push({ species: slug, name: tname, html: p });
        continue;
      }
      cur = { name: tname, description: clean(p.slice(m[0].length)), html: p };
      traits.push(cur);
    } else if (cur) {
      cur.description = cur.description + ' ' + c;
      cur.html = cur.html + ' ' + p;
    }
  }

  const featLevels = /Origin feat/.test(body) ? [1] : undefined;
  const hasLineageTable = /<th[^>]*>\s*(?:Lineage|Legacy)\s*<\/th>/.test(body);
  // Species-wide cantrip grant, independent of any lineage table (tiefling has
  // both: Otherworldly Presence -> Thaumaturgy plus its Fiendish Legacy table).
  const grantTrait = traits.find((t) => /You know the .*cantrip/.test(t.description));
  if (grantTrait && slug !== 'gnome') {
    grantTraits.push({ species: slug, name: grantTrait.name, html: grantTrait.html ?? '' });
  }

  if (hasLineageTable) {
    // capture ONLY the table whose header contains Lineage/Legacy (dragonborn's
    // "Draconic Ancestors" table is Dragon/Damage Type and must be ignored)
    const tables = [...body.matchAll(/<table class="wiki-content-table">([\s\S]*?)<\/table>/g)];
    const tableM = tables.find((t) => /<th[^>]*>\s*(?:Lineage|Legacy)\s*<\/th>/.test(t[1]));
    if (!tableM) {
      problems.push(`${slug}: lineage headers found but no lineage table`);
    } else {
      const rowMs = [...tableM[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].slice(1); // skip header
      for (const [ri, rm] of rowMs.entries()) {
        const cells = [...rm[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map((x) => x[1]);
        if (cells.length < 4) {
          problems.push(`${slug}: lineage row ${ri} has ${cells.length} cells`);
          continue;
        }
        const lname = clean(cells[0]);
        const l1 = cells[1];
        const l3 = cells[2];
        const l5 = cells[3];
        lineageRows.push({ species: slug, name: lname, l1, l3, l5 });
        // remember new lineage spell ids for resolution check
        for (const sp of spellLinks(l1)) resolveSet.add(sp.id);
        for (const sp of spellLinks(l3)) resolveSet.add(sp.id);
        for (const sp of spellLinks(l5)) resolveSet.add(sp.id);
      }
    }
  }

  // species-wide spell grants (cantrip at 0, optional 3/5)
  for (const g of grantTraits.filter((g) => g.species === slug)) {
    const links = spellLinks(g.html);
    if (links[0]) {
      resolveSet.add(links[0].id);
      const grants = [{ atLevel: 0, spellId: links[0].id }];
      const m3 = g.html.match(/Starting at 3rd level[^<]*<a href="\/spell:([^"]+)"/);
      const m5 = g.html.match(/Starting at 5th level[^<]*<a href="\/spell:([^"]+)"/);
      const mr = g.html.match(/you learn the\s*<a href="\/spell:([^"]+)">[^<]+<\/a> spell and the\s*<a href="\/spell:([^"]+)">[^<]+<\/a> spell, respectively/i);
      if (m3) { resolveSet.add(m3[1]); grants.push({ atLevel: 3, spellId: m3[1] }); }
      if (m5) { resolveSet.add(m5[1]); grants.push({ atLevel: 5, spellId: m5[1] }); }
      if (mr) { resolveSet.add(mr[1]); resolveSet.add(mr[2]); grants.push({ atLevel: 3, spellId: mr[1] }); grants.push({ atLevel: 5, spellId: mr[2] }); }
      grantTraits.__grants = grantTraits.__grants ?? {};
      grantTraits.__grants[slug] = grants;
    }
  }

  speciesDefs.push({ id: slug, name, size, speed, traits, featLevels, description });
  console.log(
    `${slug}: size="${sizeRaw}" -> ${size || '?'}, speed=${speedM ? speedM[1] : '?'}, traits=${traits.length}, ` +
      `lineageTable=${hasLineageTable}, featLevels=${featLevels ? '[1]' : 'none'}, flavour=${flavourPs.length} p`,
  );
}

// gnome lineage grants: every spell link at level 0
for (const gl of gnomeLineages) {
  for (const sp of spellLinks(gl.html)) resolveSet.add(sp.id);
}

// ---------------- 3. spell resolution check ----------------
// Catalog lives in src/data/spells.ts + spells-cantrips.ts + spells-l1..l9.ts.
const spellIds = new Set();
for (const f of readdirSync(SPELLS_DIR).filter((f) => /^spells.*\.ts$/.test(f))) {
  for (const m of readFileSync(join(SPELLS_DIR, f), 'utf8').matchAll(/id\s*:\s*'([^']+)'/g)) spellIds.add(m[1]);
}
const unresolved = [...resolveSet].filter((id) => !spellIds.has(id));
console.log(`\nspell resolution: ${resolveSet.size} id(s), ${unresolved.length} NOT in catalog: ${unresolved.join(', ') || '(none)'}`);

// ---------------- 4. report ----------------
if (problems.length) {
  console.error('\nproblems:\n  ' + problems.join('\n  '));
  console.error(`\nABORT: ${problems.length} problem(s)`);
  process.exit(1);
}
if (unresolved.length) {
  console.error(`\nABORT: ${unresolved.length} grant spell id(s) missing from catalog`);
  process.exit(1);
}
if (DRY) {
  console.log('\n--- DRY RUN (not writing) ---');
  console.log('gnome lineages:', gnomeLineages.map((g) => g.name).join(', '));
  console.log('table lineages:', lineageRows.map((r) => `${r.species}:${r.name}`).join(', '));
  console.log('species-wide grants:', Object.entries(grantTraits.__grants ?? {}).map(([s, g]) => `${s}=${g.map((x) => `${x.spellId}@${x.atLevel}`).join(',')}`).join(' | '));
  process.exit(0);
}

// ---------------- 5. emit species.ts ----------------
const speciesEntries = speciesDefs
  .map((s) => {
    const lines = [
      '  {',
      `    id: ${q(s.id)},`,
      `    name: ${q(s.name)},`,
      `    size: ${q(s.size)},`,
      `    speed: ${s.speed},`,
      '    abilityBonuses: {},',
      '    traits: [',
      ...s.traits.map((t) => `      { name: ${q(t.name)}, description: ${q(t.description)} },`),
      '    ],',
    ];
    if (s.featLevels) lines.push('    featLevels: [1],');
    lines.push(`    description: ${q(s.description)},`);
    lines.push('  },');
    return lines.join('\n');
  })
  .join('\n\n');

const speciesOut = `import type { SpeciesDef } from '../types/character';

/**
 * All ${speciesDefs.length} species from dnd2024.wikidot.com ("Species - D&D 5e (2024)").
 *
 * Rebuilt from the site index + per-species pages. Tabs: Common (10), Eberron (5),
 * Lorwyn (5), Ravenloft (4), Exotic (2, incl. a site-side duplicate Dhampir row; the
 * only new entry there is Duskling).
 *
 * 2024 rules: a species grants traits, size and speed only — ability-score
 * increases come from the Background. The site's verbose size text ("Medium
 * (about 4–7 feet tall) or Small (about 2–4 feet tall), chosen when you select
 * this species") is normalized onto the four CreatureSize values.
 *
 * Only Human grants an Origin feat, so only it carries featLevels: [1].
 */
export const SPECIES: SpeciesDef[] = [
${speciesEntries}
];

export const SPECIES_BY_ID: Record<string, SpeciesDef> = Object.fromEntries(
  SPECIES.map((s) => [s.id, s]),
);
`;
writeFileSync(OUT_SPECIES, speciesOut);
console.log(`\nwrote ${OUT_SPECIES} (${speciesDefs.length} species)`);

// ---------------- 6. emit lineages.ts ----------------
const grants = grantTraits.__grants ?? {};
const grantsEntries = Object.entries(grants)
  .map(([sp, gs]) => `  ${q(sp)}: [${gs.map((g) => `{ atLevel: ${g.atLevel}, spellId: ${q(g.spellId)} }`).join(', ')}],`)
  .join('\n');

const lineageDefs = [];
for (const r of lineageRows) {
  const links1 = spellLinks(r.l1);
  const links3 = spellLinks(r.l3);
  const links5 = spellLinks(r.l5);
  const grantsArr = [];
  if (links1[0]) grantsArr.push({ atLevel: 0, spellId: links1[0].id });
  if (links3[0]) grantsArr.push({ atLevel: 3, spellId: links3[0].id });
  if (links5[0]) grantsArr.push({ atLevel: 5, spellId: links5[0].id });
  if (links1.length === 0 || links3.length === 0 || links5.length === 0) {
    console.error(`\nABORT: lineage ${r.species}:${r.name} is missing a level grant`);
    process.exit(1);
  }
  const bonus = clean(r.l1);
  lineageDefs.push({
    id: `${r.species}-${kebab(r.name)}`,
    speciesId: r.species,
    name: r.name,
    summary: bonus,
    grantsArr,
    bonus,
  });
}
for (const gl of gnomeLineages) {
  const gs = spellLinks(gl.html).map((sp) => ({ atLevel: 0, spellId: sp.id }));
  const bonus = clean(gl.html);
  lineageDefs.push({
    id: `${gl.species}-${kebab(gl.name)}`,
    speciesId: gl.species,
    name: gl.name,
    summary: bonus,
    grantsArr: gs,
    bonus,
  });
}

const lineageSrc = `import type { AbilityKey, SpeciesLineageId } from '../types/character';

/**
 * 2024 species lineages that grant spells, rebuilt from dnd2024.wikidot.com.
 *
 * Elf, Gnome and Tiefling pick one lineage instead of a single fixed list. The
 * choice is permanent and does three things:
 *
 *  - grants a signature cantrip immediately
 *  - (Elf/Tiefling) grants another spell at level 3 and one more at level 5
 *  - lets the player choose their spellcasting ability (Int, Wis or Cha)
 *
 * Lineage spells are always prepared. Each can be cast once without a spell
 * slot, and that ability is regained on a Long Rest. They can also be cast
 * using spell slots of the appropriate level.
 *
 * Elf gained two lineages on the site: Lorwyn Elf and Shadowmoor Elf. Gnome's
 * lineages are bullet options (both spells at level 0), not a table.
 */

/**
 * Spells a species grants to every member, independent of any lineage choice.
 *
 * Rebuilt from the site: Tiefling (Thaumaturgy), Aasimar (Light), plus species
 * from the Lorwyn and neighbours pages whose cantrip/level spells are not a
 * choice: Rimekin, Flamekin, Faerie, Khoravar. (Valen is not a species on the
 * site and was removed.)
 *
 * Keyed by SpeciesDef.id.
 */
export const SPECIES_SPELL_GRANTS: Record<string, LineageGrant[]> = {
${grantsEntries}
};

/**
 * Every species-wide spell a character has at a given level, oldest level first.
 *
 * Modelled on \`lineageSpellsUpTo\`: same return shape, same "skip unresolvable
 * ids rather than emit a dangling id" behaviour, same early returns.
 * Species-wide grants are a pure function of (speciesId, characterLevel) and
 * require no persistence — unlike lineageSpellIds, which is stored because
 * level-up writes it.
 */
export function speciesSpellGrantsUpTo(
  speciesId: string | undefined,
  characterLevel: number,
  resolve: (spellId: string) => { name: string; level: number } | null,
): { spellId: string; name: string; level: number; grantedAt: number }[] {
  if (!speciesId) return [];
  const grants = SPECIES_SPELL_GRANTS[speciesId];
  if (!grants) return [];
  return grants
    .filter((g) => g.atLevel <= characterLevel)
    .map((g) => ({ spellId: g.spellId, grantedAt: g.atLevel, ...resolve(g.spellId) }))
    .filter((g): g is { spellId: string; name: string; level: number; grantedAt: number } => g.name != null);
}

export interface LineageGrant {
  /** Character level at which this spell is added. Cantrips are level 0. */
  atLevel: number;
  /** The spell's id in \`src/data/spells-*.ts\`. */
  spellId: string;
}

export interface SpeciesLineageDef {
  id: SpeciesLineageId;
  /** The species this lineage belongs to, matching \`SpeciesDef.id\`. */
  speciesId: string;
  name: string;
  summary: string;
  /** Signature cantrip plus the level 3 and 5 grants. */
  grants: LineageGrant[];
  /**
   * 2024 lets these species use Int, Wis or Cha for lineage spells. The player
   * picks one; it does not have to match the class casting ability.
   */
  spellcastingAbilityOptions: AbilityKey[];
  /** Extra trait text shown on the sheet alongside the spells. */
  bonusTrait?: string;
}

export const SPECIES_LINEAGES: SpeciesLineageDef[] = [
${lineageDefs
  .map((l) =>
    [
      '  {',
      `    id: '${l.id}',`,
      `    speciesId: '${l.speciesId}',`,
      `    name: ${q(l.name)},`,
      `    summary: ${q(l.summary)},`,
      `    grants: [${l.grantsArr.map((g) => `{ atLevel: ${g.atLevel}, spellId: '${g.spellId}' }`).join(', ')}],`,
      "    spellcastingAbilityOptions: ['int', 'wis', 'cha'],",
      `    bonusTrait: ${q(l.bonus)},`,
      '  },',
    ].join('\n'),
  )
  .join('\n')}
];

export const LINEAGES_BY_ID: Record<string, SpeciesLineageDef> = Object.fromEntries(
  SPECIES_LINEAGES.map((l) => [l.id, l]),
);

/** The lineages a given species offers, in display order. */
export function lineagesForSpecies(speciesId: string): SpeciesLineageDef[] {
  return SPECIES_LINEAGES.filter((l) => l.speciesId === speciesId);
}

/**
 * Every lineage spell a character has at a given level, oldest level first.
 *
 * Returns grant plus resolved spell so callers do not have to join twice.
 * Spells the catalog does not contain are skipped rather than emitted with a
 * dangling id, so a bad reference degrades quietly instead of crashing.
 */
export function lineageSpellsUpTo(
  lineageId: string | undefined,
  characterLevel: number,
  resolve: (spellId: string) => { name: string; level: number } | null,
): { spellId: string; name: string; level: number; grantedAt: number }[] {
  if (!lineageId) return [];
  const lineage = LINEAGES_BY_ID[lineageId];
  if (!lineage) return [];
  return lineage.grants
    .filter((g) => g.atLevel <= characterLevel)
    .map((g) => ({ spellId: g.spellId, grantedAt: g.atLevel, ...resolve(g.spellId) }))
    .filter((g): g is { spellId: string; name: string; level: number; grantedAt: number } => g.name != null);
}

/** The spell ids granted exactly on reaching \`newLevel\`, for level-up prompts. */
export function lineageGrantsAtLevel(lineageId: string | undefined, newLevel: number): string[] {
  if (!lineageId) return [];
  const lineage = LINEAGES_BY_ID[lineageId];
  if (!lineage) return [];
  return lineage.grants.filter((g) => g.atLevel === newLevel).map((g) => g.spellId);
}
`;
writeFileSync(OUT_LINEAGES, lineageSrc);
console.log(`wrote ${OUT_LINEAGES} (${lineageDefs.length} lineages)`);
console.log('lineages: ' + lineageDefs.map((l) => l.id).join(', '));
console.log('species-wide grants written: ' + grantsEntries.replace(/\n/g, ' '));