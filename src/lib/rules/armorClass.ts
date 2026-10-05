/**
 * Armor Class rules for D&D 2024 (SRD 5.2).
 *
 * Implements mutually exclusive AC formulas (never sum two; caller picks one):
 * - Unarmored: 10 + Dex
 * - Light armor: base + Dex (full Dex)
 * - Medium armor: base + Dex (Dex capped at +2)
 * - Heavy armor: base (no Dex)
 * - Shield: +2, stacks with armor and with unarmored formulas that permit it
 * - Barbarian Unarmored Defense: 10 + Dex + Con, shield allowed
 * - Monk Unarmored Defense: 10 + Dex + Wis, shield NOT allowed (wielding a shield ignores the feature)
 * - Draconic Vitality: 13 + Dex, shield allowed
 * - Defense Fighting Style: +1 AC, stacks
 *
 * Returns ArmorClassResult with readable formula string and ordered labeled breakdown.
 */

import type {
  AbilityScores,
  ArmorClassResult,
  ArmorClassBreakdown,
  CharacterCombat,
  ArmorDef,
} from '../../types/character';
import { abilityModifier } from './ability';

export type UnarmoredType = 'none' | 'barbarian' | 'monk' | 'draconic';

export interface ArmorClassInput {
  abilityScores: AbilityScores;
  combat: CharacterCombat;
  armor: ArmorDef | null;
  /** 'none' | 'barbarian' | 'monk' | 'draconic' — which unarmored defense feature is active. */
  unarmoredType: UnarmoredType;
  /** Whether the character has the Defense Fighting Style. */
  hasDefenseFightingStyle: boolean;
}

/** Compute Armor Class per 2024 rules. */
export function computeArmorClass(input: ArmorClassInput): ArmorClassResult {
  const { abilityScores, combat, armor, unarmoredType, hasDefenseFightingStyle } = input;
  const dexMod = abilityModifier(abilityScores.dex);
  const conMod = abilityModifier(abilityScores.con);
  const wisMod = abilityModifier(abilityScores.wis);

  const breakdown: ArmorClassBreakdown[] = [];
  let total = 0;
  let formulaParts: string[] = [];

  // Determine base AC formula
  if (armor && armor.category !== 'shield') {
    // Armored
    const baseAc = armor.baseAc ?? 0;
    total = baseAc;
    breakdown.push({ label: 'Armor Base', value: baseAc, note: armor.name });
    formulaParts.push(String(baseAc));

    let dexBonus = 0;
    let dexNote = '';
    if (armor.category === 'light') {
      dexBonus = dexMod;
      dexNote = `Dex (${dexMod >= 0 ? '+' : ''}${dexMod})`;
    } else if (armor.category === 'medium') {
      dexBonus = Math.min(dexMod, 2);
      dexNote = `Dex (capped at +2, ${dexMod >= 0 ? '+' : ''}${dexMod})`;
    } else if (armor.category === 'heavy') {
      dexBonus = 0;
      dexNote = 'Dex (none)';
    }
    if (dexBonus !== 0) {
      total += dexBonus;
      breakdown.push({ label: 'Dexterity', value: dexBonus, note: dexNote });
      formulaParts.push(`${dexBonus >= 0 ? '+' : ''}${dexBonus}`);
    } else {
      breakdown.push({ label: 'Dexterity', value: 0, note: dexNote });
    }
  } else {
    // Unarmored
    switch (unarmoredType) {
      case 'barbarian': {
        total = 10 + dexMod + conMod;
        breakdown.push({ label: 'Base', value: 10, note: 'Unarmored Defense (Barbarian)' });
        breakdown.push({ label: 'Dexterity', value: dexMod, note: `Dex (${dexMod >= 0 ? '+' : ''}${dexMod})` });
        breakdown.push({ label: 'Constitution', value: conMod, note: `Con (${conMod >= 0 ? '+' : ''}${conMod})` });
        formulaParts = ['10', `+${dexMod >= 0 ? '+' : ''}${dexMod}`, `+${conMod >= 0 ? '+' : ''}${conMod}`];
        break;
      }
      case 'monk': {
        total = 10 + dexMod + wisMod;
        breakdown.push({ label: 'Base', value: 10, note: 'Unarmored Defense (Monk)' });
        breakdown.push({ label: 'Dexterity', value: dexMod, note: `Dex (${dexMod >= 0 ? '+' : ''}${dexMod})` });
        breakdown.push({ label: 'Wisdom', value: wisMod, note: `Wis (${wisMod >= 0 ? '+' : ''}${wisMod})` });
        formulaParts = ['10', `+${dexMod >= 0 ? '+' : ''}${dexMod}`, `+${wisMod >= 0 ? '+' : ''}${wisMod}`];
        break;
      }
      case 'draconic': {
        total = 13 + dexMod;
        breakdown.push({ label: 'Base', value: 13, note: 'Draconic Vitality' });
        breakdown.push({ label: 'Dexterity', value: dexMod, note: `Dex (${dexMod >= 0 ? '+' : ''}${dexMod})` });
        formulaParts = ['13', `+${dexMod >= 0 ? '+' : ''}${dexMod}`];
        break;
      }
      default: {
        // Standard unarmored
        total = 10 + dexMod;
        breakdown.push({ label: 'Base', value: 10, note: 'Unarmored' });
        breakdown.push({ label: 'Dexterity', value: dexMod, note: `Dex (${dexMod >= 0 ? '+' : ''}${dexMod})` });
        formulaParts = ['10', `+${dexMod >= 0 ? '+' : ''}${dexMod}`];
      }
    }
  }

  // Shield
  if (combat.shieldEquipped) {
    // Monk unarmored defense does not allow shield
    const shieldAllowed = unarmoredType !== 'monk';
    if (shieldAllowed) {
      total += 2;
      breakdown.push({ label: 'Shield', value: 2, note: '+2 AC' });
      formulaParts.push('+2');
    } else {
      breakdown.push({ label: 'Shield', value: 0, note: 'Shield ignored (Monk Unarmored Defense)' });
    }
  }

  // Defense Fighting Style
  if (hasDefenseFightingStyle) {
    total += 1;
    breakdown.push({ label: 'Defense Fighting Style', value: 1, note: '+1 AC' });
    formulaParts.push('+1');
  }

  // Flat AC bonus
  if (combat.acBonusFlat !== 0) {
    total += combat.acBonusFlat;
    breakdown.push({ label: 'Other', value: combat.acBonusFlat, note: `${combat.acBonusFlat >= 0 ? '+' : ''}${combat.acBonusFlat}` });
    formulaParts.push(`${combat.acBonusFlat >= 0 ? '+' : ''}${combat.acBonusFlat}`);
  }

  const formula = formulaParts.join(' ');

  return { total, formula, breakdown };
}