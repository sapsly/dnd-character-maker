/**
 * Compendium model — the section map plus the summary rows the browse page
 * renders.
 *
 * Everything is derived from the existing catalogs in `src/data`; nothing is
 * rewritten here. An entry carries only what the list needs (name, one stat
 * line, badges, a lower-cased search haystack) and keeps the original object in
 * `payload`, so filtering and rendering never touch the typed catalogs. The
 * detail pane casts `payload` back per section — the section id is the
 * discriminator, since it is already selected in the sidebar.
 */
import type { TagTone } from '../ui/Tag'
import type {
  ArmorDef,
  BackgroundDef,
  ClassDef,
  FeatDef,
  SpeciesDef,
  SpellDef,
  WeaponDef,
} from '../../types/character'
import { ABILITY_ABBREV } from '../../types/character'
import { SOURCE_LABELS } from '../../lib/rules/sources'
import { SPECIES } from '../../data/species'
import { BACKGROUNDS } from '../../data/backgrounds'
import { CLASSES } from '../../data/classes'
import { FEATS } from '../../data/feats'
import { ARMOR, GEAR, MOUNTS, VEHICLES, WEAPONS } from '../../data/equipment'
import type { GearDef, MountDef, VehicleDef } from '../../data/equipment'
import { TOOLS } from '../../data/tools'
import type { ToolDef } from '../../data/tools'
import { SPELLS } from '../../data/spells'
import { skillName } from '../../lib/rules/skillList'

export type CompendiumSectionId =
  | 'species'
  | 'classes'
  | 'backgrounds'
  | 'feats'
  | 'equipment'
  | 'tools'
  | 'spells'

export interface CompendiumBadge {
  label: string
  tone: TagTone
  /** Painted as a solid pill — used for spell level chips. */
  solid?: boolean
  /** Hover text for badges whose label is shortened. */
  title?: string
}

export interface CompendiumEntry<T = unknown> {
  id: string
  name: string
  /** Primary stat line under the name. CSS keeps it to one clipped line. */
  meta: string
  badges: CompendiumBadge[]
  /** Lower-cased name + stat line + description, matched as one string. */
  haystack: string
  /** Sub-group this row belongs to. Always set for Equipment rows. */
  group?: string
  /** Spell facets — set only in the Spells section. */
  facetLevel?: number
  facetSchool?: string
  payload: T
}

export interface CompendiumGroup {
  id: string
  label: string
  count: number
}

export interface CompendiumSection {
  id: CompendiumSectionId
  label: string
  count: number
  /** Empty for sections with no sub-groups. */
  groups: CompendiumGroup[]
}

/* --- Small text helpers -------------------------------------------------- */

/** Lower-cased haystack built from loose parts; empty parts are dropped. */
function search(...parts: Array<string | undefined | null>): string {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(' ')
    .toLowerCase()
}

/** First sentence of a description, clipped so a card line stays one line. */
function firstSentence(text: string | undefined, max = 110): string {
  if (!text) return ''
  const match = /^[^.!?]*[.!?]/.exec(text)
  const sentence = (match ? match[0] : text).trim()
  if (sentence.length <= max) return sentence
  return `${sentence.slice(0, max - 1).trimEnd()}…`
}

export function ordinal(level: number): string {
  const tens = level % 100
  if (tens >= 11 && tens <= 13) return `${level}th`
  switch (level % 10) {
    case 1:
      return `${level}st`
    case 2:
      return `${level}nd`
    case 3:
      return `${level}rd`
    default:
      return `${level}th`
  }
}

/** Short chip label: `Cantrip`, `1st`, `2nd`… */
export function spellLevelBadge(level: number): string {
  return level === 0 ? 'Cantrip' : ordinal(level)
}

/** Spoken form: `Cantrip`, `1st level`, `2nd level`… */
export function spellLevelName(level: number): string {
  return level === 0 ? 'Cantrip' : `${ordinal(level)} level`
}

/* --- Label maps shared by the cards and the detail pane ------------------ */

const FEAT_CATEGORY_LABELS: Record<NonNullable<FeatDef['category']>, string> = {
  origin: 'Origin',
  general: 'General',
  'fighting-style': 'Fighting Style',
  'epic-boon': 'Epic Boon',
  dragonmark: 'Dragonmark',
  'planar-pact': 'Planar Pact',
  'dark-gift': 'Dark Gift',
}

export function featCategoryLabel(category: FeatDef['category']): string | null {
  return category ? FEAT_CATEGORY_LABELS[category] : null
}

