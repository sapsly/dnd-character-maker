/**
 * Starting Equipment for 2024 D&D (PHB + SRD).
 *
 * Source: D&D Beyond 2024 Basic Rules — Character Classes + Character Origins.
 *   - Backgrounds: Each offers "Option A" (equipment package) or "Option B" (50 GP).
 *     The 50 GP alternative is universal across all 16 backgrounds.
 *   - Classes: Each offers equipment packages (A/B, or A/B/C for Fighter) with
 *     class-specific gold amounts for the coins option.
 *
 * Tagging:
 *   - 4 SRD backgrounds (acolyte, criminal, sage, soldier): source: 'srd'
 *   - 12 PHB backgrounds: source: 'phb'
 *   - All 12 classes: source: 'phb' (class tables are PHB; even where SRD repeats
 *     them, we mark PHB unless certain it's SRD-verified).
 */

export interface StartingEquipmentOption {
  id: string;              // e.g. 'a', 'b', 'c'
  label: string;           // 'Option A' | 'Option B' | 'Option C'
  kind: 'package' | 'coins';
  /** Verbatim human-readable contents for a package, or '' for coins. */
  items: string;           // e.g. "Calligrapher's Supplies, Book (prayers), ..., 8 GP"
  /** Coins granted for a 'coins' option, in GP (e.g. 50). 0 for packages. */
  coinsGp: number;
}

export interface StartingEquipmentDef {
  originId: string;        // background id or class id
  originKind: 'background' | 'class';
  options: StartingEquipmentOption[];   // 2 for most, 3 for fighter
  source: 'srd' | 'phb';
}

