import { BACKGROUNDS } from "../src/data/backgrounds.ts";
import { FEATS } from "../src/data/feats.ts";
import { SKILL_DEF_MAP } from "../src/lib/rules/skillList.ts";

const featIds = new Set(FEATS.map((f) => f.id));
let bad = 0;
const fail = (m) => { console.log("  FAIL " + m); bad++; };

const bySource = { srd: [], phb: [] };
for (const b of BACKGROUNDS) {
  bySource[b.source]?.push(b.id);
  if (b.abilityBonusChoices.length !== 3) fail(`${b.id}: ${b.abilityBonusChoices.length} ability choices, want 3`);
  if (b.skillsGranted.length !== 2) fail(`${b.id}: ${b.skillsGranted.length} granted skills, want 2`);
  if (b.toolsGranted.length !== 1 && b.toolChoices.length !== 1) fail(`${b.id}: expected exactly 1 tool proficiency (granted or choice)`);
  if (!b.originFeatName?.trim()) fail(`${b.id}: empty originFeatName`);
  if (!b.originFeatDescription?.trim()) fail(`${b.id}: empty originFeatDescription`);
  if (!b.description?.trim()) fail(`${b.id}: empty description`);
  for (const s of b.skillsGranted) if (!SKILL_DEF_MAP.has(s)) fail(`${b.id}: unresolved skill "${s}"`);
  if (featIds.has(b.originFeatId) && !FEATS.find((f) => f.id === b.originFeatId)) fail(`${b.id}: feat id inconsistent`);
  if ("featureName" in b || "featureDescription" in b) fail(`${b.id}: still has 2014 feature fields`);
}

const expectedSrd = ["acolyte", "criminal", "sage", "soldier"].sort();
if (JSON.stringify(bySource.srd.slice().sort()) !== JSON.stringify(expectedSrd)) fail(`SRD set = ${bySource.srd}`);
if (bySource.phb.length !== 12) fail(`PHB count = ${bySource.phb.length}, want 12`);

// Unmodelled origin feats must be covered by an inline description, since we
// deliberately did not expand the SRD feat catalog.
const unmodelled = BACKGROUNDS.filter((b) => !featIds.has(b.originFeatId)).map((b) => b.id);
const modelled = BACKGROUNDS.filter((b) => featIds.has(b.originFeatId)).map((b) => b.id);

console.log(`total=${BACKGROUNDS.length} srd=${bySource.srd.length} phb=${bySource.phb.length}`);
console.log(`SRD : ${bySource.srd.join(", ")}`);
console.log(`PHB : ${bySource.phb.join(", ")}`);
console.log(`feat in catalog      (${modelled.length}): ${modelled.join(", ")}`);
console.log(`feat inline-only (${unmodelled.length}): ${unmodelled.join(", ")}`);
console.log(bad === 0 ? "\nBACKGROUND DATA VALID" : `\n${bad} PROBLEM(S)`);
process.exit(bad === 0 ? 0 : 1);