const FEAT_SOURCE_LABELS: Record<string, string> = {
  core: SOURCE_LABELS.core,
  eberron: SOURCE_LABELS.eberron,
  faerun: SOURCE_LABELS.faerun,
  ravenloft: SOURCE_LABELS.ravenloft,
  lorwyn: SOURCE_LABELS.lorwyn,
  exotic: SOURCE_LABELS.exotic,
  'arcana-unleashed': SOURCE_LABELS['arcana-unleashed'],
  general: 'General',
  origin: 'Origin',
  species: 'Species',
  item: 'Item',
}

/** Human label for a feat's source — book keys (eberron, ravenloft, …) or the legacy acquisition buckets. */
export function featSourceLabel(source: FeatDef['source'] | undefined | null): string | null {
  return source ? (FEAT_SOURCE_LABELS[source] ?? null) : null
}

const BACKGROUND_SOURCE_LABELS: Record<BackgroundDef['source'], string> = {
  srd: 'SRD',
  phb: 'PHB',
  eberron: 'Eberron',
  faerun: 'Faerun',
  ravenloft: 'Ravenloft',
  'arcana-unleashed': 'Arcana Unleashed',
  exotic: 'Exotic',
}

const BACKGROUND_SOURCE_TONES: Record<BackgroundDef['source'], TagTone> = {
  srd: 'success',
  phb: 'neutral',
  eberron: 'muted',
  faerun: 'muted',
  ravenloft: 'muted',
  'arcana-unleashed': 'muted',
  exotic: 'muted',
}

export function backgroundSourceLabel(source: BackgroundDef['source']): string {
  return BACKGROUND_SOURCE_LABELS[source]
}

export function backgroundSourceTone(source: BackgroundDef['source']): TagTone {
  return BACKGROUND_SOURCE_TONES[source]
}

export function weaponCategoryLabel(category: WeaponDef['category']): string {
  return category === 'simple' ? 'Simple' : 'Martial'
}

export function armorCategoryLabel(category: ArmorDef['category']): string {
  switch (category) {
    case 'light':
      return 'Light armor'
    case 'medium':
      return 'Medium armor'
    case 'heavy':
      return 'Heavy armor'
    default:
      return 'Shield'
  }
}

/** `14 + Dex (max +2)`, `11 + Dex`, `18`, `+2` — never prefixed with "AC". */
export function armorAcFormula(armor: ArmorDef): string {
  if (armor.baseAc === null) return '—'
  switch (armor.category) {
    case 'shield':
      return `+${armor.baseAc}`
    case 'light':
      return `${armor.baseAc} + Dex`
    case 'medium':
      return `${armor.baseAc} + Dex (max +${armor.dexterityCap ?? 2})`
    default:
      return `${armor.baseAc}`
  }
}

const GEAR_CATEGORY_LABELS: Record<GearDef['category'], string> = {
  adventuringGear: 'Adventuring gear',
  pack: 'Equipment pack',
  tool: 'Tool',
  focus: 'Spellcasting focus',
  holySymbol: 'Holy symbol',
  instrument: 'Musical instrument',
  clothing: 'Clothing',
}

export function gearCategoryLabel(category: GearDef['category']): string {
  return GEAR_CATEGORY_LABELS[category]
}

const TOOL_CATEGORY_LABELS: Record<ToolDef['category'], string> = {
  artisansTools: "Artisan's tools",
  gamingSet: 'Gaming set',
  musicalInstrument: 'Musical instrument',
  other: 'Other',
  vehicle: 'Vehicle',
}

export function toolCategoryLabel(category: ToolDef['category']): string {
  return TOOL_CATEGORY_LABELS[category]
}

const VEHICLE_KIND_LABELS: Record<VehicleDef['kind'], string> = {
  saddle: 'Saddle',
  drawn: 'Drawn vehicle',
  ship: 'Ship',
  'eberron-ship': 'Eberron ship',
}

export function vehicleKindLabel(kind: VehicleDef['kind']): string {
  return VEHICLE_KIND_LABELS[kind]
}

/* --- Section map --------------------------------------------------------- */

function featGroup(id: NonNullable<FeatDef['category']>, label: string): CompendiumGroup {
  return { id, label, count: FEATS.filter((feat) => feat.category === id).length }
}

const FEAT_GROUPS: CompendiumGroup[] = [
  featGroup('origin', 'Origin'),
  featGroup('general', 'General'),
  featGroup('fighting-style', 'Fighting Style'),
  featGroup('epic-boon', 'Epic Boon'),
  featGroup('dragonmark', 'Dragonmark'),
  featGroup('planar-pact', 'Planar Pact'),
  featGroup('dark-gift', 'Dark Gift'),
]

