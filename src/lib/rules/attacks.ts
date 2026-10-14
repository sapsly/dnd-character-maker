/**
 * Weapon attack derivation for D&D 2024 (SRD 5.2).
 *
 * Derives the weapon attacks a character can make for display on the character sheet.
 * Pure, deterministic, and degrades gracefully with fallbacks instead of throwing.
 */

import type { Character, WeaponDef, AbilityKey } from '../../types/character';
import { WEAPONS_BY_ID } from '../../data/equipment';
import { abilityModifier, combineAbilityScores } from './ability';
import { proficiencyBonusForLevel } from './proficiency';
import { asiIncreases } from './asi';
import { SPECIES_BY_ID } from '../../data/species';
import { getClass } from '../../data/classes';

/**
 * A weapon attack ready for display on the character sheet.
 * Matches the frozen public contract exactly.
 */
export interface WeaponAttack {
  id: string;              // stable id, e.g. the weapon/inventory item id
  label: string;           // "Longsword", "Shortbow", "Unarmed Strike"
  ability: AbilityKey;     // the ability used for attack & damage
  attackBonus: number;     // signed integer: ability modifier + proficiency bonus (if proficient)
  damage: string;          // dice + ability modifier, e.g. "1d8+3", "1d8" when modifier is 0, "1d8-1" when negative
  damageType: string;      // "Slashing", "Piercing", "Bludgeoning", ...
  proficient: boolean;
  kind: 'weapon' | 'unarmed';
}

/**
 * Determine if the character is proficient with a given weapon.
 *
 * Proficiency matching rules (per spec):
 * - Class weapon proficiencies are stored as free-text strings (e.g. "Simple Weapons",
 *   "Martial Weapons", "Longsword").
 * - We match case-insensitively: a proficiency entry is considered a match for a weapon if:
 *     a) The proficiency string contains the weapon's category ("simple" or "martial") as a
 *        substring (so "Simple Weapons" covers all simple weapons, "Martial Weapons" covers
 *        all martial weapons).
 *     b) OR the proficiency string contains the weapon's name as a substring (so "Longsword"
 *        grants proficiency specifically with the Longsword).
 * - If weapon metadata is missing (unknown itemId), we cannot determine category/name and
 *   degrade gracefully to `proficient: false`.
 */
function isProficientWithWeapon(
  character: Character,
  weapon: WeaponDef,
  classDefMap: Map<string, { weaponProficiencies: string[] }>
): boolean {
  // Collect all weapon proficiency strings from all class entries
  const allProficiencies: string[] = [];
  for (const entry of character.classes) {
    const classData = classDefMap.get(entry.classId);
    if (classData?.weaponProficiencies) {
      allProficiencies.push(...classData.weaponProficiencies);
    }
  }

  if (allProficiencies.length === 0) {
    return false;
  }

  const weaponCategory = weapon.category.toLowerCase(); // "simple" | "martial"
  const weaponName = weapon.name.toLowerCase();

  for (const prof of allProficiencies) {
    const profLower = prof.toLowerCase();
    // Match by category: "Simple Weapons", "Martial Weapons", etc.
    if (profLower.includes(weaponCategory)) {
      return true;
    }
    // Match by specific weapon name
    if (profLower.includes(weaponName)) {
      return true;
    }
  }

  return false;
}

/**
 * Determine which ability a weapon uses for attack and damage.
 *
 * Rules (2024 SRD 5.2):
 * - Melee weapons: Strength
 * - Ranged weapons: Dexterity
 * - Finesse property: use the better of Strength or Dexterity
 * - Thrown property: use Strength (unless the weapon also has Finesse, then better of Str/Dex)
 *
 * WeaponDef has `ranged: boolean`. The "thrown" property is not explicitly on WeaponDef,
 * but in 2024 all thrown weapons are simple melee weapons with the Thrown property.
 * We infer thrown from: simple melee weapons that are not ranged and have "Thrown" in
 * their properties. Since WeaponDef doesn't carry properties, we check known thrown weapons
 * by id: dagger, handaxe, javelin, light-hammer, spear, dart, trident.
 *
 * For simplicity and correctness with the existing data model, we check the weapon's id
 * against the known thrown weapon IDs from the SRD.
 */
