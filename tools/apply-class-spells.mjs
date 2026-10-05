// Applies the merge planned by tools/merge-class-spells.mjs.
//
// Two jobs, both done as targeted text edits so the catalog's existing
// formatting (single-quote style, inline `components`, hand-written
// descriptions, optional `materialText`) is preserved byte-for-byte on every
// entry we do not touch:
//
//   1. UNION: for a spell already in the catalog, merge its class list.
//   2. INSERT: for a spell the catalog lacks, insert a new block into the
//      correct level file, alphabetically by name.
//
// Run only after the audit reports zero hard conflicts.
//   node tools/apply-class-spells.mjs <classId> [...classIds]
//
// Deletes nothing: the per-class input files are left in place for inspection.
import { readFileSync, writeFileSync } from 'node:fs';
import { SPELLS } from '../src/data/spells.ts';

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('usage: node tools/apply-class-spells.mjs <classId> [...classIds]');
  process.exit(2);
}

/** Level file + export name for a spell level. 0 is the cantrips file. */
const FILE_FOR_LEVEL = new Map([
  [0, { file: 'src/data/spells-cantrips.ts', name: 'SPELL_CANTRIPS' }],
  [1, { file: 'src/data/spells-l1.ts', name: 'SPELLS_L1' }],
  [2, { file: 'src/data/spells-l2.ts', name: 'SPELLS_L2' }],
  [3, { file: 'src/data/spells-l3.ts', name: 'SPELLS_L3' }],
  [4, { file: 'src/data/spells-l4.ts', name: 'SPELLS_L4' }],
  [5, { file: 'src/data/spells-l5.ts', name: 'SPELLS_L5' }],
]);

/** Single-quoted TS string literal, escaping backslashes and apostrophes. */
const lit = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** Renders a SpellDef in the same shape the existing level files use. */
function renderSpell(spell) {
  const c = spell.components ?? {};
  const componentParts = [
    `verbal: ${c.verbal === true}`,
    `somatic: ${c.somatic === true}`,
    `material: ${c.material === true}`,
  ];
  if (c.materialText) componentParts.push(`materialText: ${lit(c.materialText)}`);
  componentParts.push(`ritual: ${c.ritual === true}`);

  const lines = [
    `  {`,
    `    id: ${lit(spell.id)},`,
    `    name: ${lit(spell.name)},`,
    `    level: ${spell.level},`,
    `    school: ${lit(spell.school)},`,
    `    castingTime: ${lit(spell.castingTime)},`,
    `    range: ${lit(spell.range)},`,
    `    components: { ${componentParts.join(', ')} },`,
    `    duration: ${lit(spell.duration)},`,
    `    concentration: ${spell.concentration === true},`,
    `    classes: [${spell.classes.map(lit).join(', ')}],`,
    `    description: ${lit(spell.description)},`,
    `  },`,
  ];
  // Trailing newline matters: splitFile slices each existing block *including*
  // its trailing newline, so an inserted block without one fuses onto the next
  // `  {` and produces `  },  {`.
  return lines.join('\n') + '\n';
}

/**
 * Splits a level file into { prefix, blocks, suffix } where each block is one
 * object literal with its trailing comma. The array's closing `];` and
 * everything after it becomes the suffix.
 */
function splitFile(text) {
  const first = text.indexOf('  {\n');
  const last = text.lastIndexOf('];');
  if (first === -1 || last === -1 || last < first) {
    throw new Error('unexpected level file shape');
  }
  const prefix = text.slice(0, first);
  const body = text.slice(first, last);
  const suffix = text.slice(last);

  const blocks = [];
  let cursor = 0;
  while (cursor < body.length) {
    const start = body.indexOf('  {\n', cursor);
    if (start === -1) break;
    const next = body.indexOf('\n  },\n', start);
    if (next === -1) throw new Error('unterminated block');
    const end = next + '\n  },\n'.length;
    blocks.push(body.slice(start, end));
    cursor = end;
  }
  return { prefix, blocks, suffix };
}

const idOf = (block) => /^\s*id:\s*'([^']+)'/m.exec(block)?.[1];

// --- Collect the desired class additions, keyed by spell id -----------------
const additions = new Map(); // id -> Set of class ids
const incoming = new Map(); // id -> SpellDef

for (const classId of targets) {
  const key = classId.toUpperCase().replace(/-/g, '_');
  const mod = await import(`../src/data/spells-class-${classId}.ts`);
  const list = mod[`SPELLS_${key}`];
  if (!Array.isArray(list)) throw new Error(`no SPELLS_${key} export in ${classId} file`);
  for (const spell of list) {
    for (const cid of spell.classes) {
      if (!additions.has(spell.id)) additions.set(spell.id, new Set());
      additions.get(spell.id).add(cid);
    }
    incoming.set(spell.id, spell);
  }
}

const catalogById = new Map(SPELLS.map((s) => [s.id, s]));
let unions = 0;
let inserts = 0;
const touched = new Set();

// --- Pass 1: union class tags onto existing entries ------------------------
for (const target of FILE_FOR_LEVEL.values()) {
  const text = readFileSync(target.file, 'utf8');
  const { prefix, blocks, suffix } = splitFile(text);
  let changed = false;

  const next = blocks.map((block) => {
    const id = idOf(block);
    const add = additions.get(id);
    if (!add) return block;

    const existing = /classes:\s*\[([^\]]*)\]/m.exec(block);
    if (!existing) throw new Error(`no classes array in ${id}`);
    const current = existing[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/^'|'$/g, ''));

    const merged = [...current];
    for (const cid of add) if (!merged.includes(cid)) merged.push(cid);
    if (merged.length === current.length) return block;

    unions++;
    changed = true;
    touched.add(id);
    return block.replace(
      existing[0],
      `classes: [${merged.map(lit).join(', ')}]`,
    );
  });

  if (changed) writeFileSync(target.file, prefix + next.join('') + suffix, 'utf8');
}

// --- Pass 2: insert spells the catalog does not have ------------------------
const byLevel = new Map();
for (const [id, spell] of incoming) {
  if (catalogById.has(id)) continue;
  if (!FILE_FOR_LEVEL.has(spell.level)) {
    console.warn(`  skip ${id}: level ${spell.level} is outside the merged range`);
    continue;
  }
  if (!byLevel.has(spell.level)) byLevel.set(spell.level, []);
  byLevel.get(spell.level).push(spell);
}

for (const [level, spells] of byLevel) {
  const target = FILE_FOR_LEVEL.get(level);
  const text = readFileSync(target.file, 'utf8');
  const { prefix, blocks, suffix } = splitFile(text);

  const nameOf = (block) => /^\s*name:\s*'([^']+)'/m.exec(block)?.[1] ?? '';
  let working = [...blocks];

  for (const spell of spells) {
    // Insert before the first entry whose name sorts after this one.
    let at = working.findIndex((b) => nameOf(b).localeCompare(spell.name) > 0);
    if (at === -1) at = working.length;
    working = [...working.slice(0, at), renderSpell(spell), ...working.slice(at)];
    inserts++;
    touched.add(spell.id);
  }

  writeFileSync(target.file, prefix + working.join('') + suffix, 'utf8');
  console.log(`  ${target.file}: inserted ${spells.length}`);
}

console.log(`unions: ${unions}   inserts: ${inserts}   distinct spells touched: ${touched.size}`);