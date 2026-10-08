/**
 * Starting Equipment for 2024 D&D (2024 rules).
 *
 * Rebuilt from dnd2024.wikidot.com — Backgrounds index + per-background pages.
 *   - Each background offers "Option A" (equipment package) or "Option B" (coins, usually 50 GP).
 *   - Class entries below are kept from the previous app data (a later pass
 *     rebuilds them from the site's class pages).
 *
 * Tagging mirrors backgrounds.ts:
 *   - 4 SRD backgrounds (acolyte, criminal, sage, soldier): source 'srd'
 *   - 12 PHB backgrounds: source 'phb'; eberron/faerun/ravenloft/arcana-unleashed/exotic per the site's tabs.
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
  source: 'srd' | 'phb' | 'eberron' | 'faerun' | 'ravenloft' | 'arcana-unleashed' | 'exotic';
}

export const STARTING_EQUIPMENT: StartingEquipmentDef[] = [
  {
    originId: 'acolyte',
    originKind: 'background',
    source: 'srd',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Calligrapher\'s Supplies, Book (prayers), Holy Symbol, Parchment (10 sheets), Robe, 8 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'artisan',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Artisan\'s Tools (same as above), 2 Pouches, Traveler\'s Clothes, 32 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'charlatan',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Forgery Kit, Costume, Fine Clothes, 15 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'criminal',
    originKind: 'background',
    source: 'srd',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: '2 Daggers, Thieves\' Tools, Crowbar, 2 Pouches, Traveler\'s Clothes, 16 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'entertainer',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Musical Instrument (same as above), 2 Costumes, Mirror, Perfume, Traveler\'s Clothes, 11 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'farmer',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Sickle, Carpenter\'s Tools, Healer\'s Kit, Iron Pot, Shovel, Traveler\'s Clothes, 30 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'guard',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Spear, Light Crossbow, 20 Bolts, Gaming Set (same as above), Hooded Lantern, Manacles, Quiver, Traveler\'s Clothes, 12 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'guide',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Shortbow, 20 Arrows, Cartographer\'s Tools, Bedroll, Quiver, Tent, Traveler\'s Clothes, 3 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'hermit',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Quarterstaff, Herbalism Kit, Bedroll, Book (philosophy), Lamp, Oil (3 flasks), Traveler\'s Clothes, 16 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'merchant',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Navigator\'s Tools, 2 Pouches, Traveler\'s Clothes, 22 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'noble',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Gaming Set (same as above), Fine Clothes, Perfume, 29 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'sage',
    originKind: 'background',
    source: 'srd',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Quarterstaff, Calligrapher\'s Supplies, Book (history), Parchment (8 sheets), Robe, 8 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'sailor',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Dagger, Navigator\'s Tools, Rope, Traveler\'s Clothes, 20 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'scribe',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Calligrapher\'s Supplies, Fine Clothes, Lamp, Oil (3 flasks), Parchment (12 sheets), 23 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'soldier',
    originKind: 'background',
    source: 'srd',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Spear, Shortbow, 20 Arrows, Gaming Set (same as above), Healer\'s Kit, Quiver, Traveler\'s Clothes, 14 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'wayfarer',
    originKind: 'background',
    source: 'phb',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: '2 Daggers, Thieves\' Tools, Gaming Set (any), Bedroll, 2 Pouches, Traveler\'s Clothes, 16 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'aberrant-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Dagger, Disguise Kit, Costume, Traveler\'s Clothes, 16 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'archaeologist',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Cartographer\'s Tools, Bullseye Lantern, Map, Map or Scroll Case, Shovel, Tent, Traveler\'s Clothes, 17 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-agent',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Artisan\'s Tools (same as above), Fine Clothes, 20 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-cannith-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Artisan\'s Tools (same as above), Crowbar, Fine Clothes, 2 Pouches, 17 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-deneith-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Spear, Shortbow, 20 Arrows, Gaming Set (same as above), Fine Clothes, Healer\'s Kit, Quiver, 1 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-ghallanda-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Cook\'s Utensils, Fine Clothes, Iron Pot, Lamp, Oil (5 flasks), Perfume, 26 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-jorasco-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Herbalism Kit, Fine Clothes, Healer\'s Kit, 25 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-kundarak-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Thieves\' Tools, Fine Clothes, 10 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-lyrandar-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Navigator\'s Tools, Fine Clothes, 10 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-medani-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Disguise Kit, Fine Clothes, 10 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-orien-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Cartographer\'s Tools, Fine Clothes, Map, Map or Scroll Case, 18 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-phiarlan-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Disguise Kit, Fine Clothes, 10 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-sivis-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Calligrapher\'s Supplies, Fine Clothes, Ink, 5 Ink Pens, Paper (30 sheets), Parchment (9 sheets), 8 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-tharashk-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Gaming Set (same as above), Climber\'s Kit, Fine Clothes, Hunting Trap, Manacles, 2 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-thuranni-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Musical Instrument (same as above), Costume, Fine Clothes, 13 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'house-vadalis-heir',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Herbalism Kit, Fine Clothes, Net, 29 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'inquisitive',
    originKind: 'background',
    source: 'eberron',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Thieves\' Tools, Bullseye Lantern, Crowbar, Oil (10 flasks), Traveler\'s Clothes, 10 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'chondathan-freebooter',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Dagger, Weaver\'s Tools, Backpack, Ball Bearings, Basket, Bedroll, Bucket, Rations (3 days\' worth), Rope, Signal Whistle, Traveler\'s Clothes, 38 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'dead-magic-dweller',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Greatclub, Leatherworker\'s Tools, Bedroll, Blanket, Healer\'s Kit, Pole, Rations (3 days\' worth), Tent, Tinderbox, 5 Torches, Traveler\'s Clothes, Waterskin, 32 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'dragon-cultist',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Calligrapher\'s Supplies, Dagger, Glass Bottle, Lamp, Manacles, Oil (5 flasks), 2 Pouches, Robe, Rope, 30 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'emerald-enclave-caretaker',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Shortbow, 20 Arrows, Herbalism Kit, Bedroll, Blanket, Pouch, Tent, Traveler\'s Clothes, 13 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'flaming-fist-mercenary',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Mace, Smith\'s Tools, Fine Clothes, Manacles, Portable Ram, 4 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'genie-touched',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Light Hammer, Glassblower\'s Tools, Fine Clothes, Lamp, Oil (3 flasks), Waterskin, 2 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'harper',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Disguise Kit, Bedroll, Costume, Grappling Hook, Rope, Traveler\'s Clothes, 14 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'ice-fisher',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Woodcarver\'s Tools, Basket, Block and Tackle, Bucket, Chain, Hunting Trap, Net, Pole, Rations (3 days\' worth), Rope, Traveler\'s Clothes, 32 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'knight-of-the-gauntlet',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Spear, Smith\'s Tools, Bullseye Lantern, Holy Symbol, Manacles, Oil (5 flasks), Tinderbox, Traveler\'s Clothes, 9 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'lords-alliance-vassal',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: '2 Javelins, Calligrapher\'s Supplies, Fine Clothes, Ink, 5 Ink Pens, Parchment (9 sheets), 13 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'moonwell-pilgrim',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Quarterstaff, Painter\'s Supplies, Bedroll, Bell, Pouch, Robe, String, Traveler\'s Clothes, Waterskin, 34 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'mulhorandi-tomb-raider',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Dagger, Light Hammer, Mason\'s Tools, Backpack, Bedroll, Crowbar, Ladder, Pole, 2 Pouches, Rope, String, Tinderbox, 5 Torches, Traveler\'s Clothes, Waterskin, 26 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'mythalkeeper',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Quarterstaff, Jeweler\'s Tools, Perfume, Pouch, Robe, Shovel, String, Waterskin, 16 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'purple-dragon-squire',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Spear, Navigator\'s Tools, Fine Clothes, 9 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'rashemi-wanderer',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Cartographer\'s Tools, Backpack, Bedroll, Hooded Lantern, Oil (3 flasks), Rope, Tinderbox, Traveler\'s Clothes, Waterskin, 23 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'shadowmasters-exile',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: '2 Daggers, Thieves\' Tools, Caltrops, Costume, Grappling Hook, Iron Spikes, Mirror, 2 Pouches, Rope, Traveler\'s Clothes, 3 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'spellfire-initiate',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Gaming Set (same as above), Arcane Focus (Crystal or Wand), 2 Pouches, Traveler\'s Clothes, 36 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'zhentarim-mercenary',
    originKind: 'background',
    source: 'faerun',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Club, Dagger, Forgery Kit, Fine Clothes, Hooded Lantern, Oil (3 flasks), 2 Pouches, String, Tinderbox, 11 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'haunted-one',
    originKind: 'background',
    source: 'ravenloft',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Gaming Set (same as above), Crowbar, Holy Water (1 flask), Mirror, Oil(2 flasks), Signal Whistle, Tinderbox, Traveler\'s Clothes, 5 Torches, Waterskin, and 14 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'investigator',
    originKind: 'background',
    source: 'ravenloft',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Disguise Kit, Manacles, Shovel, Traveler\'s Clothes, 3 Vials, and 16 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'mist-wanderer',
    originKind: 'background',
    source: 'ravenloft',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Artisan\'s Tools (same as above), Lamp, Oil (5 flasks), Pouch, Rope, Tinderbox, Traveler\'s Clothes, and 30 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'spirit-medium',
    originKind: 'background',
    source: 'ravenloft',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Dagger, Gaming Set (same as above), Basket, Bell, 8 Candles, Ink, Ink Pen, Paper (5 sheets), Tinderbox, Traveler\'s Clothes, and 32 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'agent-of-the-ninth-quill',
    originKind: 'background',
    source: 'arcana-unleashed',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Dagger, Light Hammer, Thieves\' Tools, Iron Spikes, Rope, Traveler\'s Clothes, 17 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'bejeweled-conclave-spy',
    originKind: 'background',
    source: 'arcana-unleashed',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Disguise Kit, Fine Clothes, Perfume, 5 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'cosmic-dawn-experiment',
    originKind: 'background',
    source: 'arcana-unleashed',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Artisan\'s Tools (same as above), Backpack, Robe, Traveler\'s Clothes, 30 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'covenant-of-the-grave-recruit',
    originKind: 'background',
    source: 'arcana-unleashed',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Dagger, Herbalism Kit, Book (anatomy), Shovel, 16 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'crucible-storm-chaser',
    originKind: 'background',
    source: 'arcana-unleashed',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Glassblower\'s Tools, Backpack, Rope, Traveler\'s Clothes, 15 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'familiar-trainer',
    originKind: 'background',
    source: 'arcana-unleashed',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Quarterstaff, Gaming Set (same as above), Bedroll, Bell, String, Tinderbox, Traveler\'s Clothes, Waterskin, 44 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'horizon-weaver-initiate',
    originKind: 'background',
    source: 'arcana-unleashed',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Shortbow, 20 Arrows, Weaver\'s Tools, Map, Quiver, Rope, Traveler\'s Clothes, 18 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'phantasmic-circus-trouper',
    originKind: 'background',
    source: 'arcana-unleashed',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Disguise Kit, Gaming Set (any), Costume, Mirror, Traveler\'s Clothes, 12 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'seer-apprentice',
    originKind: 'background',
    source: 'arcana-unleashed',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Navigator\'s Tools, 8 Candles, Ink, Ink Pen, Parchment (9 sheets), Pouch, Tinderbox, Traveler\'s Clothes, 11 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'ward-of-the-sheltering-hands',
    originKind: 'background',
    source: 'arcana-unleashed',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Cook\'s Utensils, Blanket, Healer\'s Kit, Lamp, Oil (3 flasks), Tinderbox, Traveler\'s Clothes, Waterskin, 40 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'carouser',
    originKind: 'background',
    source: 'exotic',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Dagger, Gaming Set (same as above), Fine Clothes, Glass Bottle, Mirror, Perfume, Pouch, Tinderbox, 19 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'lorwyn-expert',
    originKind: 'background',
    source: 'exotic',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Quarterstaff, Cartographer\'s Tools, Backpack, Basket, Parchment (4 sheets), Rope, Traveler\'s Clothes, 29 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'pact-seeker',
    originKind: 'background',
    source: 'exotic',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Book, Calligrapher\'s Supplies, Ink, Ink Pen, Parchment (10 sheets), Traveler\'s Clothes, 2 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'package', items: '50 GP.', coinsGp: 0 },
    ],
  },
  {
    originId: 'shadowmoor-expert',
    originKind: 'background',
    source: 'exotic',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Dagger, Glassblower\'s Tools, Backpack, Hunting Trap, Lamp, Oil (3 flasks), Traveler\'s Clothes, Waterskin, 8 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'vampire-devotee',
    originKind: 'background',
    source: 'exotic',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Cook\'s Utensils, Fine Clothes, 2 Glass Bottles, Healer\'s Kit, Perfume, Lamp, Oil (3 flasks), Waterskin, 19 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },
  {
    originId: 'vampire-survivor',
    originKind: 'background',
    source: 'exotic',
    options: [
      { id: 'a', label: 'Option A', kind: 'package', items: 'Woodcarver\'s Tools, Crowbar, Hooded Lantern, Holy Symbol (reliquary), Holy Water, Mirror, Oil (3 flasks), Tinderbox, Traveler\'s Clothes, Waterskin, 4 GP', coinsGp: 0 },
      { id: 'b', label: 'Option B', kind: 'coins', items: '', coinsGp: 50 },
    ],
  },

  // ==================== CLASSES (13) ====================

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
        items: 'Greataxe, 4 Handaxes, Explorer\'s Pack, and 15 GP',
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
        items: 'Leather Armor, 2 Daggers, Musical Instrument of your choice, Entertainer\'s Pack, and 19 GP',
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
        items: 'Chain Shirt, Shield, Mace, Holy Symbol, Priest\'s Pack, and 7 GP',
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
        items: 'Leather Armor, Shield, Sickle, Druidic Focus (Quarterstaff), Explorer\'s Pack, Herbalism Kit, and 9 GP',
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

  // Fighter (PHB)
  {
    originId: 'fighter',
    originKind: 'class',
    source: 'phb',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: 'Chain Mail, Greatsword, Flail, 8 Javelins, Dungeoneer\'s Pack, and 4 GP',
        coinsGp: 0,
      },
      {
        id: 'b',
        label: 'Option B',
        kind: 'package',
        items: 'Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Dungeoneer\'s Pack and 11 GP',
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
        items: 'Spear, 5 Daggers, Artisan\'s Tools or Musical Instrument chosen for the tool proficiency above, Explorer\'s Pack and 11 GP',
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
        items: 'Chain Mail, Shield, Longsword, 6 Javelins, Holy Symbol, Priest\'s Pack and 9 GP',
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
        items: 'Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Druidic Focus (sprig of mistletoe), Explorer\'s Pack and 7 GP',
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
        items: 'Leather Armor, 2 Daggers, Shortsword, Shortbow, 20 Arrows, Quiver, Thieves\' Tools, Burglar\'s Pack and 8 GP',
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
        items: 'Spear, 2 Daggers, Arcane Focus (crystal), Dungeoneer\'s Pack, and 28 GP',
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
        items: 'Leather Armor, Sickle, 2 Daggers, Arcane Focus (orb), Book (occult lore), Scholar\'s Pack and 15 GP',
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
        items: '2 Daggers, Arcane Focus (Quarterstaff), Robe, Spellbook, Scholar\'s Pack, and 5 GP',
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

  // Artificer (Eberron)
  {
    originId: 'artificer',
    originKind: 'class',
    source: 'eberron',
    options: [
      {
        id: 'a',
        label: 'Option A',
        kind: 'package',
        items: 'Studded Leather Armor, Dagger, Thieves\' Tools, Tinker\'s Tools, Dungeoneer\'s Pack, and 16 GP',
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
  }
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