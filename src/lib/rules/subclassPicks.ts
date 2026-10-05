/**
 * Subclass pick plumbing.
 *
 * A subclass feature that reads "choose N of X" (Bard College of Lore's three
 * Bonus Proficiencies and its two Magical Discoveries are the two cases that
 * exist today) needs its picks stored on the class entry. `ClassEntry.featurePicks`
 * is already a generic `featureId -> picked[]` map used by class features, so
 * subclass picks reuse it instead of adding a new persisted field. That also
 * means the existing level-up pipeline — draft state, blockers, `Choice` records,
 * and the sheet's reading of picks — serves subclasses with no separate path.
 *
 * The storage key is `SubclassFeature.id` when present, otherwise a slug derived
 * from the enclosing subclass id plus the feature name. Deriving it keeps the
 * existing subclass data free of ~150 hand-written ids while staying stable
 * across saves; give a pick-granting feature an explicit `id` so its stored picks
 * survive a rename.
 */

import type { ClassDef, ClassEntry, SubclassDef, SubclassFeature } from '../../types/character';

/** Lowercase, non-alphanumerics collapsed to single dashes, trimmed. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** The `ClassEntry.featurePicks` key a subclass feature's picks are stored under. */
export function subclassFeatureKey(subclassId: string, feature: SubclassFeature): string {
  return feature.id ?? `${subclassId}-${slugify(feature.name)}`;
}

/**
 * The chosen subclass on a class def. Both arguments are optional because
 * callers resolve the class def by id and a hand-edited save can name a class
 * this build does not know.
 */
export function findSubclass(
  classDef: ClassDef | undefined,
  subclassId: string | undefined
): SubclassDef | undefined {
  if (!classDef || !subclassId) return undefined;
  return classDef.subclasses.find((s) => s.id === subclassId);
}

/**
 * Subclass features that grant picks when this class level is reached.
 *
 * Almost all of them are granted exactly at their own level. A spell pool marked
 * `replaceableEachLevel` is the exception: once unlocked it keeps offering a
 * single swap at every level after that (College of Lore's Magical Discoveries
 * can be swapped once per Bard level), so it is returned for those levels as
 * well. Only the pool is re-offered — a feature's skill or option picks are
 * never granted twice.
 */
export function subclassFeaturesGrantingAtLevel(
  subclass: SubclassDef | undefined,
  classLevel: number
): SubclassFeature[] {
  if (!subclass) return [];
  return subclass.features.filter(
    (f) =>
      f.level === classLevel ||
      (f.spellChoice?.replaceableEachLevel === true && f.level < classLevel)
  );
}

/** True when the feature offers anything the player has to choose. */
export function grantsPicks(feature: SubclassFeature): boolean {
  return Boolean(
    (feature.options && feature.options.length > 0 && feature.optionCount) ||
    (feature.skillChoices && feature.skillChoices.length > 0 && feature.skillChoiceCount) ||
    feature.spellChoice
  );
}

/**
 * How many spells a subclass spell pool asks for at this level.
 *
 * The first time the feature is gained the player fills the pool. When the
 * feature is marked `replaceableEachLevel`, every level after that offers a
 * single pick instead — the pool is already full, so one stored spell is
 * swapped out (the sheet lets the player remove any of them freely, which is the
 * same net result the rules describe).
 */
export function subclassSpellPickCount(
  subclassId: string,
  feature: SubclassFeature,
  entry: Pick<ClassEntry, 'featurePicks'>,
  newClassLevel: number
): number {
  const spec = feature.spellChoice;
  if (!spec || spec.count <= 0) return 0;

  const alreadyPicked = (entry.featurePicks[subclassFeatureKey(subclassId, feature)] ?? []).length > 0;
  if (alreadyPicked && spec.replaceableEachLevel && newClassLevel > feature.level) {
    return 1;
  }
  return spec.count;
}

/**
 * Lowest spell level a subclass pool may contain.
 *
 * Defaults to 0 because the 2024 phrasing these features use is "a cantrip or
 * a spell for which you have spell slots" — cantrips are legal choices unless a
 * feature opts out by declaring `minLevel`.
 */
export function subclassSpellMinLevel(feature: SubclassFeature): number {
  const spec = feature.spellChoice;
  return spec?.minLevel ?? 0;
}

/**
 * Highest spell slot level `classDef` offers at `classLevel`, or 0 when the
 * class has no slots at that level (a level-0 index means "level 1 slot").
 */
export function highestSpellSlotLevel(classDef: ClassDef | undefined, classLevel: number): number {
  const row = classDef?.spellcasting?.slotTable?.[classLevel];
  if (!Array.isArray(row)) return 0;
  let highest = 0;
  for (let index = 0; index < row.length; index += 1) {
    if ((row[index] ?? 0) > 0) highest = index + 1;
  }
  return highest;
}

/**
 * Highest spell level a subclass pool may contain.
 *
 * A declared `maxLevel` always wins. Otherwise the pool is capped at the
 * caster's own highest available spell slot, which is what "a spell for which
 * you have spell slots" requires — a level 6 Bard choosing Magical Discoveries
 * may take a cantrip or a level 1-3 spell, never a level 5 one.
 */
export function subclassSpellMaxLevel(
  feature: SubclassFeature,
  classDef?: ClassDef,
  classLevel?: number
): number {
  const declared = feature.spellChoice?.maxLevel;
  if (declared !== undefined) return declared;
  const slotCap = classLevel === undefined ? 0 : highestSpellSlotLevel(classDef, classLevel);
  return slotCap > 0 ? slotCap : 9;
}

/** One subclass feature's stored spell picks, resolved for display. */
export interface SubclassSpellGrant {
  subclassId: string;
  subclassName: string;
  featureId: string;
  featureName: string;
  /** Class level the feature is gained at. */
  level: number;
  /** Spell ids currently stored for this feature. */
  spellIds: string[];
  alwaysPrepared: boolean;
  /** Whether the player may still swap one of these per level gained. */
  replaceableEachLevel: boolean;
}

/**
 * Every subclass spell pool a class entry has unlocked, with its stored picks.
 *
 * The sheet uses this to list spells granted by a subclass — for example Bard
 * College of Lore's Magical Discoveries, whose spells come from the cleric,
 * druid, and wizard lists and so never appear in the class's own spell list.
 *
 * A pool only shows once the entry is actually high enough for it: College of
 * Lore grants Magical Discoveries at Bard 6, so a Bard 3 should not see it at
 * all. Stored picks are honoured regardless of level so a save from a later
 * level, or a hand-edited one, still shows what it holds.
 */
export function subclassSpellGrants(classDefs: ClassDef[], entry: ClassEntry): SubclassSpellGrant[] {
  const classDef = classDefs.find((c) => c.id === entry.classId);
  const subclass = findSubclass(classDef, entry.subclassId);
  if (!subclass) return [];

  const grants: SubclassSpellGrant[] = [];
  for (const feature of subclass.features) {
    const spec = feature.spellChoice;
    if (!spec) continue;
    const featureId = subclassFeatureKey(subclass.id, feature);
    const spellIds = entry.featurePicks[featureId] ?? [];
    if (feature.level > entry.level && spellIds.length === 0) continue;
    grants.push({
      subclassId: subclass.id,
      subclassName: subclass.name,
      featureId,
      featureName: feature.name,
      level: feature.level,
      spellIds,
      alwaysPrepared: spec.alwaysPrepared,
      replaceableEachLevel: spec.replaceableEachLevel === true,
    });
  }
  return grants;
}
