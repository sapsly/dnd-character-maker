import type { AbilityKey } from '../types/character';

/**
 * 2024 D&D tool catalog, rebuilt from the wiki tool page (PHB 2024 tables).
 *
 * 2024 rule: a background grants proficiency with "one tool — either a specific tool
 * or one chosen from the Artisan's Tools category." Each Artisan's Tool is a SEPARATE
 * proficiency (17 distinct tools), not a single "Artisan's Tools" proficiency.
 * Gaming Sets and Musical Instruments are also separate proficiencies per variant.
 * Abilities, weights and costs come from the wiki (PHB) tool tables.
 */

export type ToolCategory = 'artisansTools' | 'gamingSet' | 'musicalInstrument' | 'other' | 'vehicle';

export interface ToolDef {
  id: string;
  name: string;
  category: ToolCategory;
  /** Ability used for checks with this tool (per 2024 PHB). */
  ability?: AbilityKey;
  /** Weight in pounds (PHB). */
  weightLb?: number;
  /** Cost, e.g. '50 gp'. */
  cost?: string;
}

/**
 * All tools in the catalog, ordered by category then name.
 */
export const TOOLS: ToolDef[] = [
  // ---- Artisan's Tools (17) ----
  {
    id: 'alchemist-s-supplies',
    name: 'Alchemist\'s Supplies',
    category: 'artisansTools',
    ability: 'int',
    weightLb: 8,
    cost: '50 gp',
  },
  {
    id: 'brewer-s-supplies',
    name: 'Brewer\'s Supplies',
    category: 'artisansTools',
    ability: 'int',
    weightLb: 9,
    cost: '20 gp',
  },
  {
    id: 'calligrapher-s-supplies',
    name: 'Calligrapher\'s Supplies',
    category: 'artisansTools',
    ability: 'dex',
    weightLb: 5,
    cost: '10 gp',
  },
  {
    id: 'carpenter-s-tools',
    name: 'Carpenter\'s Tools',
    category: 'artisansTools',
    ability: 'str',
    weightLb: 6,
    cost: '8 gp',
  },
  {
    id: 'cartographer-s-tools',
    name: 'Cartographer\'s Tools',
    category: 'artisansTools',
    ability: 'wis',
    weightLb: 6,
    cost: '15 gp',
  },
  {
    id: 'cobbler-s-tools',
    name: 'Cobbler\'s Tools',
    category: 'artisansTools',
    ability: 'dex',
    weightLb: 5,
    cost: '5 gp',
  },
  {
    id: 'cook-s-utensils',
    name: 'Cook\'s Utensils',
    category: 'artisansTools',
    ability: 'wis',
    weightLb: 8,
    cost: '1 gp',
  },
  {
    id: 'glassblower-s-tools',
    name: 'Glassblower\'s Tools',
    category: 'artisansTools',
    ability: 'int',
    weightLb: 5,
    cost: '30 gp',
  },
  {
    id: 'jeweler-s-tools',
    name: 'Jeweler\'s Tools',
    category: 'artisansTools',
    ability: 'int',
    weightLb: 2,
    cost: '25 gp',
  },
  {
    id: 'leatherworker-s-tools',
    name: 'Leatherworker\'s Tools',
    category: 'artisansTools',
    ability: 'dex',
    weightLb: 5,
    cost: '5 gp',
  },
  {
    id: 'mason-s-tools',
    name: 'Mason\'s Tools',
    category: 'artisansTools',
    ability: 'str',
    weightLb: 8,
    cost: '10 gp',
  },
  {
    id: 'painter-s-supplies',
    name: 'Painter\'s Supplies',
    category: 'artisansTools',
    ability: 'wis',
    weightLb: 5,
    cost: '10 gp',
  },
  {
    id: 'potter-s-tools',
    name: 'Potter\'s Tools',
    category: 'artisansTools',
    ability: 'int',
    weightLb: 3,
    cost: '10 gp',
  },
  {
    id: 'smith-s-tools',
    name: 'Smith\'s Tools',
    category: 'artisansTools',
    ability: 'str',
    weightLb: 8,
    cost: '20 gp',
  },
  {
    id: 'tinker-s-tools',
    name: 'Tinker\'s Tools',
    category: 'artisansTools',
    ability: 'dex',
    weightLb: 10,
    cost: '50 gp',
  },
  {
    id: 'weaver-s-tools',
    name: 'Weaver\'s Tools',
    category: 'artisansTools',
    ability: 'dex',
    weightLb: 5,
    cost: '1 gp',
  },
  {
    id: 'woodcarver-s-tools',
    name: 'Woodcarver\'s Tools',
    category: 'artisansTools',
    ability: 'dex',
    weightLb: 5,
    cost: '1 gp',
  },

  // ---- Gaming Sets (4) ----
  {
    id: 'dice',
    name: 'Dice',
    category: 'gamingSet',
    ability: 'wis',
    cost: '1 sp',
  },
  {
    id: 'dragonchess',
    name: 'Dragonchess',
    category: 'gamingSet',
    ability: 'wis',
    cost: '1 gp',
  },
  {
    id: 'playing-cards',
    name: 'Playing Cards',
    category: 'gamingSet',
    ability: 'wis',
    cost: '5 sp',
  },
  {
    id: 'three-dragon-ante',
    name: 'Three-dragon Ante',
    category: 'gamingSet',
    ability: 'wis',
    cost: '1 gp',
  },

  // ---- Musical Instruments (10) ----
  {
    id: 'bagpipes',
    name: 'Bagpipes',
    category: 'musicalInstrument',
    ability: 'cha',
    weightLb: 6,
    cost: '30 gp',
  },
  {
    id: 'drum',
    name: 'Drum',
    category: 'musicalInstrument',
    ability: 'cha',
    weightLb: 3,
    cost: '6 gp',
  },
  {
    id: 'dulcimer',
    name: 'Dulcimer',
    category: 'musicalInstrument',
    ability: 'cha',
    weightLb: 10,
    cost: '25 gp',
  },
  {
    id: 'flute',
    name: 'Flute',
    category: 'musicalInstrument',
    ability: 'cha',
    weightLb: 1,
    cost: '2 gp',
  },
  {
    id: 'horn',
    name: 'Horn',
    category: 'musicalInstrument',
    ability: 'cha',
    weightLb: 2,
    cost: '3 gp',
  },
  {
    id: 'lute',
    name: 'Lute',
    category: 'musicalInstrument',
    ability: 'cha',
    weightLb: 2,
    cost: '35 gp',
  },
  {
    id: 'lyre',
    name: 'Lyre',
    category: 'musicalInstrument',
    ability: 'cha',
    weightLb: 2,
    cost: '30 gp',
  },
  {
    id: 'pan-flute',
    name: 'Pan Flute',
    category: 'musicalInstrument',
    ability: 'cha',
    weightLb: 2,
    cost: '12 gp',
  },
  {
    id: 'shawm',
    name: 'Shawm',
    category: 'musicalInstrument',
    ability: 'cha',
    weightLb: 1,
    cost: '2 gp',
  },
  {
    id: 'viol',
    name: 'Viol',
    category: 'musicalInstrument',
    ability: 'cha',
    weightLb: 1,
    cost: '30 gp',
  },

  // ---- Other Tools ----
  {
    id: 'disguise-kit',
    name: 'Disguise Kit',
    category: 'other',
    ability: 'cha',
    weightLb: 3,
    cost: '25 gp',
  },
  {
    id: 'forgery-kit',
    name: 'Forgery Kit',
    category: 'other',
    ability: 'dex',
    weightLb: 5,
    cost: '15 gp',
  },
  {
    id: 'herbalism-kit',
    name: 'Herbalism Kit',
    category: 'other',
    ability: 'int',
    weightLb: 3,
    cost: '5 gp',
  },
  {
    id: 'navigator-s-tools',
    name: 'Navigator\'s Tools',
    category: 'other',
    ability: 'wis',
    weightLb: 2,
    cost: '25 gp',
  },
  {
    id: 'poisoner-s-kit',
    name: 'Poisoner\'s Kit',
    category: 'other',
    ability: 'int',
    weightLb: 2,
    cost: '50 gp',
  },
  {
    id: 'thieves-tools',
    name: 'Thieves\' Tools',
    category: 'other',
    ability: 'dex',
    weightLb: 1,
    cost: '25 gp',
  },

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