const EQUIPMENT_GROUPS: CompendiumGroup[] = [
  { id: 'weapons', label: 'Weapons', count: WEAPONS.length },
  { id: 'armor', label: 'Armor', count: ARMOR.length },
  { id: 'gear', label: 'Gear', count: GEAR.length },
  { id: 'mounts', label: 'Mounts', count: MOUNTS.length },
  { id: 'vehicles', label: 'Vehicles', count: VEHICLES.length },
]

/** Sidebar order. Counts are read straight off the catalogs. */
export const SECTIONS: CompendiumSection[] = [
  { id: 'species', label: 'Species', count: SPECIES.length, groups: [] },
  { id: 'classes', label: 'Classes', count: CLASSES.length, groups: [] },
  { id: 'backgrounds', label: 'Backgrounds', count: BACKGROUNDS.length, groups: [] },
  { id: 'feats', label: 'Feats', count: FEATS.length, groups: FEAT_GROUPS },
  {
    id: 'equipment',
    label: 'Equipment',
    count: WEAPONS.length + ARMOR.length + GEAR.length + MOUNTS.length + VEHICLES.length,
    groups: EQUIPMENT_GROUPS,
  },
  { id: 'tools', label: 'Tools', count: TOOLS.length, groups: [] },
  { id: 'spells', label: 'Spells', count: SPELLS.length, groups: [] },
]

export const SECTION_BY_ID: Record<CompendiumSectionId, CompendiumSection> = Object.fromEntries(
  SECTIONS.map((section) => [section.id, section]),
) as Record<CompendiumSectionId, CompendiumSection>

/* --- Spell facets -------------------------------------------------------- */

export const SPELL_LEVEL_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All levels' },
  ...Array.from({ length: 10 }, (_, level) => ({
    value: String(level),
    label: spellLevelName(level),
  })),
]

export const SPELL_SCHOOL_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All schools' },
  ...Array.from(new Set(SPELLS.map((spell) => spell.school)))
    .sort()
    .map((school) => ({ value: school, label: school })),
]

/* --- Entry builders ------------------------------------------------------ */

function buildSpecies(): CompendiumEntry<SpeciesDef>[] {
  return SPECIES.map((def) => {
    const badges: CompendiumBadge[] = [
      {
        label: `${def.traits.length} ${def.traits.length === 1 ? 'trait' : 'traits'}`,
        tone: 'muted',
      },
    ]
    if (def.featLevels?.includes(1)) {
      badges.push({ label: 'Origin feat at 1', tone: 'accent' })
    }
    return {
      id: def.id,
      name: def.name,
      meta: `${def.size} · ${def.speed} ft speed`,
      badges,
      haystack: search(
        def.name,
        def.size,
        def.description,
        def.traits.map((trait) => `${trait.name} ${trait.description}`).join(' '),
      ),
      payload: def,
    }
  })
}

function buildClasses(): CompendiumEntry<ClassDef>[] {
  return CLASSES.map((def) => {
    const saves = def.savingThrowProficiencies.map((key) => ABILITY_ABBREV[key]).join(', ')
    const badges: CompendiumBadge[] = [
      { label: `${saves} saves`, tone: 'neutral' },
      { label: `Subclass at ${def.subclassLevel}`, tone: 'muted' },
    ]
    if (def.spellcasting) badges.push({ label: 'Spellcasting', tone: 'accent' })
    if (def.weaponMastery) badges.push({ label: 'Weapon mastery', tone: 'muted' })
    const featureNames = Object.values(def.featuresByLevel)
      .flat()
      .map((feature) => feature.name)
      .join(' ')
    return {
      id: def.id,
      name: def.name,
      meta: `d${def.hitDie} hit die`,
      badges,
      haystack: search(
        def.name,
        `d${def.hitDie}`,
        saves,
        def.armorProficiencies.join(' '),
        def.weaponProficiencies.join(' '),
        def.subclasses.map((subclass) => subclass.name).join(' '),
        featureNames,
      ),
      payload: def,
    }
  })
}

