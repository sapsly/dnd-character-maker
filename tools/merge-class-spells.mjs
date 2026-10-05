// Audit + plan the merge of the per-class spell files into the canonical
// catalog. Report-only on purpose: the per-class files each contain their own
// copy of any spell they share, so a blind concatenation would duplicate ids
// and let three divergent copies of one spell fight over SpellDef.
//
// Run: npx tsx tools/merge-class-spells.mjs [classId ...]
//   no args -> audits every class file it can find
import { SPELLS } from "../src/data/spells.ts";
import { CLASSES } from "../src/data/classes/index.ts";

const KNOWN_CLASS_IDS = new Set(CLASSES.map((c) => c.id));

/** Every canonical level file is supposed to hold only that level. */
const expectedLevel = (id) => Number(/^spells-l(\d)$/.exec(id)?.[1]);

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error("usage: npx tsx tools/merge-class-spells.mjs <classId> [classId ...]");
  process.exit(2);
}

const canonical = new Map(SPELLS.map((s) => [s.id, s]));

let hard = 0;
let warn = 0;
const note = (msg) => console.log(`  ${msg}`);
const fail = (msg) => { console.log(`  CONFLICT ${msg}`); hard++; };
const caution = (msg) => { console.log(`  WARN ${msg}`); warn++; };

for (const classId of targets) {
  if (!KNOWN_CLASS_IDS.has(classId)) {
    console.log(`\n${classId}: unknown class id (not in CLASSES) -- skipping`);
    hard++;
    continue;
  }

  const mod = await import(`../src/data/spells-class-${classId}.ts`);
  const list = mod[`SPELLS_${classId.toUpperCase().replace(/-/g, "_")}`];
  const file = `spells-class-${classId}.ts`;

  console.log(`\n=== ${classId} (${file}) ===`);

  if (!Array.isArray(list)) {
    fail(`${file} does not export SPELLS_${classId.toUpperCase().replace(/-/g, "_")} as an array`);
    continue;
  }
  note(`roster size ${list.length}`);

  // Per-file integrity, before we care about what it says.
  const seen = new Map();
  for (const s of list) {
    if (seen.has(s.id)) fail(`${file} lists "${s.id}" twice`);
    seen.set(s.id, s);

    const want = expectedLevel(classId);
    if (!Number.isInteger(s.level) || s.level < 0 || s.level > 9) {
      fail(`${s.id} has out-of-range level ${s.level}`);
    }
    if (!KNOWN_CLASS_IDS.has(...(s.classes ?? []))) {
      fail(`${s.id} has unknown class ids [${(s.classes ?? []).filter((c) => !KNOWN_CLASS_IDS.has(c))}]`);
    }
    if (!(s.classes ?? []).includes(classId)) {
      caution(`${s.id} is in the ${classId} file but does not list "${classId}" in its classes`);
    }
    if (!s.description || s.description.trim().length < 10) {
      caution(`${s.id} has a missing/very short description`);
    }
    if (!s.name) fail(`${s.id} has no name`);
  }

  // Cross-file: same id, different metadata. Three fixers each mirrored shared
  // spells, so this is the expected failure mode, not an exotic one.
  for (const s of list) {
    const existing = canonical.get(s.id);
    if (!existing) {
      note(`NEW      ${s.id} L${s.level} "${s.name}" -- needs adding to the catalog`);
      continue;
    }
    if (existing.level !== s.level) {
      fail(`${s.id} level ${s.level} in this file but L${existing.level} in catalog`);
    }
    if (existing.name !== s.name) {
      fail(`${s.id} named "${s.name}" here but "${existing.name}" in catalog`);
    }
    if (!(existing.classes ?? []).includes(classId)) {
      note(`ADD      ${classId} -> ${s.id} (L${s.level}, already in catalog)`);
    }
    // Same id, same level+name, but the copy differs in the fields the UI shows.
    for (const field of ["school", "castingTime", "range", "duration", "concentration", "description"]) {
      const a = JSON.stringify(existing[field] ?? null);
      const b = JSON.stringify(s[field] ?? null);
      if (a !== b) caution(`${s.id} "${field}" differs from catalog -- keep the catalog copy unless this one is correct`);
    }
  }

  // Which level files would need a new entry inserted.
  const needNew = list.filter((s) => !canonical.has(s.id));
  if (needNew.length) {
    const byLevel = new Map();
    for (const s of needNew) byLevel.set(s.level, (byLevel.get(s.level) ?? 0) + 1);
    note(`new entries by level: ${[...byLevel].sort((a, b) => a[0] - b[0]).map(([l, n]) => `L${l}=${n}`).join(" ")}`);
  }
}

console.log(`\n${"=".repeat(60)}`);
console.log(`hard conflicts: ${hard}   warnings: ${warn}`);
if (hard > 0) {
  console.log("Resolve the conflicts above before merging. Do not concatenate these files as-is.");
  process.exit(1);
}
console.log("Merge plan is safe to apply: union `classes`, insert NEW entries, drop the class files.");