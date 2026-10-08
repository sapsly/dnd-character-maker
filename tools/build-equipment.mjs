import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\kaieh\\Documents\\usefull\\DND Chracter maker';
const CACHE = path.join(ROOT, '.equipment-cache');
const SRC = path.join(ROOT, 'src', 'data');
const DRY = process.argv.includes('--dry');

const dec = (s) =>
  s
    .replace(/&#160;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
const clean = (s) => dec(s.replace(/<[^>]*>/g, ' '));

function parseTables(html) {
  const out = [];
  const re = /<table class="wiki-content-table">([\s\S]*?)<\/table>/g;
  let m;
  while ((m = re.exec(html))) {
    const rows = [];
    const trRe = /<tr>([\s\S]*?)<\/tr>/g;
    let tr;
    while ((tr = trRe.exec(m[1]))) {
      const thCells = [];
      const thRe = /<th>([\s\S]*?)<\/th>/g;
      let th;
      while ((th = thRe.exec(tr[1]))) thCells.push(clean(th[1]));
      if (thCells.length) {
        rows.push(thCells); // header row (kept so consumers can slice(1))
        continue;
      }
      const cells = [];
      const tdRe = /<td>([\s\S]*?)<\/td>/g;
      let td;
      while ((td = tdRe.exec(tr[1]))) cells.push(clean(td[1]));
      if (cells.length) rows.push(cells);
    }
    out.push(rows);
  }
  return out;
}

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

function parseWeight(raw) {
  const r = dec(raw);
  if (!r || r === '-' || r === 'Varies') return undefined;
  let v = r.replace(/lb\.?$/i, '').trim();
  let frac = 0;
  if (v.includes('½')) {
    frac = 0.5;
    v = v.replace('½', '');
  }
  if (v.includes('1/2')) {
    frac = 0.5;
    v = v.replace(/1\/2/, '');
  }
  const num = parseFloat(v) || 0;
  return +(num + frac);
}

function parseCost(raw) {
  const r = dec(raw);
  if (!r || r === 'Varies' || r === '-') return undefined;
  return r.toLowerCase();
}

const ABILITY_MAP = {
  Intelligence: 'int',
  Dexterity: 'dex',
  Strength: 'str',
  Wisdom: 'wis',
  Charisma: 'cha',
};

// ---------- GEAR from adventuring-gear.html ----------
const gearHtml = fs.readFileSync(path.join(CACHE, 'adventuring-gear.html'), 'utf8');
const [gearTable] = parseTables(gearHtml);
// gearTable rows: [name, weight, cost, function]

const CLOTHING_NAMES = [
  'Clothes, Fine',
  'Clothes, Traveler',
  'Costume',
  'Desert Clothing',
  'Devil Mask',
  'Garb of Light and Shadow',
  'Genie Robe',
];

function gearCategory(name) {
  if (name.includes('Pack')) return 'pack';
  if (name === 'Arcane Focus' || name === 'Druidic Focus') return 'focus';
  if (name === 'Holy Symbol') return 'holySymbol';
  if (CLOTHING_NAMES.includes(name)) return 'clothing';
  return 'adventuringGear';
}

const gearLines = gearTable.slice(1).map(([name, weight, cost, fn]) => {
  const lines = [
    `  {`,
    `    id: ${q(slug(name))},`,
    `    name: ${q(name)},`,
    `    category: ${q(gearCategory(name))},`,
  ];
  const w = parseWeight(weight);
  const c = parseCost(cost);
  if (c) lines.push(`    cost: ${q(c)},`);
  if (w !== undefined) lines.push(`    weightLb: ${w},`);
  lines.push(`    description: ${q(fn)},`);
  lines.push(`  },`);
  return lines.join('\n');
});

// Ammunition rows (from weapon.html toc4)
const weaponHtml = fs.readFileSync(path.join(CACHE, 'weapon.html'), 'utf8');
const weaponTables = parseTables(weaponHtml);
const ammoTable = weaponTables.find((t) => t.length > 0 && t[0][0] === 'Type');
const AMMO_IDS = {
  Arrows: 'arrows-20',
  Bolts: 'bolts-20',
  'Bullets, Firearm': 'bullets-firearm-10',
  'Bullets, Sling': 'bullets-sling-20',
  Needles: 'needles-50',
};
const ammoLines = (ammoTable ?? []).slice(1).map(([type, amount, storage, weight, cost]) => {
  const name = `${type} (${amount})`;
  const w = parseWeight(weight);
  const c = parseCost(cost);
  const lines = [
    `  {`,
    `    id: ${q(AMMO_IDS[type] ?? slug(type))},`,
    `    name: ${q(name)},`,
    `    category: 'adventuringGear',`,
  ];
  if (c) lines.push(`    cost: ${q(c)},`);
  if (w !== undefined) lines.push(`    weightLb: ${w},`);
  lines.push(`    description: ${q(`${amount} ${type.toLowerCase()}, stored in a ${storage.toLowerCase()}.`)},`);
  lines.push(`  },`);
  return lines.join('\n');
});

// Focus variants (from PHB 2024, supplied by user)
const FOCUS_VARIANTS = [
  ['arcane', 'Arcane Focus', [
    ['Crystal', '10 gp', 1],
    ['Orb', '20 gp', 3],
    ['Rod', '10 gp', 2],
    ['Staff', '5 gp', 4],
    ['Wand', '10 gp', 1],
  ]],
  ['druidic', 'Druidic Focus', [
    ['Sprig of Mistletoe', '1 gp', undefined],
    ['Wooden Staff', '5 gp', 4],
    ['Yew Wand', '10 gp', undefined],
  ]],
  ['holy', 'Holy Symbol', [
    ['Amulet', '5 gp', undefined],
    ['Emblem', '5 gp', undefined],
    ['Reliquary', '5 gp', undefined],
  ]],
];
const variantLines = [];
for (const [prefix, baseName, items] of FOCUS_VARIANTS) {
  for (const [variant, cost, weight] of items) {
    const lines = [
      `  {`,
      `    id: ${q(`${prefix}-focus-${slug(variant)}`).replace('druidic-focus', 'druidic-focus').replace('holy-focus-', 'holy-symbol-')},`,
      `    name: ${q(`${baseName} (${variant})`)},`,
      `    category: ${q(prefix === 'holy' ? 'holySymbol' : 'focus')},`,
      `    cost: ${q(cost)},`,
    ];
    if (weight !== undefined) lines.push(`    weightLb: ${weight},`);
    lines.push(`    description: ${q(`A ${variant.toLowerCase()} used as a ${prefix === 'holy' ? 'holy symbol spellcasting focus' : `${prefix} spellcasting focus`}.`)},`);
    lines.push(`  },`);
    variantLines.push(lines.join('\n'));
  }
}

// ---------- MOUNTS + VEHICLES from mounts-and-vehicles.html ----------
const mountsHtml = fs.readFileSync(path.join(CACHE, 'mounts-and-vehicles.html'), 'utf8');
const [mountsTable, saddlesTable, drawnTable, shipsTable, eberronTables] = parseTables(mountsHtml);

const mountLines = mountsTable.slice(1).map(([name, cap, cost]) => {
  const capLb = parseInt(dec(cap).replace(/,/g, ''), 10) || undefined;
  const lines = [`  {`, `    id: ${q(slug(name))},`, `    name: ${q(name)},`, `    cost: ${q(parseCost(cost))},`];
  if (capLb !== undefined) lines.push(`    carryingCapacityLb: ${capLb},`);
  lines.push(`  },`);
  return lines.join('\n');
});

const SADDLE_DESC = {
  Exotic: 'Required for riding an aquatic or flying mount.',
  Military: 'Gives Advantage on ability checks to remain mounted.',
  Riding: 'A standard riding saddle.',
};
const saddleLines = saddlesTable.slice(1).map(([name, weight, cost]) => {
  const lines = [
    `  {`,
    `    id: ${q(`saddle-${slug(name)}`)},`,
    `    name: ${q(`${name} Saddle`)},`,
    `    kind: 'saddle',`,
    `    cost: ${q(parseCost(cost))},`,
  ];
  const w = parseWeight(weight);
  if (w !== undefined) lines.push(`    weightLb: ${w},`);
  lines.push(`    description: ${q(SADDLE_DESC[name] ?? '')},`);
  lines.push(`  },`);
  return lines.join('\n');
});

const DRAWN_DESC = {
  'Feed per day': 'Feed for one large or smaller animal for a day.',
  'Stabling per day': 'One night of stabling for a mount.',
};
const drawnLines = drawnTable.slice(1).map(([name, weight, cost]) => {
  const lines = [
    `  {`,
    `    id: ${q(slug(name))},`,
    `    name: ${q(name)},`,
    `    kind: 'drawn',`,
    `    cost: ${q(parseCost(cost))},`,
  ];
  const w = parseWeight(weight);
  if (w !== undefined) lines.push(`    weightLb: ${w},`);
  if (DRAWN_DESC[name]) lines.push(`    description: ${q(DRAWN_DESC[name])},`);
  lines.push(`  },`);
  return lines.join('\n');
});

const numOrUndef = (raw) => {
  const r = dec(raw);
  if (!r || r === '-' || r === '—') return undefined;
  if (r.endsWith('/2')) return 0.5;
  return parseFloat(r) || undefined;
};

function shipLines(table, kind) {
  return table.slice(1).map(([name, speed, crew, passengers, cargo, ac, hp, dt, cost]) => {
    const lines = [
      `  {`,
      `    id: ${q(slug(name))},`,
      `    name: ${q(name)},`,
      `    kind: ${q(kind)},`,
      `    cost: ${q(parseCost(cost))},`,
      `    speed: ${q(speed)},`,
    ];
    const c = numOrUndef(crew);
    if (c !== undefined) lines.push(`    crew: ${c},`);
    const p = numOrUndef(passengers);
    if (p !== undefined) lines.push(`    passengers: ${p},`);
    const ca = numOrUndef(cargo);
    if (ca !== undefined) lines.push(`    cargoTons: ${ca},`);
    const a = numOrUndef(ac);
    if (a !== undefined) lines.push(`    ac: ${a},`);
    const h = numOrUndef(hp);
    if (h !== undefined) lines.push(`    hp: ${h},`);
    const d = numOrUndef(dt);
    if (d !== undefined) lines.push(`    damageThreshold: ${d},`);
    lines.push(`  },`);
    return lines.join('\n');
  });
}
const shipLines7 = shipLines(shipsTable, 'ship');
const eberronLines = shipLines(eberronTables, 'eberron-ship');

// ---------- Preserve WEAPONS / ARMOR / helpers verbatim ----------
const cur = fs.readFileSync(path.join(SRC, 'equipment.ts'), 'utf8');
const slice = (startAnchor, endAnchor) => {
  const si = cur.indexOf(startAnchor);
  if (si < 0) throw new Error(`anchor not found: ${startAnchor}`);
  const ei = cur.indexOf(endAnchor, si + startAnchor.length);
  if (ei < 0) throw new Error(`end anchor not found: ${endAnchor}`);
  return cur.slice(si, ei + endAnchor.length);
};
const weaponsBlock = slice('export const WEAPONS: WeaponDef[] = [', '\n];');
const weaponsById = slice('export const WEAPONS_BY_ID: Record<string, WeaponDef> = Object.fromEntries(', ');');
const armorBlockRaw = slice('export const ARMOR: ArmorDef[] = [', '\n];');
const armorBlock = armorBlockRaw.replace('strengthRequired: 12,', 'strengthRequired: 0,');
const armorById = slice('export const ARMOR_BY_ID: Record<string, ArmorDef> = Object.fromEntries(', ');');
const gearCategoryBlock = slice('export type GearCategory =', ';');
const gearDefBlock = slice('export interface GearDef {', '}');
const gearGetters = `export const GEAR_BY_ID: Record<string, GearDef> = Object.fromEntries(
  GEAR.map((g) => [g.id, g]),
);

/**
 * Look up a gear item by ID.
 */
export function getGear(id: string): GearDef | null {
  return GEAR_BY_ID[id] ?? null;
}

/**
 * Get all gear of a specific category.
 */
export function gearByCategory(category: GearCategory): GearDef[] {
  return GEAR.filter((g) => g.category === category);
}`;

const header = `/**
 * Equipment catalog (2024 D&D).
 *
 * Sources: dnd2024.wikidot.com equipment pages (weapon, armor,
 * adventuring-gear, tool, mounts-and-vehicles), cross-checked against
 * the 2024 Player's Handbook.
 *
 * Weapons/armor carry the 2024 Weapon Mastery and armor rules.
 * Tools (Artisan's Tools, Gaming Sets, Musical Instruments, Thieves'
 * Tools, Forgery Kit, Herbalism Kit, Navigator's Tools, Cartographer's
 * Tools, Calligrapher's Supplies, Disguise Kit, Poisoner's Kit) live in
 * \`src/data/tools.ts\` and are NOT duplicated in GEAR.
 */`;

const body = `${header}
import type { ArmorDef, WeaponDef } from '../types/character';

${weaponsBlock}

${weaponsById}

${armorBlock}

${armorById}

${gearCategoryBlock}

${gearDefBlock}

/**
 * Adventuring gear catalog (2024 PHB Chapter 6), rebuilt from the wiki
 * adventuring-gear table. Includes the five 2024 equipment packs, spellcasting
 * focuses, holy symbols, clothing, ammunition, and simple gear. Costs and
 * weights are from the wiki (PHB); 'Varies' rows carry no cost/weight.
 */
export const GEAR: GearDef[] = [
${gearLines.join('\n')}

  // ---- Spellcasting focus variants (PHB 2024) ----
${variantLines.join('\n')}

  // ---- Ammunition (wiki weapon page) ----
${ammoLines.join('\n')}
];

${gearGetters}

export interface MountDef {
  id: string;
  name: string;
  cost: string;
  /** Load the mount can carry in pounds. */
  carryingCapacityLb?: number;
  description?: string;
}

/**
 * Mounts from the wiki mounts-and-vehicles page (PHB 2024).
 */
export const MOUNTS: MountDef[] = [
${mountLines.join('\n')}
];

export type VehicleKind = 'saddle' | 'drawn' | 'ship' | 'eberron-ship';

export interface VehicleDef {
  id: string;
  name: string;
  kind: VehicleKind;
  cost: string;
  weightLb?: number;
  /** Speed text, e.g. '8 mph' (ships). */
  speed?: string;
  crew?: number;
  passengers?: number;
  cargoTons?: number;
  ac?: number;
  hp?: number;
  damageThreshold?: number;
  description?: string;
}

/**
 * Saddles, drawn vehicles, and ships from the wiki mounts-and-vehicles page.
 */
export const VEHICLES: VehicleDef[] = [
${[...saddleLines, ...drawnLines, ...shipLines7, ...eberronLines].join('\n')}
];
`;

fs.writeFileSync(path.join(SRC, 'equipment.ts'), body, 'utf8');
console.log(
  `equipment.ts: GEAR=${gearLines.length + variantLines.length + ammoLines.length} (wiki=${gearLines.length}, variants=${variantLines.length}, ammo=${ammoLines.length}) MOUNTS=${mountLines.length} VEHICLES=${saddleLines.length + drawnLines.length + shipLines7.length + eberronLines.length} (saddle=${saddleLines.length} drawn=${drawnLines.length} ship=${shipLines7.length} eberron=${eberronLines.length})`
);

// ---------- tools.ts full rewrite ----------
const toolHtml = fs.readFileSync(path.join(CACHE, 'tool.html'), 'utf8');
const toolTables = parseTables(toolHtml);
// toolTables: [artisans(17), other(6), gaming(4), instruments(10)] each [name, ability, weight, cost]
const [artisanTable, otherTable, gamingTable, instrumentTable] = toolTables;

function toolLines(table, category) {
  return table.slice(1).map(([name, abilityText, weight, cost]) => {
    const lines = [
      `  {`,
      `    id: ${q(slug(name))},`,
      `    name: ${q(name)},`,
      `    category: ${q(category)},`,
    ];
    const ab = ABILITY_MAP[abilityText];
    if (ab) lines.push(`    ability: ${q(ab)},`);
    const w = parseWeight(weight);
    const c = parseCost(cost);
    if (w !== undefined) lines.push(`    weightLb: ${w},`);
    if (c) lines.push(`    cost: ${q(c)},`);
    lines.push(`  },`);
    return lines.join('\n');
  });
}

const vehiclesToolLines = [
  `  { id: 'land-vehicles', name: 'Land Vehicles', category: 'vehicle' },`,
  `  { id: 'water-vehicles', name: 'Water Vehicles', category: 'vehicle' },`,
  `  { id: 'air-vehicles', name: 'Air Vehicles', category: 'vehicle' },`,
];

const toolsBody = `import type { AbilityKey } from '../types/character';

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
${toolLines(artisanTable, 'artisansTools').join('\n')}

  // ---- Gaming Sets (4) ----
${toolLines(gamingTable, 'gamingSet').join('\n')}

  // ---- Musical Instruments (10) ----
${toolLines(instrumentTable, 'musicalInstrument').join('\n')}

  // ---- Other Tools ----
${toolLines(otherTable, 'other').join('\n')}

  // ---- Vehicles ----
${vehiclesToolLines.join('\n')}
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
`;

fs.writeFileSync(path.join(SRC, 'tools.ts'), toolsBody, 'utf8');
console.log(
  `tools.ts: artisans=${artisanTable.length - 1} gaming=${gamingTable.length - 1} instruments=${instrumentTable.length - 1} other=${otherTable.length - 1} vehicles=3`
);
console.log('minor: dry flag ignored (emitter writes by design; --dry not implemented)');