function buildBackgrounds(): CompendiumEntry<BackgroundDef>[] {
  return BACKGROUNDS.map((def) => {
    const granted = def.skillsGranted.map(skillName)
    const picked = def.skillChoices.map(skillName).join(', ')
    const meta =
      granted.length > 0
        ? `Skills: ${granted.join(', ')}`
        : `Skills: choose ${def.skillChoiceCount} of ${picked}`
    const tools = def.toolsGranted.length > 0 ? def.toolsGranted : def.toolChoices
    const badges: CompendiumBadge[] = [
      { label: backgroundSourceLabel(def.source), tone: backgroundSourceTone(def.source) },
      { label: 'Origin feat', tone: 'accent', title: def.originFeatName },
      {
        label: def.abilityBonusChoices.map((key) => ABILITY_ABBREV[key]).join(' / '),
        tone: 'neutral',
        title: 'Ability score increases',
      },
    ]
    if (tools.length > 0) {
      badges.push({ label: tools.join(', '), tone: 'muted', title: 'Tool proficiency' })
    }
    return {
      id: def.id,
      name: def.name,
      meta,
      badges,
      haystack: search(
        def.name,
        def.description,
        granted.join(' '),
        picked,
        tools.join(' '),
        def.originFeatName,
        def.originFeatDescription,
      ),
      payload: def,
    }
  })
}

function buildFeats(category?: NonNullable<FeatDef['category']>): CompendiumEntry<FeatDef>[] {
  const source = category ? FEATS.filter((feat) => feat.category === category) : FEATS
  return source.map((def) => {
    const categoryLabel = featCategoryLabel(def.category)
    const badges: CompendiumBadge[] = []
    if (categoryLabel) badges.push({ label: categoryLabel, tone: 'neutral' })
    if (def.usableAsOriginFeat && def.category !== 'origin') {
      badges.push({ label: 'Origin feat', tone: 'accent' })
    }
    return {
      id: def.id,
      name: def.name,
      meta: def.prerequisites ? `Requires ${def.prerequisites}` : firstSentence(def.description),
      badges,
      group: def.category ?? undefined,
      haystack: search(def.name, def.description, def.prerequisites, categoryLabel),
      payload: def,
    }
  })
}

function buildWeapons(): CompendiumEntry<WeaponDef>[] {
  return WEAPONS.map((def) => {
    const badges: CompendiumBadge[] = [
      { label: weaponCategoryLabel(def.category), tone: 'neutral' },
    ]
    if (def.ranged) badges.push({ label: 'Ranged', tone: 'muted' })
    badges.push({ label: def.mastery, tone: 'accent', title: 'Weapon mastery property' })
    badges.push({ label: def.cost, tone: 'muted' })
    badges.push({ label: `${def.weightLb} lb`, tone: 'muted' })
    return {
      id: def.id,
      name: def.name,
      meta: `${def.damage} ${def.damageType}${
        def.versatileDamage ? ` · ${def.versatileDamage} versatile` : ''
      }`,
      badges,
      group: 'weapons',
      haystack: search(
        def.name,
        def.damage,
        def.damageType,
        def.mastery,
        def.description,
        weaponCategoryLabel(def.category),
      ),
      payload: def,
    }
  })
}

function buildArmor(): CompendiumEntry<ArmorDef>[] {
  return ARMOR.map((def) => {
    const badges: CompendiumBadge[] = [
      { label: armorCategoryLabel(def.category), tone: 'neutral' },
    ]
    if (def.stealthDisadvantage) {
      badges.push({ label: 'Stealth: disadvantage', tone: 'warning' })
    }
    if (def.strengthRequired > 0) {
      badges.push({ label: `Str ${def.strengthRequired} required`, tone: 'warning' })
    }
    badges.push({ label: def.cost, tone: 'muted' })
    badges.push({ label: `${def.weightLb} lb`, tone: 'muted' })
    return {
      id: def.id,
      name: def.name,
      meta: `AC ${armorAcFormula(def)}`,
      badges,
      group: 'armor',
      haystack: search(def.name, def.description, armorCategoryLabel(def.category)),
      payload: def,
    }
  })
}

function buildGear(): CompendiumEntry<GearDef>[] {
  return GEAR.map((def) => {
    const badges: CompendiumBadge[] = [{ label: gearCategoryLabel(def.category), tone: 'neutral' }]
    if (def.cost) badges.push({ label: def.cost, tone: 'muted' })
    if (def.weightLb !== undefined) badges.push({ label: `${def.weightLb} lb`, tone: 'muted' })
    const meta = firstSentence(def.description)
    return {
      id: def.id,
      name: def.name,
      meta: meta || 'No entry text',
      badges,
      group: 'gear',
      haystack: search(def.name, def.description, gearCategoryLabel(def.category)),
      payload: def,
    }
  })
}

