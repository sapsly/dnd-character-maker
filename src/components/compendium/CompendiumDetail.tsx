import type { ReactNode } from 'react'
import { Card } from '../ui/Card'
import { Divider } from '../ui/Divider'
import { ExpandableText } from '../ui/ExpandableText'
import { Tag } from '../ui/Tag'
import { ABILITY_ABBREV, ABILITY_LABELS } from '../../types/character'
import type {
  AbilityKey,
  ArmorDef,
  BackgroundDef,
  ClassDef,
  ClassSpellcastingDef,
  FeatDef,
  FeatureOption,
  SpeciesDef,
  SpellDef,
  WeaponDef,
} from '../../types/character'
import { SPECIES } from '../../data/species'
import { getClass } from '../../data/classes'
import { LINEAGES_BY_ID } from '../../data/lineages'
import { skillName } from '../../lib/rules/skillList'
import type { GearDef, MountDef, VehicleDef } from '../../data/equipment'
import type { ToolDef } from '../../data/tools'
import {
  armorAcFormula,
  armorCategoryLabel,
  backgroundSourceLabel,
  featCategoryLabel,
  featSourceLabel,
  gearCategoryLabel,
  ordinal,
  spellLevelName,
  toolCategoryLabel,
  vehicleKindLabel,
  weaponCategoryLabel,
} from './compendiumModel'
import type { CompendiumEntry, CompendiumSectionId } from './compendiumModel'

export interface CompendiumDetailProps {
  sectionId: CompendiumSectionId
  /** What the list is showing — used as the pane's kicker line. */
  kicker: string
  /** The row the list has selected, or null when nothing matches. */
  entry: CompendiumEntry<unknown> | null
}

/* --- Stat rows (a compendium equivalent of the sheet's `.sheet-stat`) ---- */

