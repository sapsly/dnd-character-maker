// Verifies the spell catalog after a class-spell merge.
//   npx tsx tools/verify-spell-catalog.mjs
import { SPELLS } from '../src/data/spells.ts';
import { CLASSES } from '../src/data/classes/index.ts';
import {
  SPELL_CANTRIPS,
  SPELLS_L1,
  SPELLS_L2,
  SPELLS_L3,
  SPELLS_L4,
  SPELLS_L5,
  SPELLS_L6,
  SPELLS_L7,
  SPELLS_L8,
  SPELLS_L9,
} from '../src/data/spells.ts';

const knownClasses = new Set(CLASSES.map((c) => c.id));
let problems = 0;
const bad = (msg) => { console.log(`  FAIL ${msg}`); problems++; };

// 1. No duplicate ids anywhere in the assembled catalog.
const seen = new Map();
for (const spell of SPELLS) {
  if (seen.has(spell.id)) bad(`duplicate id: ${spell.id}`);
  else seen.set(spell.id, spell);
}
console.log(`total spells: ${SPELLS.length}, unique ids: ${seen.size}`);

// 2. Every level's entries all declare that level.
const buckets = [
  ['0 (cantrips)', SPELL_CANTRIPS],
  ['1', SPELLS_L1],
  ['2', SPELLS_L2],
  ['3', SPELLS_L3],
  ['4', SPELLS_L4],
  ['5', SPELLS_L5],
  ['6', SPELLS_L6],
  ['7', SPELLS_L7],
  ['8', SPELLS_L8],
  ['9', SPELLS_L9],
];
for (const [label, list] of buckets) {
  const level = Number(label[0]);
  const wrong = list.filter((s) => s.level !== level);
  if (wrong.length > 0) bad(`L${label} holds wrong-level spells: ${wrong.map((s) => `${s.id}(L${s.level})`).join(', ')}`);
  console.log(`  L${label}: ${list.length} spells`);
}

// 3. Every class tag names a real class.
for (const spell of SPELLS) {
  for (const cid of spell.classes) {
    if (!knownClasses.has(cid)) bad(`${spell.id} references unknown class "${cid}"`);
  }
}

// 4. Each level file stays alphabetically sorted by name (insertion invariant).
for (const [label, list] of buckets) {
  for (let i = 1; i < list.length; i++) {
    if (list[i - 1].name.localeCompare(list[i].name) > 0) {
      bad(`L${label} out of order: "${list[i - 1].name}" before "${list[i].name}"`);
    }
  }
}

// 5. Required fields present and non-empty on every spell.
for (const spell of SPELLS) {
  for (const field of ['id', 'name', 'school', 'castingTime', 'range', 'duration', 'description']) {
    const value = spell[field];
    if (typeof value !== 'string' || value.trim() === '') bad(`${spell.id} has empty ${field}`);
  }
  if (!Array.isArray(spell.classes) || spell.classes.length === 0) bad(`${spell.id} has no classes`);
}

console.log(problems === 0 ? '\nOK: catalog is consistent' : `\n${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);