function buildMounts(): CompendiumEntry<MountDef>[] {
  return MOUNTS.map((def) => {
    const badges: CompendiumBadge[] = [{ label: def.cost, tone: 'muted' }]
    if (def.carryingCapacityLb !== undefined) {
      badges.push({ label: `${def.carryingCapacityLb} lb carry`, tone: 'neutral' })
    }
    const meta = firstSentence(def.description)
    return {
      id: def.id,
      name: def.name,
      meta: meta || (def.carryingCapacityLb ? `${def.carryingCapacityLb} lb carrying capacity` : '—'),
      badges,
      group: 'mounts',
      haystack: search(def.name, def.description),
      payload: def,
    }
  })
}

function buildVehicles(): CompendiumEntry<VehicleDef>[] {
  return VEHICLES.map((def) => {
    const badges: CompendiumBadge[] = [{ label: vehicleKindLabel(def.kind), tone: 'neutral' }]
    badges.push({ label: def.cost, tone: 'muted' })
    if (def.weightLb !== undefined) badges.push({ label: `${def.weightLb} lb`, tone: 'muted' })
    if (def.speed) badges.push({ label: def.speed, tone: 'muted' })
    if (def.crew !== undefined) badges.push({ label: `Crew ${def.crew}`, tone: 'muted' })
    if (def.ac !== undefined) badges.push({ label: `AC ${def.ac}`, tone: 'neutral' })
    if (def.hp !== undefined) badges.push({ label: `${def.hp} HP`, tone: 'neutral' })
    const meta = firstSentence(def.description)
    return {
      id: def.id,
      name: def.name,
      meta: meta || vehicleKindLabel(def.kind),
      badges,
      group: 'vehicles',
      haystack: search(def.name, def.description, vehicleKindLabel(def.kind)),
      payload: def,
    }
  })
}

function buildTools(): CompendiumEntry<ToolDef>[] {
  return TOOLS.map((def) => {
    const badges: CompendiumBadge[] = [{ label: toolCategoryLabel(def.category), tone: 'neutral' }]
    if (def.ability) {
      badges.push({
        label: ABILITY_ABBREV[def.ability],
        tone: 'accent',
        title: `Used with ${def.ability} checks`,
      })
    }
    if (def.cost) badges.push({ label: def.cost, tone: 'muted' })
    if (def.weightLb !== undefined) badges.push({ label: `${def.weightLb} lb`, tone: 'muted' })
    return {
      id: def.id,
      name: def.name,
      meta: toolCategoryLabel(def.category),
      badges,
      haystack: search(def.name, toolCategoryLabel(def.category)),
      payload: def,
    }
  })
}

function buildSpells(): CompendiumEntry<SpellDef>[] {
  return SPELLS.map((def) => {
    const badges: CompendiumBadge[] = [
      { label: spellLevelBadge(def.level), tone: 'accent', solid: true },
      { label: def.school, tone: 'muted' },
    ]
    if (def.concentration) badges.push({ label: 'Concentration', tone: 'accent' })
    if (def.components.ritual) badges.push({ label: 'Ritual', tone: 'muted' })
    return {
      id: def.id,
      name: def.name,
      meta: `${def.castingTime} · ${def.range} · ${def.duration}`,
      badges,
      haystack: search(def.name, def.school, def.description),
      facetLevel: def.level,
      facetSchool: def.school,
      payload: def,
    }
  })
}

function buildEquipment(group: string): Array<CompendiumEntry<unknown>> {
  switch (group) {
    case 'weapons':
      return buildWeapons()
    case 'armor':
      return buildArmor()
    case 'gear':
      return buildGear()
    case 'mounts':
      return buildMounts()
    case 'vehicles':
      return buildVehicles()
    default:
      return [
        ...buildWeapons(),
        ...buildArmor(),
        ...buildGear(),
        ...buildMounts(),
        ...buildVehicles(),
      ]
  }
}

/**
 * Rows for one section (and sub-group, when the section has them). Called from
 * a `useMemo` keyed on `[sectionId, groupId]`, so a keystroke never rebuilds
 * them — only the filter below re-runs.
 */
export function buildEntries(
  sectionId: CompendiumSectionId,
  groupId: string,
): Array<CompendiumEntry<unknown>> {
  switch (sectionId) {
    case 'species':
      return buildSpecies()
    case 'classes':
      return buildClasses()
    case 'backgrounds':
      return buildBackgrounds()
    case 'feats':
      return groupId
        ? buildFeats(groupId as NonNullable<FeatDef['category']>)
        : buildFeats()
    case 'equipment':
      return buildEquipment(groupId)
    case 'tools':
      return buildTools()
    default:
      return buildSpells()
  }
}