function getWeaponAbility(
  weapon: WeaponDef,
  abilityModifiers: Record<AbilityKey, number>
): AbilityKey {
  const thrownWeaponIds = new Set([
    'dagger', 'handaxe', 'javelin', 'light-hammer', 'spear',
    'dart', 'trident',
  ]);

  const isThrown = thrownWeaponIds.has(weapon.id);
  const hasFinesse = weapon.id === 'dagger' || weapon.id === 'scimitar' || weapon.id === 'shortsword' || weapon.id === 'rapier'; // known finesse weapons in our catalog

  if (weapon.ranged) {
    return 'dex';
  }

  if (hasFinesse) {
    // Finesse: use better of Str/Dex
    return abilityModifiers.str >= abilityModifiers.dex ? 'str' : 'dex';
  }

  if (isThrown) {
    // Thrown uses Strength (unless finesse, handled above)
    return 'str';
  }

  // Default melee: Strength
  return 'str';
}

/**
 * Format a damage string: dice + ability modifier.
 * Examples: "1d8+3", "1d8", "1d8-1"
 */
function formatDamage(dice: string, abilityMod: number): string {
  if (abilityMod === 0) {
    return dice;
  }
  const sign = abilityMod > 0 ? '+' : '';
  return `${dice}${sign}${abilityMod}`;
}

/**
 * Capitalize a damage type string (e.g., "slashing" -> "Slashing").
 */
function capitalizeDamageType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Derive all weapon attacks for a character.
 *
 * Iterates `character.inventory`, resolves each equipped item to a WeaponDef via
 * `WEAPONS_BY_ID`, and builds a `WeaponAttack` for each. Always appends a single
 * Unarmed Strike entry.
 *
 * Degrades gracefully:
 * - Inventory items whose `itemId` is not in `WEAPONS_BY_ID` are skipped (with a
 *   warning logged to console in development).
 * - If weapon metadata is missing, proficiency defaults to `false`.
 */
export function deriveWeaponAttacks(character: Character): WeaponAttack[] {
  // Build classDefMap for proficiency lookup
  const classDefMap = new Map<string, { weaponProficiencies: string[] }>();
  for (const entry of character.classes) {
    const classDef = getClass(entry.classId);
    if (classDef) {
      classDefMap.set(entry.classId, { weaponProficiencies: classDef.weaponProficiencies });
    }
  }

  // Compute final ability scores and modifiers using the same logic as derived.ts
  const species = SPECIES_BY_ID[character.species.speciesId];

  const speciesBonuses = species?.abilityBonuses ?? {};
  const backgroundBonuses = character.background.abilityBonuses;
  const asiBonuses = asiIncreases(character.choices);

  const combined = combineAbilityScores(
    character.abilityScoreBase,
    speciesBonuses,
    backgroundBonuses,
    asiBonuses
  );

  const abilityModifiers: Record<AbilityKey, number> = {
    str: abilityModifier(combined.abilityScores.str),
    dex: abilityModifier(combined.abilityScores.dex),
    con: abilityModifier(combined.abilityScores.con),
    int: abilityModifier(combined.abilityScores.int),
    wis: abilityModifier(combined.abilityScores.wis),
    cha: abilityModifier(combined.abilityScores.cha),
  };

  // Proficiency bonus from total character level
  const proficiencyBonus = proficiencyBonusForLevel(character.level);

  const attacks: WeaponAttack[] = [];

  // Process equipped weapons from inventory
  for (const item of character.inventory) {
    if (!item.equipped) continue;

    const weapon = WEAPONS_BY_ID[item.itemId];
    if (!weapon) {
      // Not a weapon (could be armor, gear, etc.) — skip silently
      continue;
    }

    const ability = getWeaponAbility(weapon, abilityModifiers);
    const abilityMod = abilityModifiers[ability];
    const proficient = isProficientWithWeapon(character, weapon, classDefMap);
    const attackBonus = abilityMod + (proficient ? proficiencyBonus : 0);
    const damage = formatDamage(weapon.damage, abilityMod);

    attacks.push({
      id: item.itemId,
      label: weapon.name,
      ability,
      attackBonus,
      damage,
      damageType: capitalizeDamageType(weapon.damageType),
      proficient,
      kind: 'weapon',
    });
  }

  // Always add Unarmed Strike
  const unarmedAbilityMod = abilityModifiers.str;
  const unarmedAttackBonus = unarmedAbilityMod + proficiencyBonus; // Unarmed Strike is always proficient
  const unarmedDamage = formatDamage('1', unarmedAbilityMod); // "1" + mod, e.g. "1+3" or "1-1"

  attacks.push({
    id: 'unarmed-strike',
    label: 'Unarmed Strike',
    ability: 'str',
    attackBonus: unarmedAttackBonus,
    damage: unarmedDamage,
    damageType: 'Bludgeoning',
    proficient: true,
    kind: 'unarmed',
  });

  return attacks;
}