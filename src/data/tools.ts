import type { AbilityKey } from '../types/character';

/**
 * 2024 D&D (SRD 5.2) tool catalog.
 *
 * Sources:
 *  - 5e24srd.com (SRD 5.2 free rules)
 *  - dandwiki.com 5.2e SRD
 *  - dnd-wiki.org 5e24
 *  - Wargamer 2024 PHB tool list
 *  - D&D Beyond "The Backgrounds and Origin Feats in the 2024 Player's Handbook" (Riley Silverman, 2024-07-25)
 *
 * 2024 rule: a background grants proficiency with "one tool — either a specific tool
 * or one chosen from the Artisan's Tools category." Each Artisan's Tool is a SEPARATE
 * proficiency (17 distinct tools), not a single "Artisan's Tools" proficiency.
 * Gaming Sets and Musical Instruments are also separate proficiencies per variant.
 */

export type ToolCategory = 'artisansTools' | 'gamingSet' | 'musicalInstrument' | 'other' | 'vehicle';

export interface ToolDef {
  id: string;
  name: string;
  category: ToolCategory;
  /** Ability for checks with this tool (per 2024 PHB). Omitted when the rule is ambiguous. */
  ability?: AbilityKey;
}

/**
 * All tools in the catalog, ordered by category then name.
 */
export const TOOLS: ToolDef[] = [
  // ---- Artisan's Tools (17) ----
  // Per 2024 rules: "one tool — either a specific tool or one chosen from the Artisan's Tools category"
  // Each is a separate proficiency. Abilities vary; omitted here where 2024 does not specify a single ability.
  { id: 'alchemists-supplies', name: "Alchemist's Supplies", category: 'artisansTools' },
  { id: 'brewers-supplies', name: "Brewer's Supplies", category: 'artisansTools' },
  { id: 'calligraphers-supplies', name: "Calligrapher's Supplies", category: 'artisansTools' },
  { id: 'carpenters-tools', name: "Carpenter's Tools", category: 'artisansTools' },
  { id: 'cartographers-tools', name: "Cartographer's Tools", category: 'artisansTools' },
  { id: 'cobblers-tools', name: "Cobbler's Tools", category: 'artisansTools' },
  { id: 'cooks-utensils', name: "Cook's Utensils", category: 'artisansTools' },
  { id: 'glassblowers-tools', name: "Glassblower's Tools", category: 'artisansTools' },
  { id: 'jewelers-tools', name: "Jeweler's Tools", category: 'artisansTools' },
  { id: 'leatherworkers-tools', name: "Leatherworker's Tools", category: 'artisansTools' },
  { id: 'masons-tools', name: "Mason's Tools", category: 'artisansTools' },
  { id: 'painters-supplies', name: "Painter's Supplies", category: 'artisansTools' },
  { id: 'potters-tools', name: "Potter's Tools", category: 'artisansTools' },
  { id: 'smiths-tools', name: "Smith's Tools", category: 'artisansTools' },
  { id: 'tinkers-tools', name: "Tinker's Tools", category: 'artisansTools' },
  { id: 'weavers-tools', name: "Weaver's Tools", category: 'artisansTools' },
  { id: 'woodcarvers-tools', name: "Woodcarver's Tools", category: 'artisansTools' },

  // ---- Gaming Sets (4) ----
  // 2024 PHB: Gaming Set checks use Wisdom
  { id: 'dice', name: 'Dice', category: 'gamingSet', ability: 'wis' },
  { id: 'dragonchess', name: 'Dragonchess', category: 'gamingSet', ability: 'wis' },
  { id: 'playing-cards', name: 'Playing Cards', category: 'gamingSet', ability: 'wis' },
  { id: 'three-dragon-ante', name: 'Three-Dragon Ante', category: 'gamingSet', ability: 'wis' },

  // ---- Musical Instruments (10) ----
  // 2024 PHB: Musical Instrument checks use Charisma
  { id: 'bagpipes', name: 'Bagpipes', category: 'musicalInstrument', ability: 'cha' },
  { id: 'drum', name: 'Drum', category: 'musicalInstrument', ability: 'cha' },
  { id: 'dulcimer', name: 'Dulcimer', category: 'musicalInstrument', ability: 'cha' },
  { id: 'flute', name: 'Flute', category: 'musicalInstrument', ability: 'cha' },
  { id: 'horn', name: 'Horn', category: 'musicalInstrument', ability: 'cha' },
  { id: 'lute', name: 'Lute', category: 'musicalInstrument', ability: 'cha' },
  { id: 'lyre', name: 'Lyre', category: 'musicalInstrument', ability: 'cha' },
  { id: 'pan-flute', name: 'Pan Flute', category: 'musicalInstrument', ability: 'cha' },
  { id: 'shawm', name: 'Shawm', category: 'musicalInstrument', ability: 'cha' },
  { id: 'viol', name: 'Viol', category: 'musicalInstrument', ability: 'cha' },

  // ---- Other Tools ----
  { id: 'disguise-kit', name: 'Disguise Kit', category: 'other' },
  { id: 'forgery-kit', name: 'Forgery Kit', category: 'other' },
  { id: 'herbalism-kit', name: 'Herbalism Kit', category: 'other' },
  { id: 'navigators-tools', name: "Navigator's Tools", category: 'other' },
  { id: 'poisoners-kit', name: "Poisoner's Kit", category: 'other' },
  { id: 'thieves-tools', name: "Thieves' Tools", category: 'other' },

  // ---- Vehicles ----
  { id: 'land-vehicles', name: 'Land Vehicles', category: 'vehicle' },
  { id: 'water-vehicles', name: 'Water Vehicles', category: 'vehicle' },
  { id: 'air-vehicles', name: 'Air Vehicles', category: 'vehicle' },
];

/** Tools of a specific category, ordered by name. */
export function toolsByCategory(category: ToolCategory): ToolDef[] {
  return TOOLS.filter((t) => t.category === category).sort((a, b) => a.name.localeCompare(b.name));
}

export const ARTISAN_TOOLS = toolsByCategory('artisansTools');
export const GAMING_SETS = toolsByCategory('gamingSet');
export const MUSICAL_INSTRUMENTS = toolsByCategory('musicalInstrument');
export const OTHER_TOOLS = toolsByCategory('other');
export const VEHICLES = toolsByCategory('vehicle');

const TOOLS_BY_ID: Record<string, ToolDef> = Object.fromEntries(TOOLS.map((t) => [t.id, t]));

/** Look up a tool by its ID. */
export function getTool(id: string): ToolDef | null {
  return TOOLS_BY_ID[id] ?? null;
}