export const STARTING_EQUIPMENT: StartingEquipmentDef[] = [
  // ==================== BACKGROUNDS (16) ====================

  // Acolyte (SRD)
  {
    originId: 'acolyte',
    originKind: 'background',
    source: 'srd',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Calligrapher's Supplies, Book (prayers), Holy Symbol, Parchment (10 sheets), Robe, 8 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Artisan (PHB)
  {
    originId: 'artisan',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Artisan's Tools, 2 Pouches, Traveler's Clothes, 32 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Charlatan (PHB)
  {
    originId: 'charlatan',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Forgery Kit, Costume, Fine Clothes, 15 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Criminal (SRD)
  {
    originId: 'criminal',
    originKind: 'background',
    source: 'srd',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "2 Daggers, Thieves' Tools, Crowbar, 2 Pouches, Traveler's Clothes, 16 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Entertainer (PHB)
  {
    originId: 'entertainer',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Musical Instrument, 2 Costumes, Mirror, Perfume, Traveler's Clothes, 11 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Farmer (PHB)
  {
    originId: 'farmer',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Sickle, Carpenter's Tools, Healer's Kit, Iron Pot, Shovel, Traveler's Clothes, 30 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Guard (PHB)
  {
    originId: 'guard',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Spear, Light Crossbow, 20 Bolts, Gaming Set, Hooded Lantern, Manacles, Quiver, Traveler's Clothes, 12 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Guide (PHB)
  {
    originId: 'guide',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Shortbow, 20 Arrows, Cartographer's Tools, Bedroll, Quiver, Tent, Traveler's Clothes, 3 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Hermit (PHB)
  {
    originId: 'hermit',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Quarterstaff, Herbalism Kit, Bedroll, Book (philosophy), Lamp, Oil (3 flasks), Traveler's Clothes, 16 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Merchant (PHB)
  {
    originId: 'merchant',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Navigator's Tools, 2 Pouches, Traveler's Clothes, 22 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Noble (PHB)
  {
    originId: 'noble',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Gaming Set, Fine Clothes, Perfume, 29 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Sage (SRD)
  {
    originId: 'sage',
    originKind: 'background',
    source: 'srd',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Quarterstaff, Calligrapher's Supplies, Book (history), Parchment (8 sheets), Robe, 8 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Sailor (PHB)
  {
    originId: 'sailor',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Dagger, Navigator's Tools, Rope, Traveler's Clothes, 20 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Scribe (PHB)
  {
    originId: 'scribe',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Calligrapher's Supplies, Fine Clothes, Lamp, Oil (3 flasks), Parchment (12 sheets), 23 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Soldier (SRD)
  {
    originId: 'soldier',
    originKind: 'background',
    source: 'srd',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Spear, Shortbow, 20 Arrows, Gaming Set, Healer's Kit, Quiver, Traveler's Clothes, 14 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Wayfarer (PHB)
  {
    originId: 'wayfarer',
    originKind: 'background',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "2 Daggers, Thieves' Tools, Gaming Set, Bedroll, 2 Pouches, Traveler's Clothes, 16 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // ==================== CLASSES (12) ====================

  // Barbarian (PHB)
  {
    originId: 'barbarian',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Greataxe, 4 Handaxes, Explorer's Pack, 15 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 75,
      },
    ],
  },

  // Bard (PHB)
  {
    originId: 'bard',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Leather Armor, 2 Daggers, Musical Instrument, Entertainer's Pack, 19 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 90,
      },
    ],
  },

  // Cleric (PHB)
  {
    originId: 'cleric',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Chain Shirt, Shield, Mace, Holy Symbol, Priest's Pack, 7 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 110,
      },
    ],
  },

  // Druid (PHB)
  {
    originId: 'druid',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Leather Armor, Shield, Sickle, Druidic Focus (Quarterstaff), Explorer's Pack, Herbalism Kit, 9 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Fighter (PHB) — three options
  {
    originId: 'fighter',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Chain Mail, Greatsword, Flail, 8 Javelins, Dungeoneer's Pack, 4 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'package',
        items: "Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Dungeoneer's Pack, 11 GP",
        coinsGp: 0,
      },
      {
        id: 'c',
        label: 'Option C',
        kind: 'coins',
        items: '',
        coinsGp: 155,
      },
    ],
  },

  // Monk (PHB)
  {
    originId: 'monk',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Spear, 5 Daggers, Artisan's Tools or Musical Instrument, Explorer's Pack, 11 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Paladin (PHB)
  {
    originId: 'paladin',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Chain Mail, Shield, Longsword, 6 Javelins, Holy Symbol, Priest's Pack, 9 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 150,
      },
    ],
  },

  // Ranger (PHB)
  {
    originId: 'ranger',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Druidic Focus (sprig of mistletoe), Explorer's Pack, 7 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 150,
      },
    ],
  },

  // Rogue (PHB)
  {
    originId: 'rogue',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Leather Armor, 2 Daggers, Shortsword, Shortbow, 20 Arrows, Quiver, Thieves' Tools, Burglar's Pack, 8 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 100,
      },
    ],
  },

  // Sorcerer (PHB)
  {
    originId: 'sorcerer',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Spear, 2 Daggers, Arcane Focus (crystal), Dungeoneer's Pack, 28 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 50,
      },
    ],
  },

  // Warlock (PHB)
  {
    originId: 'warlock',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "Leather Armor, Sickle, 2 Daggers, Arcane Focus (orb), Book (occult lore), Scholar's Pack, 15 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 100,
      },
    ],
  },

  // Wizard (PHB)
  {
    originId: 'wizard',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: "2 Daggers, Arcane Focus (Quarterstaff), Robe, Spellbook, Scholar's Pack, 5 GP",
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'coins',
        items: '',
        coinsGp: 55,
      },
    ],
  },
];

export const STARTING_EQUIPMENT_BY_ID: Record<string, StartingEquipmentDef> = Object.fromEntries(
  STARTING_EQUIPMENT.map((e) => [`${e.originKind}:${e.originId}`, e]),
);

/**
 * Look up starting equipment for a background or class.
 * @param originId - The background or class id (e.g., 'acolyte', 'fighter')
 * @param originKind - 'background' or 'class'
 * @returns The StartingEquipmentDef or undefined if not found
 */
export function startingEquipmentFor(originId: string, originKind: 'background' | 'class'): StartingEquipmentDef | undefined {
  return STARTING_EQUIPMENT_BY_ID[`${originKind}:${originId}`];
}

/** Coin denominations in GP for arithmetic. 1 cp = 0.01 gp, 1 sp = 0.1 gp, 1 gp = 1 gp. */
export const COIN_VALUE_GP: Record<string, number> = {
  cp: 0.01,
  sp: 0.1,
  gp: 1,
};

/** Ordered coin types for display/parsing (copper, silver, gold). */
export const COIN_TYPES = ['cp', 'sp', 'gp'] as const;