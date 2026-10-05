import { CLASSES } from "../src/data/classes/index.ts";
import { BACKGROUNDS } from "../src/data/backgrounds.ts";
import { SPECIES } from "../src/data/species.ts";
import { SKILL_DEF_MAP, SKILL_DEFS } from "../src/lib/rules/skillList.ts";

let bad = 0;
const check = (label, keys) => {
  for (const k of keys ?? []) {
    if (!SKILL_DEF_MAP.has(k)) { console.log(`  FAIL ${label}: "${k}"`); bad++; }
  }
};
for (const c of CLASSES) {
  check(`class ${c.id}.skills.granted`, c.skills?.granted);
  check(`class ${c.id}.skills.choices`, c.skills?.choices);
}
for (const b of BACKGROUNDS) {
  check(`background ${b.id}.skillsGranted`, b.skillsGranted);
  check(`background ${b.id}.skillChoices`, b.skillChoices);
}

// Every class choice pool must be a subset of the 18 standard skills, and no
// class may offer a duplicate skill (the picker would show it twice).
const all = new Set(SKILL_DEFS.map((s) => s.key));
for (const c of CLASSES) {
  const ch = c.skills?.choices ?? [];
  const dupes = ch.filter((k, i) => ch.indexOf(k) !== i);
  if (dupes.length) { console.log(`  FAIL class ${c.id} duplicate choices: ${dupes}`); bad++; }
  const missing = ch.filter((k) => !all.has(k));
  if (missing.length) { console.log(`  FAIL class ${c.id} non-standard choices: ${missing}`); bad++; }
}

console.log(`\nclasses=${CLASSES.length} backgrounds=${BACKGROUNDS.length} standardSkills=${SKILL_DEFS.length}`);
console.log(bad === 0 ? "ALL SKILL KEYS RESOLVE" : `${bad} UNRESOLVED KEY(S)`);
process.exit(bad === 0 ? 0 : 1);