function Stats({ children }: { children: ReactNode }) {
  return <dl className="compendium-stats">{children}</dl>
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="compendium-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

/** Ability chips tinted with the ability hues from `global.css`. */
function AbilityTags({ keys }: { keys: AbilityKey[] }) {
  return (
    <span className="compendium-stat-tags">
      {keys.map((key) => (
        <Tag key={key} tone="neutral" className={`compendium-ability-tag compendium-ability-tag--${key}`}>
          {ABILITY_ABBREV[key]}
        </Tag>
      ))}
    </span>
  )
}

function featureOptions(options?: FeatureOption[]): ReactNode {
  if (!options || options.length === 0) return null
  return (
    <span className="compendium-feature-options">
      {options.map((option) => (
        <Tag key={option.id} tone="muted">
          {option.name}
        </Tag>
      ))}
    </span>
  )
}

/* --- Per-section bodies -------------------------------------------------- */

function SpeciesDetail({ def }: { def: SpeciesDef }) {
  const abilities = Object.entries(def.abilityBonuses)
  return (
    <>
      <Stats>
        <Stat label="Size" value={def.size} />
        <Stat label="Speed" value={`${def.speed} ft`} />
        <Stat
          label="Ability scores"
          value={
            abilities.length > 0
              ? abilities.map(([key, bonus]) => `+${bonus} ${ABILITY_ABBREV[key as AbilityKey]}`).join(', ')
              : 'From background'
          }
        />
        {def.featLevels && def.featLevels.length > 0 ? (
          <Stat label="Bonus feat" value={`Level ${def.featLevels.join(', Level ')}`} />
        ) : null}
      </Stats>
      <ExpandableText className="compendium-prose" lines={5}>
        {def.description}
      </ExpandableText>
      {def.traits.length > 0 ? (
        <div className="compendium-block">
          <p className="compendium-subhead">Traits</p>
          {def.traits.map((trait) => (
            <div key={trait.name} className="compendium-feature">
              <p className="compendium-feature-name">{trait.name}</p>
              <ExpandableText className="compendium-feature-desc" lines={4}>
                {trait.description}
              </ExpandableText>
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}

/** First level of the slot table that actually grants a slot, and its row. */
function firstSlots(sc: ClassSpellcastingDef): { level: number; text: string } | null {
  const levels = Object.keys(sc.slotTable)
    .map(Number)
    .sort((a, b) => a - b)
  for (const level of levels) {
    const text = sc.slotTable[level]
      .map((slots, index) => (slots > 0 ? `${slots} × ${ordinal(index + 1)}` : ''))
      .filter(Boolean)
      .join(', ')
    if (text) return { level, text }
  }
  return null
}

function ClassDetail({ def }: { def: ClassDef }) {
  const saves = def.savingThrowProficiencies
  const granted = def.skills.granted.map(skillName)
  const choiceText =
    def.skills.choiceCount > 0
      ? `${def.skills.choiceCount} of ${def.skills.choices.map(skillName).join(', ')}`
      : ''
  let skills = granted.join(', ')
  if (choiceText) skills = skills ? `${skills}, plus choose ${choiceText}` : `Choose ${choiceText}`
  if (!skills) skills = '—'

  const sc = def.spellcasting
  const slots = sc ? firstSlots(sc) : null
  const featureLevels = Object.keys(def.featuresByLevel)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <>
      <Stats>
        <Stat label="Hit die" value={`d${def.hitDie}`} />
        <Stat label="Saving throws" value={<AbilityTags keys={saves} />} />
        <Stat label="Armor" value={def.armorProficiencies.join('; ') || '—'} />
        <Stat label="Weapons" value={def.weaponProficiencies.join('; ') || '—'} />
        <Stat label="Tools" value={def.toolProficiencies.join(', ') || '—'} />
        <Stat label="Skills" value={skills} />
        <Stat label="Subclass" value={`Level ${def.subclassLevel}`} />
        <Stat
          label="Spellcasting"
          value={sc ? `${sc.spellsMode === 'prepared' ? 'Prepared' : 'Known'} · ${ABILITY_LABELS[sc.ability]}` : 'None'}
        />
        <Stat label="ASI levels" value={def.asiLevels.length > 0 ? def.asiLevels.join(', ') : '—'} />
        {def.weaponMastery ? (
          <Stat label="Weapon mastery" value={`${def.weaponMastery.choiceCount} properties`} />
        ) : null}
        {def.sourceNote ? <Stat label="Source" value={def.sourceNote} /> : null}
      </Stats>

      {sc ? (
        <div className="compendium-block">
          <p className="compendium-subhead">
            Spellcasting
            {sc.pactMagic ? (
              <Tag tone="accent" className="compendium-subhead-tag">
                Pact Magic
              </Tag>
            ) : null}
            {sc.grantsFromSubclass ? (
              <Tag tone="muted" className="compendium-subhead-tag">
                From subclass
              </Tag>
            ) : null}
          </p>
          <Stats>
            <Stat label="Ability" value={ABILITY_LABELS[sc.ability]} />
            <Stat
              label="Spells"
              value={sc.spellsMode === 'prepared' ? 'Prepared each Long Rest' : 'Known'}
            />
            <Stat
              label="Cantrips"
              value={`${sc.cantripCountByLevel[1] ?? 0} at level 1`}
            />
            <Stat label="Spells at level 1" value={`${sc.spellCountByLevel[1] ?? 0}`} />
            <Stat
              label={slots ? `Level ${slots.level} slots` : 'Slots'}
              value={slots ? slots.text : '—'}
            />
          </Stats>
        </div>
      ) : null}

      <div className="compendium-block">
        <p className="compendium-subhead">Features</p>
        {featureLevels.map((level) => (
          <div key={level} className="compendium-feature-level">
            <p className="compendium-level-label">Level {level}</p>
            {def.featuresByLevel[level]?.map((feature) => (
              <div key={feature.id} className="compendium-feature">
                <p className="compendium-feature-name">{feature.name}</p>
                <ExpandableText className="compendium-feature-desc" lines={4}>
                  {feature.description}
                </ExpandableText>
                {featureOptions(feature.options)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {def.subclasses.length > 0 ? (
        <div className="compendium-block">
          <p className="compendium-subhead">
            Subclasses
            <Tag tone="muted" className="compendium-subhead-tag">
              from level {def.subclassLevel}
            </Tag>
          </p>
          {def.subclasses.map((subclass) => (
            <div key={subclass.id} className="compendium-subclass">
              <p className="compendium-subclass-name">{subclass.name}</p>
              <ExpandableText className="compendium-prose" lines={5}>
                {subclass.description}
              </ExpandableText>
              <ul className="compendium-feature-list">
                {subclass.features.map((feature, index) => (
                  <li key={`${subclass.id}-${index}`} className="compendium-feature">
                    <p className="compendium-feature-name">
                      Level {feature.level} · {feature.name}
                    </p>
                    <ExpandableText className="compendium-feature-desc" lines={4}>
                      {feature.description}
                    </ExpandableText>
                    {featureOptions(feature.options)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}

function BackgroundDetail({ def }: { def: BackgroundDef }) {
  const granted = def.skillsGranted.map(skillName)
  const picked = def.skillChoices.map(skillName).join(', ')
  const skills = granted.join(', ')
  const tools = def.toolsGranted.length > 0 ? def.toolsGranted : def.toolChoices
  return (
    <>
      <Stats>
        <Stat label="Source" value={backgroundSourceLabel(def.source)} />
        <Stat
          label="Skills"
          value={
            skills ||
            (def.skillChoiceCount > 0
              ? `Choose ${def.skillChoiceCount} of ${picked}`
              : '—')
          }
        />
        <Stat
          label="Tools"
          value={
            tools.length > 0
              ? `${tools.join(', ')}${def.toolChoiceCount > 0 ? ` (choose ${def.toolChoiceCount})` : ''}`
              : '—'
          }
        />
        <Stat label="Ability increases" value={<AbilityTags keys={def.abilityBonusChoices} />} />
      </Stats>
      <ExpandableText className="compendium-prose" lines={5}>
        {def.description}
      </ExpandableText>
      <div className="compendium-block">
        <p className="compendium-subhead">Origin feat</p>
        <p className="compendium-block-title">{def.originFeatName}</p>
        <ExpandableText className="compendium-prose" lines={5}>
          {def.originFeatDescription}
        </ExpandableText>
      </div>
    </>
  )
}

function FeatDetail({ def }: { def: FeatDef }) {
  return (
    <>
      <Stats>
        <Stat label="Category" value={featCategoryLabel(def.category) ?? '—'} />
        <Stat label="Prerequisite" value={def.prerequisites ?? 'None'} />
        <Stat label="Usable as Origin feat" value={def.usableAsOriginFeat ? 'Yes' : 'No'} />
        {featSourceLabel(def.source) ? (
          <Stat label="Source" value={featSourceLabel(def.source) as string} />
        ) : null}
      </Stats>
      <ExpandableText className="compendium-prose" lines={5}>
        {def.description}
      </ExpandableText>
    </>
  )
}

function WeaponDetail({ def }: { def: WeaponDef }) {
  return (
    <>
      <Stats>
        <Stat label="Category" value={weaponCategoryLabel(def.category)} />
        <Stat label="Damage" value={`${def.damage} ${def.damageType}`} />
        {def.versatileDamage ? (
          <Stat label="Versatile" value={`${def.versatileDamage} ${def.damageType}`} />
        ) : null}
        {/* `WeaponDef` carries no reach/range figure, only the flag — so the row
            names the attack rather than implying a distance it cannot state. */}
        <Stat label="Attack" value={def.ranged ? 'Ranged' : 'Melee'} />
        <Stat label="Mastery" value={def.mastery} />
        <Stat label="Cost" value={def.cost} />
        <Stat label="Weight" value={`${def.weightLb} lb`} />
      </Stats>
      {def.description ? (
        <p className="compendium-prose">{def.description}</p>
      ) : (
        <p className="compendium-note">The weapon catalog records damage, mastery, cost and weight.</p>
      )}
    </>
  )
}

function ArmorDetail({ def }: { def: ArmorDef }) {
  const dex =
    def.category === 'light'
      ? 'Added in full'
      : def.category === 'medium'
        ? `Capped at +${def.dexterityCap ?? 2}`
        : 'None'
  return (
    <>
      <Stats>
        <Stat label="Category" value={armorCategoryLabel(def.category)} />
        <Stat label="Armor Class" value={`AC ${armorAcFormula(def)}`} />
        <Stat label="Dexterity" value={dex} />
        <Stat label="Stealth" value={def.stealthDisadvantage ? 'Disadvantage' : 'No penalty'} />
        <Stat
          label="Strength"
          value={def.strengthRequired > 0 ? `${def.strengthRequired} required` : 'None'}
        />
        <Stat label="Cost" value={def.cost} />
        <Stat label="Weight" value={`${def.weightLb} lb`} />
      </Stats>
      {def.description ? <p className="compendium-prose">{def.description}</p> : null}
    </>
  )
}

function GearDetail({ def }: { def: GearDef }) {
  return (
    <>
      <Stats>
        <Stat label="Category" value={gearCategoryLabel(def.category)} />
        <Stat label="Cost" value={def.cost ?? '—'} />
        <Stat label="Weight" value={def.weightLb !== undefined ? `${def.weightLb} lb` : '—'} />
      </Stats>
      {def.description ? (
        <ExpandableText className="compendium-prose" lines={5}>
          {def.description}
        </ExpandableText>
      ) : (
        <p className="compendium-note">This entry records cost and weight only.</p>
      )}
    </>
  )
}

function MountDetail({ def }: { def: MountDef }) {
  return (
    <>
      <Stats>
        <Stat label="Cost" value={def.cost} />
        <Stat
          label="Carrying capacity"
          value={def.carryingCapacityLb !== undefined ? `${def.carryingCapacityLb} lb` : '—'}
        />
      </Stats>
      {def.description ? <p className="compendium-prose">{def.description}</p> : null}
    </>
  )
}

function VehicleDetail({ def }: { def: VehicleDef }) {
  return (
    <>
      <Stats>
        <Stat label="Kind" value={vehicleKindLabel(def.kind)} />
        <Stat label="Cost" value={def.cost} />
        <Stat label="Weight" value={def.weightLb !== undefined ? `${def.weightLb} lb` : '—'} />
        {def.speed ? <Stat label="Speed" value={def.speed} /> : null}
        {def.crew !== undefined ? <Stat label="Crew" value={`${def.crew}`} /> : null}
        {def.passengers !== undefined ? <Stat label="Passengers" value={`${def.passengers}`} /> : null}
        {def.cargoTons !== undefined ? <Stat label="Cargo" value={`${def.cargoTons} tons`} /> : null}
        {def.ac !== undefined ? <Stat label="Armor Class" value={`${def.ac}`} /> : null}
        {def.hp !== undefined ? <Stat label="Hit Points" value={`${def.hp}`} /> : null}
        {def.damageThreshold !== undefined ? (
          <Stat label="Damage threshold" value={`${def.damageThreshold}`} />
        ) : null}
      </Stats>
      {def.description ? <p className="compendium-prose">{def.description}</p> : null}
    </>
  )
}

function ToolDetail({ def }: { def: ToolDef }) {
  return (
    <>
      <Stats>
        <Stat label="Category" value={toolCategoryLabel(def.category)} />
        <Stat label="Ability" value={def.ability ? ABILITY_LABELS[def.ability] : '—'} />
        <Stat label="Cost" value={def.cost ?? '—'} />
        <Stat label="Weight" value={def.weightLb !== undefined ? `${def.weightLb} lb` : '—'} />
      </Stats>
      <p className="compendium-note">
        The tool catalog records category, ability, cost and weight.
      </p>
    </>
  )
}

function SpellDetail({ def }: { def: SpellDef }) {
  const components = [
    def.components.verbal ? 'V' : '',
    def.components.somatic ? 'S' : '',
    def.components.material ? 'M' : '',
    def.components.ritual ? 'Ritual' : '',
  ]
    .filter(Boolean)
    .join(', ')
  const classNames = def.classes.map((id) => getClass(id)?.name ?? id)
  const speciesNames = def.speciesGrants?.map((id) => SPECIES.find((s) => s.id === id)?.name ?? id)
  const lineageNames = def.speciesLineages?.map((id) => LINEAGES_BY_ID[id]?.name ?? id)
  return (
    <>
      <Stats>
        <Stat label="Level" value={spellLevelName(def.level)} />
        <Stat label="School" value={def.school} />
        <Stat label="Casting time" value={def.castingTime} />
        <Stat label="Range" value={def.range} />
        <Stat label="Duration" value={def.duration} />
        <Stat label="Components" value={components || '—'} />
        {def.components.material && def.components.materialText ? (
          <Stat label="Material" value={def.components.materialText} />
        ) : null}
        <Stat label="Classes" value={classNames.join(', ') || '—'} />
        {speciesNames && speciesNames.length > 0 ? (
          <Stat label="Species grants" value={speciesNames.join(', ')} />
        ) : null}
        {lineageNames && lineageNames.length > 0 ? (
          <Stat label="Lineage grants" value={lineageNames.join(', ')} />
        ) : null}
      </Stats>
      <div className="compendium-block">
        <p className="compendium-subhead">Description</p>
        <ExpandableText className="compendium-prose" lines={5}>
          {def.description}
        </ExpandableText>
      </div>
    </>
  )
}

function EquipmentBody({ entry }: { entry: CompendiumEntry<unknown> }) {
  switch (entry.group) {
    case 'weapons':
      return <WeaponDetail def={entry.payload as WeaponDef} />
    case 'armor':
      return <ArmorDetail def={entry.payload as ArmorDef} />
    case 'gear':
      return <GearDetail def={entry.payload as GearDef} />
    case 'mounts':
      return <MountDetail def={entry.payload as MountDef} />
    case 'vehicles':
      return <VehicleDetail def={entry.payload as VehicleDef} />
    default:
      return null
  }
}

function renderBody(sectionId: CompendiumSectionId, entry: CompendiumEntry<unknown>): ReactNode {
  switch (sectionId) {
    case 'species':
      return <SpeciesDetail def={entry.payload as SpeciesDef} />
    case 'classes':
      return <ClassDetail def={entry.payload as ClassDef} />
    case 'backgrounds':
      return <BackgroundDetail def={entry.payload as BackgroundDef} />
    case 'feats':
      return <FeatDetail def={entry.payload as FeatDef} />
    case 'equipment':
      return <EquipmentBody entry={entry} />
    case 'tools':
      return <ToolDetail def={entry.payload as ToolDef} />
    default:
      return <SpellDetail def={entry.payload as SpellDef} />
  }
}

/**
 * Accent-bordered pane beside the list, following `.create-detail`: the picked
 * entry's stat rows first, then its prose and, for classes, features grouped by
 * level.
 */
export function CompendiumDetail({ sectionId, kicker, entry }: CompendiumDetailProps) {
  return (
    <Card className="compendium-detail-card">
      <div className="compendium-detail-head">
        <p className="compendium-detail-kicker">{kicker}</p>
        <h2 className="compendium-detail-title">{entry ? entry.name : 'No entry selected'}</h2>
        {entry && entry.badges.length > 0 ? (
          <div className="compendium-detail-badges">
            {entry.badges.map((badge, index) => (
              <Tag
                key={`${badge.label}-${index}`}
                tone={badge.tone}
                solid={badge.solid}
                title={badge.title}
              >
                {badge.label}
              </Tag>
            ))}
          </div>
        ) : null}
      </div>
      {entry ? (
        <>
          <Divider />
          <div className="compendium-detail-body">{renderBody(sectionId, entry)}</div>
        </>
      ) : (
        <p className="compendium-note">Choose an item from the list to read it here.</p>
      )}
    </Card>
  )
}
