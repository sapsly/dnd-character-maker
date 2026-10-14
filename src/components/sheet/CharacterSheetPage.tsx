import { useId, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type {
  AbilityKey,
  Character,
  ClassDef,
  ClassEntry,
  CoinPurse,
  InventoryItem,
  SkillProficiencyEntry,
} from '../../types/character'
import type { DerivedCharacter } from '../../lib/derived'
import { deriveWeaponAttacks } from '../../lib/rules/attacks'
import type { WeaponAttack } from '../../lib/rules/attacks'
import type { GearCategory } from '../../data/equipment'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Divider } from '../ui/Divider'
import { EmptyState } from '../ui/EmptyState'
import { Field } from '../ui/Field'
import { CharacterAccentPicker } from '../ui/CharacterAccentPicker'
import { ExpandableText } from '../ui/ExpandableText'
import { Icon } from '../ui/Icon'
import { NumberInput } from '../ui/NumberInput'
import { Select } from '../ui/Select'
import { Tag } from '../ui/Tag'
import { TextInput } from '../ui/TextInput'
import {
  ABILITY_LABELS,
  ABILITY_ORDER,
  formatModifier,
  governingEntry,
  useCharacterSheet,
} from './useCharacterSheet'
import { skillName } from '../../lib/rules/skillList'
import { subclassSpellGrants } from '../../lib/rules/subclassPicks'
import { getSpell } from '../../data/spells'
import { LINEAGES_BY_ID, speciesSpellGrantsUpTo } from '../../data/lineages'
import { getTool } from '../../data/tools'
import { ARMOR, GEAR, WEAPONS } from '../../data/equipment'
import { normalizeCoinPurse } from '../../lib/coins'
import { startingEquipmentFor, COIN_TYPES } from '../../data/startingEquipment'

function classLine(entry: ClassEntry, classDef: ClassDef | undefined): string {
  const name = classDef?.name ?? entry.classId
  return `${name} ${entry.level}`
}

/** Features the entry has actually reached, in level order. */
function featuresUpTo(classDef: ClassDef, level: number) {
  const gained: { level: number; name: string; description: string }[] = []
  for (let lvl = 1; lvl <= level; lvl += 1) {
    const features = classDef.featuresByLevel[lvl] ?? []
    for (const feature of features) {
      gained.push({ level: lvl, name: feature.name, description: feature.description })
    }
  }
  return gained
}

function SkillRow({ skill }: { skill: SkillProficiencyEntry }) {
  const proficient = skill.proficiency > 0
  return (
    <li className={proficient ? 'sheet-skill' : 'sheet-skill sheet-skill--plain'}>
      <span className="sheet-skill-name">
        {skill.name}
        {skill.expertise ? (
          <Tag tone="accent" className="sheet-skill-expertise">
            Expertise
          </Tag>
        ) : null}
      </span>
      <span className="sheet-skill-ability">{skill.abilityLabel}</span>
      <span className={proficient ? 'sheet-skill-mod' : 'sheet-skill-mod sheet-skill-mod--plain'}>
        {formatModifier(skill.modifier)}
      </span>
      <span className="sheet-skill-source">{skill.source}</span>
    </li>
  )
}

function AbilityBlock({ derived }: { derived: DerivedCharacter }) {
  const { abilityScores, abilityModifiers, abilityBonuses, character } = derived
  return (
    <Card title="Ability scores" className="sheet-card">
      <p className="sheet-hint">
        Base is what you allocated. Bonuses come from species and background and are applied on
        read, so they never get double-counted.
      </p>
      <ul className="sheet-abilities">
        {ABILITY_ORDER.map((key: AbilityKey) => {
          const bonus = abilityBonuses[key] ?? 0
          const base = character.abilityScoreBase[key]
          return (
            <li key={key} className={`sheet-ability sheet-ability--${key}`}>
              <span className="sheet-ability-name">{ABILITY_LABELS[key]}</span>
              <span className="sheet-ability-score">{abilityScores[key]}</span>
              <span className="sheet-ability-mod">{formatModifier(abilityModifiers[key])}</span>
              <span className="sheet-ability-detail">
                base {base}
                {bonus !== 0 ? ` · ${bonus > 0 ? '+' : ''}${bonus} bonus` : ' · no bonus'}
              </span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function SavesBlock({ derived }: { derived: DerivedCharacter }) {
  return (
    <Card title="Saving throws" className="sheet-card">
      <ul className="sheet-saves">
        {derived.savingThrows.map((save) => (
          <li
            key={save.ability}
            className={save.proficient ? 'sheet-save' : 'sheet-save sheet-save--plain'}
          >
            <span className="sheet-save-name">{ABILITY_LABELS[save.ability]}</span>
            <span className="sheet-save-mod">{formatModifier(save.modifier)}</span>
            <span className="sheet-save-flags">
              {save.proficient ? <Tag tone="success">Proficient</Tag> : null}
              {save.advantage ? <Tag tone="accent">Advantage</Tag> : null}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

/**
 * Current / temporary hit points. Stored state is the source of truth for the
 * maximum, but current HP is clamped against it so a stale total cannot leave
 * the sheet showing more HP than the character can have.
 */
function HitPointTracker({
  derived,
  combat,
  onCurrentHp,
  onAdjustHp,
  onTemporaryHp,
  onHpOverride,
  onHealFull,
  onHpBonusFlat,
}: {
  derived: DerivedCharacter
  combat: Character['combat']
  onCurrentHp: (value: number) => void
  onAdjustHp: (delta: number) => void
  onTemporaryHp: (value: number) => void
  onHpOverride: (value: number | undefined) => void
  onHealFull: () => void
  onHpBonusFlat: (value: number) => void
}) {
  const { hitPoints } = derived
  const current = Math.min(combat.hitPointsCurrent, hitPoints.max)
  const missing = Math.max(hitPoints.max - current, 0)

  return (
    <Card title="Hit points" className="sheet-card">
      <p className="sheet-hint">
        The maximum comes from your hit dice and Constitution. Current and temporary hit points are
        yours to track between rests.
      </p>

      <div className="sheet-hp-track">
        <div className="sheet-hp-figure">
          <span className="sheet-hp-current">{current}</span>
          <span className="sheet-hp-max">/ {hitPoints.max}</span>
        </div>
        <div className="sheet-hp-bar" role="img" aria-label={`${current} of ${hitPoints.max} hit points remaining`}>
          <div
            className="sheet-hp-bar-fill"
            style={{ width: `${hitPoints.max > 0 ? (current / hitPoints.max) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="sheet-hp-quick">
        <Button variant="danger" size="sm" onClick={() => onAdjustHp(-5)} disabled={current <= 0}>
          −5
        </Button>
        <Button variant="danger" size="sm" onClick={() => onAdjustHp(-1)} disabled={current <= 0}>
          −1
        </Button>
        <Button variant="ghost" size="sm" onClick={onHealFull} disabled={missing === 0}>
          Full heal
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onAdjustHp(1)} disabled={missing === 0}>
          +1
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onAdjustHp(5)} disabled={missing === 0}>
          +5
        </Button>
      </div>

      <div className="sheet-hp-fields">
        <Field label="Current" className="sheet-hp-field">
          <NumberInput
            value={current}
            min={0}
            max={hitPoints.max}
            onValueChange={onCurrentHp}
            decrementLabel="Decrease current hit points"
            incrementLabel="Increase current hit points"
          />
        </Field>
        <Field label="Temporary" className="sheet-hp-field">
          <NumberInput
            value={combat.temporaryHitPoints}
            min={0}
            onValueChange={onTemporaryHp}
            decrementLabel="Decrease temporary hit points"
            incrementLabel="Increase temporary hit points"
          />
        </Field>
        <Field
          label="Flat bonus"
          className="sheet-hp-field"
          hint="Tough, boons, items"
        >
          <NumberInput
            value={combat.hpBonusFlat}
            onValueChange={onHpBonusFlat}
            decrementLabel="Decrease flat hit point bonus"
            incrementLabel="Increase flat hit point bonus"
          />
        </Field>
        <Field
          label="Max override"
          className="sheet-hp-field"
          hint={combat.hpOverride === undefined ? `Calculated ${hitPoints.computed}` : undefined}
        >
          <NumberInput
            value={combat.hpOverride ?? hitPoints.computed}
            min={1}
            onValueChange={(value) => onHpOverride(value === hitPoints.computed ? undefined : value)}
            decrementLabel="Decrease maximum hit points"
            incrementLabel="Increase maximum hit points"
          />
        </Field>
      </div>
      {combat.hpOverride !== undefined ? (
        <button type="button" className="link sheet-hp-reset" onClick={() => onHpOverride(undefined)}>
          Use the calculated maximum ({hitPoints.computed})
        </button>
      ) : null}
    </Card>
  )
}

function CombatBlock({ derived }: { derived: DerivedCharacter }) {
  const { armorClass, hitPoints, initiative, speed, passivePerception, proficiencyBonus } = derived
  return (
    <>
      <Card title="Combat" className="sheet-card">
        <dl className="sheet-stats">
          <div className="sheet-stat sheet-stat--ac">
            <dt>Armor class</dt>
            <dd className="sheet-stat-value">{armorClass.total}</dd>
            <dd className="sheet-stat-note mono">{armorClass.formula}</dd>
          </div>
          <div className="sheet-stat sheet-stat--hp">
            <dt>Hit points</dt>
            <dd className="sheet-stat-value">
              {hitPoints.current} / {hitPoints.max}
            </dd>
            <dd className="sheet-stat-note">
              {hitPoints.temporary > 0 ? `+${hitPoints.temporary} temporary` : 'No temporary HP'}
            </dd>
          </div>
          <div className="sheet-stat">
            <dt>Initiative</dt>
            <dd className="sheet-stat-value">{formatModifier(initiative.totalBonus)}</dd>
            <dd className="sheet-stat-note">{formatModifier(initiative.modifier)} Dexterity</dd>
          </div>
          <div className="sheet-stat">
            <dt>Speed</dt>
            <dd className="sheet-stat-value">{speed}</dd>
            <dd className="sheet-stat-note">feet</dd>
          </div>
          <div className="sheet-stat">
            <dt>Passive perception</dt>
            <dd className="sheet-stat-value">{passivePerception}</dd>
            <dd className="sheet-stat-note">no perception proficiency assumed</dd>
          </div>
          <div className="sheet-stat">
            <dt>Proficiency bonus</dt>
            <dd className="sheet-stat-value">{formatModifier(proficiencyBonus)}</dd>
            <dd className="sheet-stat-note">at level {derived.level}</dd>
          </div>
        </dl>

        {armorClass.breakdown.length > 0 ? (
          <>
            <Divider label="Armor class breakdown" />
            <ul className="sheet-breakdown">
              {armorClass.breakdown.map((row) => (
                <li key={row.label} className="sheet-breakdown-row">
                  <span className="sheet-breakdown-label">{row.label}</span>
                  <span className="sheet-breakdown-value mono">
                    {row.value === null ? '—' : formatModifier(row.value)}
                  </span>
                  {row.note ? <span className="sheet-breakdown-note">{row.note}</span> : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {hitPoints.rows.length > 0 ? (
          <>
            <Divider label="Hit point sources" />
            <ul className="sheet-breakdown">
              {hitPoints.rows.map((row) => (
                <li key={row.label} className="sheet-breakdown-row">
                  <span className="sheet-breakdown-label">{row.label}</span>
                  <span className="sheet-breakdown-value mono">{row.roll}</span>
                  <span className="sheet-breakdown-note">
                    {row.result}
                    {row.note ? ` · ${row.note}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Card>
    </>
  )
}

function AttacksBlock({ character }: { character: Character }) {
  const attacks: WeaponAttack[] = deriveWeaponAttacks(character)
  return (
    <Card title="Attacks" className="sheet-card">
      {attacks.length === 0 ? (
        <p className="sheet-empty-note">No equipped weapons.</p>
      ) : (
        <dl className="sheet-stats">
          {attacks.map((attack) => (
            <div key={attack.id} className="sheet-stat">
              <dt>{attack.label}</dt>
              <dd className="sheet-stat-value">{formatModifier(attack.attackBonus)}</dd>
              <dd className="sheet-stat-note">
                {attack.damage} {attack.damageType}
                {attack.kind === 'unarmed' ? (
                  <Tag tone="muted">Unarmed</Tag>
                ) : null}
                {!attack.proficient ? (
                  <Tag tone="warning">Not proficient</Tag>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
  )
}

function SpellcastingBlock({
  derived,
  onRemoveSubclassSpell,
}: {
  derived: DerivedCharacter
  /**
   * Drops one stored subclass spell so the next level-up replacement has a slot
   * to fill. Free removal is what makes "replace one per level" work in practice.
   */
  onRemoveSubclassSpell: (classEntryId: string, featureId: string, spellId: string) => void
}) {
  if (derived.casterClasses.length === 0) return null
  const save = governingEntry(derived.spellSaveDc)
  const attack = governingEntry(derived.spellAttackBonus)

  // Group spells by class entry
  const casterEntries = derived.character.classes.filter((entry) => {
    const classDef = derived.classDefs.find((c) => c.id === entry.classId)
    return classDef?.spellcasting
  })

  return (
    <Card title="Spellcasting" className="sheet-card">
      <p className="sheet-hint">
        Governing ability: {save ? save.label : 'not identified by the rules engine'}.
      </p>
      <dl className="sheet-stats sheet-stats--compact">
        <div className="sheet-stat">
          <dt>Save DC</dt>
          <dd className="sheet-stat-value">{save ? save.value : '—'}</dd>
        </div>
        <div className="sheet-stat">
          <dt>Attack bonus</dt>
          <dd className="sheet-stat-value">
            {attack ? formatModifier(attack.value) : '—'}
          </dd>
        </div>
      </dl>

      {derived.spellSlots.length > 0 ? (
        <>
          <Divider label="Slots" />
          <ul className="sheet-slots">
            {derived.spellSlots.map((row) => (
              <li key={row.level} className="sheet-slot">
                <span className="sheet-slot-level">
                  {row.level === 0 ? 'Cantrip' : `Level ${row.level}`}
                </span>
                <span className="sheet-slot-count">
                  {row.total - row.used} / {row.total}
                </span>
                {row.pactMagic ? <Tag tone="accent">Pact</Tag> : null}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="sheet-empty-note">No spell slots at this level.</p>
      )}

      {casterEntries.length > 0 && (
        <>
          <Divider label="Spells & Cantrips" />
          {casterEntries.map((entry) => {
            const classDef = derived.classDefs.find((c) => c.id === entry.classId)
            if (!classDef?.spellcasting) return null

            const sc = classDef.spellcasting
            const spellKind = sc.spellsMode === 'prepared' ? 'prepared' : 'known'
            const spellKindLabel = sc.spellsMode === 'prepared' ? 'Prepared' : 'Known'

            const cantripIds = entry.cantripIds ?? []
            const spellIds = spellKind === 'prepared' ? (entry.spellIdsPrepared ?? []) : (entry.spellIdsKnown ?? [])
            const subclassSpells = subclassSpellGrants(derived.classDefs, entry)

            return (
              <div key={entry.id} className="sheet-spell-section">
                <p className="sheet-hint" style={{ marginBottom: 'var(--space-1)' }}>
                  <strong>{classDef.name} ({spellKindLabel} spells, {ABILITY_LABELS[sc.ability]}-based)</strong>
                </p>

                {cantripIds.length > 0 ? (
                  <>
                    <p className="create-list-title" style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      Cantrips ({cantripIds.length})
                    </p>
                    <ul className="sheet-features">
                      {cantripIds.map((id) => {
                        const spell = getSpell(id)
                        return (
                          <li key={id} className="sheet-spell-pick">
                            <span className="sheet-feature-name">{spell?.name ?? id}</span>
                            {spell && (
                              <p className="sheet-feature-desc" style={{ fontSize: 'var(--text-xs)', marginTop: '0.1rem' }}>
                                {spell.school} · {spell.castingTime} · {spell.range} · {spell.duration}
                                {spell.concentration ? ' · Concentration' : ''}
                              </p>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </>
                ) : (
                  <p className="sheet-empty-note" style={{ marginTop: 'var(--space-1)' }}>No cantrips selected.</p>
                )}

                {spellIds.length > 0 ? (
                  <>
                    <p className="create-list-title" style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      {spellKindLabel} Spells ({spellIds.length})
                    </p>
                    <ul className="sheet-features">
                      {spellIds.map((id) => {
                        const spell = getSpell(id)
                        return (
                          <li key={id} className="sheet-spell-pick">
                            <span className="sheet-feature-name">{spell?.name ?? id}</span>
                            {spell && (
                              <p className="sheet-feature-desc" style={{ fontSize: 'var(--text-xs)', marginTop: '0.1rem' }}>
                                {spell.school} · {spell.castingTime} · {spell.range} · {spell.duration}
                                {spell.concentration ? ' · Concentration' : ''}
                              </p>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </>
                ) : (
                  <p className="sheet-empty-note" style={{ marginTop: 'var(--space-1)' }}>
                    No {spellKindLabel.toLowerCase()} spells selected.
                  </p>
                )}

                {/* Subclass spell pools live on the class entry rather than in
                    `spellIdsPrepared`, because they are always prepared and so
                    never count against the prepared list. */}
                {subclassSpells.map((grant) => {
                  const notes: string[] = []
                  if (grant.alwaysPrepared) {
                    notes.push('Always prepared, so these do not count against your prepared spells.')
                  }
                  if (grant.replaceableEachLevel) {
                    notes.push(`You may swap one of them for another each time you gain a ${classDef.name} level.`)
                  }

                  return (
                    <div key={grant.featureId} className="sheet-subclass-spells">
                      <p
                        className="create-list-title"
                        style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-1)' }}
                      >
                        {grant.subclassName}: {grant.featureName} ({grant.spellIds.length})
                      </p>
                      {notes.length > 0 ? <p className="sheet-hint">{notes.join(' ')}</p> : null}
                      {grant.spellIds.length > 0 ? (
                        <ul className="sheet-features">
                          {grant.spellIds.map((spellId) => {
                            const spell = getSpell(spellId)
                            const label = spell?.name ?? spellId
                            return (
                              <li key={spellId} className="sheet-spell-pick sheet-spell-pick--removable">
                                <div>
                                  <span className="sheet-feature-name">{label}</span>
                                  {spell && (
                                    <p
                                      className="sheet-feature-desc"
                                      style={{ fontSize: 'var(--text-xs)', marginTop: '0.1rem' }}
                                    >
                                      Level {spell.level} · {spell.school} · {spell.castingTime} ·{' '}
                                      {spell.range} · {spell.duration}
                                      {spell.concentration ? ' · Concentration' : ''}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  icon="close"
                                  aria-label={`Remove ${label} so it can be replaced`}
                                  onClick={() => onRemoveSubclassSpell(entry.id, grant.featureId, spellId)}
                                />
                              </li>
                            )
                          })}
                        </ul>
                      ) : (
                        <p className="sheet-empty-note">
                          Nothing picked yet. This unlocks at {classDef.name} {grant.level}.
                        </p>
                      )}
                    </div>
                  )
                })}

                {cantripIds.length === 0 && spellIds.length === 0 && subclassSpells.length === 0 && (
                  <p className="sheet-empty-note">
                    No spells or cantrips picked for this class yet. Use the level-up flow or edit the character to select them.
                  </p>
                )}
              </div>
            )
          })}
        </>
      )}
    </Card>
  )
}

/**
 * Spells a species grants — both species-wide (e.g., Tiefling Thaumaturgy) and
 * lineage-specific (Elf/Gnome/Tiefling lineage choices) — listed alongside the
 * class spells rather than in a list of their own, because at the table you
 * reach for both from the same place.
 *
 * Source tagging matches the character-creation picker exactly: a lineage spell
 * is tagged "Race", and the nuance (whether it is *also* on a class list, which
 * happens for High Elf `prestidigitation` and both-lineage `darkness`) lives in
 * the tag's `title` since `Tag` takes no `aria-*` prop.
 *
 * Species-wide grants use the same visual treatment but the tooltip says
 * "Granted by your species" instead of "Granted by your lineage".
 *
 * Cantrips keep their own section, per the same rule the class sections use.
 * No remove button: these are fixed grants, not picks, so there is nothing to
 * swap out and no replacement to free a slot for.
 */
function LineageSpellsBlock({ derived }: { derived: DerivedCharacter }) {
  const speciesId = derived.character.species.speciesId
  const lineageId = derived.character.species.lineageId

  // Collect lineage grants from the stored lineageSpellIds (written on level-up)
  const granted = derived.character.lineageSpellIds ?? {}
  const lineageRows = Object.entries(granted)
    .map(([level, ids]) => ({
      level: Number(level),
      ids: Array.isArray(ids) ? ids : [],
    }))
    .filter((row) => row.ids.length > 0)
    .sort((a, b) => a.level - b.level)

  // Collect species-wide grants (pure function of speciesId + level, no persistence)
  const speciesGrants = speciesSpellGrantsUpTo(
    speciesId,
    derived.level,
    (spellId) => {
      const spell = getSpell(spellId)
      return spell ? { name: spell.name, level: spell.level } : null
    },
  )

  if (lineageRows.length === 0 && speciesGrants.length === 0) return null

  const classIds = new Set(derived.character.classes.map((entry) => entry.classId))

  // Merge species-wide grants into the same level buckets as lineage grants
  const mergedByLevel = new Map<number, { spellId: string; source: 'lineage' | 'species'; grantedAt: number }[]>()
  for (const row of lineageRows) {
    for (const spellId of row.ids) {
      const bucket = mergedByLevel.get(row.level) ?? []
      bucket.push({ spellId, source: 'lineage', grantedAt: row.level })
      mergedByLevel.set(row.level, bucket)
    }
  }
  for (const grant of speciesGrants) {
    const bucket = mergedByLevel.get(grant.level) ?? []
    bucket.push({ spellId: grant.spellId, source: 'species', grantedAt: grant.grantedAt })
    mergedByLevel.set(grant.level, bucket)
  }

  const sortedLevels = Array.from(mergedByLevel.keys()).sort((a, b) => a - b)
  const hasCantrips = mergedByLevel.has(0)

  const renderRow = (spellId: string, source: 'lineage' | 'species') => {
    const spell = getSpell(spellId)
    const label = spell?.name ?? spellId
    const alsoOnClass = spell ? spell.classes.some((id) => classIds.has(id)) : false
    const isSpecies = source === 'species'
    const title = isSpecies
      ? alsoOnClass
        ? 'Granted by your species — also on your class spell list.'
        : 'Granted by your species — not on your class spell list.'
      : alsoOnClass
      ? 'Granted by your lineage — also on your class spell list.'
      : 'Granted by your lineage — not on your class spell list.'
    return (
      <li key={spellId} className="sheet-spell-pick">
        <span className="sheet-feature-name">{label}</span>
        <Tag tone="accent" title={title} className="sheet-lineage-tag">
          Race
        </Tag>
        {spell && (
          <p className="sheet-feature-desc" style={{ fontSize: 'var(--text-xs)', marginTop: '0.1rem' }}>
            Level {spell.level} · {spell.school} · {spell.castingTime} · {spell.range} ·{' '}
            {spell.duration}
            {spell.concentration ? ' · Concentration' : ''}
          </p>
        )}
      </li>
    )
  }

  const lineage = lineageId ? LINEAGES_BY_ID[lineageId] : null

  return (
    <Card
      title="Species spells"
      className="sheet-card"
      actions={lineage ? <Tag tone="accent">{lineage.name}</Tag> : null}
    >
      <p className="sheet-hint">
        Granted by your species. Each spell is always prepared and can be cast once without a
        spell slot (regained on a Long Rest). You can also cast it using a spell slot of the
        appropriate level. These spells never count against your prepared spells and cannot be
        swapped out.
      </p>

      {lineage?.summary ? (
        <ExpandableText className="sheet-species-desc" lines={4}>
          {lineage.summary}
        </ExpandableText>
      ) : null}
      {lineage?.bonusTrait ? (
        <>
          <Divider label="Bonus trait" />
          <p className="sheet-feature-name">{lineage.bonusTrait}</p>
        </>
      ) : null}

      {hasCantrips ? (
        <>
          <Divider label="Cantrips" />
          <ul className="sheet-features">
            {mergedByLevel.get(0)!.map((g) => renderRow(g.spellId, g.source))}
          </ul>
        </>
      ) : null}

      {sortedLevels
        .filter((level) => level > 0)
        .map((level) => (
          <div key={level} className="sheet-subclass-spells">
            <p
              className="create-list-title"
              style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-1)' }}
            >
              Level {level} Spells ({mergedByLevel.get(level)!.length})
            </p>
            <ul className="sheet-features">
              {mergedByLevel.get(level)!.map((g) => renderRow(g.spellId, g.source))}
            </ul>
          </div>
        ))}
    </Card>
  )
}

function ClassesBlock({ derived }: { derived: DerivedCharacter }) {
  return (
    <>
      {derived.character.classes.map((entry) => {
        const classDef = derived.classDefs.find((c) => c.id === entry.classId)
        const gained = classDef ? featuresUpTo(classDef, entry.level) : []
        const subclass = entry.subclassId
          ? classDef?.subclasses.find((s) => s.id === entry.subclassId)
          : undefined
        return (
          <Card
            key={entry.id}
            title={classLine(entry, classDef)}
            className="sheet-card"
            actions={
              entry.isPrimary ? <Tag tone="accent">Primary</Tag> : <Tag tone="muted">Multiclass</Tag>
            }
          >
            {!classDef ? (
              <p className="sheet-empty-note">
                No class definition matches <code className="mono">{entry.classId}</code>.
              </p>
            ) : (
              <>
                {classDef.hitDie ? (
                  <p className="sheet-hint">Hit die d{classDef.hitDie}</p>
                ) : null}
                {classDef.spellcasting ? (
                  <p className="sheet-hint">
                    Spellcasting ability: {ABILITY_LABELS[classDef.spellcasting.ability]}
                  </p>
                ) : null}
                {classDef.toolProficiencies && classDef.toolProficiencies.length > 0 ? (
                  <>
                    <Divider label="Tool Proficiencies" />
                    <ul className="sheet-features">
                      {classDef.toolProficiencies.map((toolName, idx) => (
                        <li key={idx} className="sheet-feature">
                          <p className="sheet-feature-name">{toolName}</p>
                          <p className="sheet-feature-desc" style={{ fontSize: 'var(--text-xs)' }}>
                            {(() => {
                              const tool = getTool(toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                              return tool ? `${tool.category} · ${tool.ability ? `${tool.ability.toUpperCase()}-based` : ''}` : ''
                            })()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {entry.weaponMasteries && entry.weaponMasteries.length > 0 ? (
                  <>
                    <Divider label="Weapon Mastery" />
                    <ul className="sheet-features">
                      {entry.weaponMasteries.map((mastery) => (
                        <li key={mastery} className="sheet-feature">
                          <p className="sheet-feature-name">{mastery}</p>
                          <p className="sheet-feature-desc" style={{ fontSize: 'var(--text-xs)' }}>Weapon mastery property</p>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {subclass ? (
                  <div className="sheet-subclass">
                    <h3 className="sheet-subclass-name">{subclass.name}</h3>
                    <ExpandableText className="sheet-subclass-desc" lines={5}>
                      {subclass.description}
                    </ExpandableText>
                  </div>
                ) : classDef.subclassLevel > entry.level ? (
                  <p className="sheet-hint">
                    Chooses a subclass at {classDef.name} level {classDef.subclassLevel}.
                  </p>
                ) : null}
                {gained.length > 0 ? (
                  <>
                    <Divider label={`Features through ${classDef.name} ${entry.level}`} />
                    <ul className="sheet-features">
                      {gained.map((feature) => (
                        <li key={`${feature.level}-${feature.name}`} className="sheet-feature">
                          <span className="sheet-feature-level">L{feature.level}</span>
                          <div>
                            <p className="sheet-feature-name">{feature.name}</p>
                            <ExpandableText className="sheet-feature-desc" lines={4}>
                              {feature.description}
                            </ExpandableText>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </>
            )}
          </Card>
        )
      })}
    </>
  )
}

function SpeciesBackgroundBlock({ derived }: { derived: DerivedCharacter }) {
  const { species, background } = derived
  return (
    <>
      {species ? (
        <Card title={species.name} className="sheet-card">
          <p className="sheet-hint">
            {species.size} · {species.speed} ft base speed
          </p>
          <ExpandableText className="sheet-species-desc" lines={5}>
            {species.description}
          </ExpandableText>
          {species.traits.length > 0 ? (
            <>
              <Divider label="Traits" />
              <ul className="sheet-features">
                {species.traits.map((trait) => (
                  <li key={trait.name} className="sheet-feature">
                    <div>
                      <p className="sheet-feature-name">{trait.name}</p>
                      <ExpandableText className="sheet-feature-desc" lines={4}>
                        {trait.description}
                      </ExpandableText>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Card>
      ) : null}

      {background ? (
        <Card title={background.name} className="sheet-card">
          <ExpandableText className="sheet-species-desc" lines={5}>
            {background.description}
          </ExpandableText>
          {background.skillsGranted.length > 0 ? (
            <p className="sheet-hint">
              Proficient in {background.skillsGranted.map((s) => skillName(s)).join(', ')}.
            </p>
          ) : null}
          {(() => {
            const toolsGranted = background.toolsGranted ?? []
            const toolsChosen = derived.character.background.toolProficiencies ?? []
            const allTools = [...toolsGranted, ...toolsChosen]
            if (allTools.length === 0) return null
            return (
              <>
                <Divider label="Tool Proficiencies" />
                <ul className="sheet-features">
                  {allTools.map((toolName) => (
                    <li key={toolName} className="sheet-feature">
                      <p className="sheet-feature-name">{toolName}</p>
                      <p className="sheet-feature-desc" style={{ fontSize: 'var(--text-xs)' }}>
                        {(() => {
                          const tool = getTool(toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                          return tool ? `${tool.category} · ${tool.ability ? `${tool.ability.toUpperCase()}-based` : ''}` : ''
                        })()}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )
})()}
            <Divider label="Origin feat" />
            <p className="sheet-feature-name">{background.originFeatName}</p>
            <ExpandableText className="sheet-feature-desc" lines={4}>
              {background.originFeatDescription}
            </ExpandableText>
</Card>
        ) : null}
      </>
    )
  }

const COIN_LABELS: Record<(typeof COIN_TYPES)[number], string> = {
  cp: 'Copper pieces',
  sp: 'Silver pieces',
  gp: 'Gold pieces',
}

/**
 * Coin purse: a compact three-cell readout at rest that opens into the same
 * labelled stepper fields the hit point tracker uses. Every change is written
 * straight through the sheet's save path, so there is no separate Save button,
 * and the purse is normalized on the way out so cp and sp stay under 10.
 */
function CoinPurseEditor({
  coins,
  onCoinsChange,
}: {
  coins: CoinPurse
  onCoinsChange: (coins: CoinPurse) => void
}) {
  const [editing, setEditing] = useState(false)
  const regionId = useId()
  const titleId = `${regionId}-title`

  const setCoin = (coin: keyof CoinPurse, value: number) => {
    onCoinsChange(normalizeCoinPurse({ ...coins, [coin]: value }))
  }

  return (
    <div className="sheet-coins">
      <div className="sheet-coins-head">
        <span className="sheet-coins-title" id={titleId}>
          Coin purse
        </span>
        <Button
          size="sm"
          variant="ghost"
          icon="edit"
          aria-expanded={editing}
          aria-controls={regionId}
          onClick={() => setEditing((open) => !open)}
        >
          {editing ? 'Done' : 'Edit coins'}
        </Button>
      </div>

      {editing ? null : (
        <ul className="sheet-coins-display" aria-labelledby={titleId}>
          {COIN_TYPES.map((coin) => (
            <li key={coin} className="sheet-coins-cell">
              <span className="sheet-coins-amount">{coins[coin].toLocaleString()}</span>
              <span className="sheet-coins-unit">{coin}</span>
            </li>
          ))}
        </ul>
      )}

      <div
        className="sheet-coins-fields"
        id={regionId}
        role="group"
        aria-labelledby={titleId}
        hidden={!editing}
      >
        {COIN_TYPES.map((coin) => (
          <Field key={coin} label={`${COIN_LABELS[coin]} (${coin})`}>
            <NumberInput
              value={coins[coin]}
              min={0}
              onValueChange={(value) => setCoin(coin, value)}
              decrementLabel={`Decrease ${COIN_LABELS[coin]}`}
              incrementLabel={`Increase ${COIN_LABELS[coin]}`}
            />
          </Field>
        ))}
      </div>

      {editing ? (
        <p className="sheet-hint">
          Changes save as you make them. Ten of one coin carry into the next.
        </p>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

/** 2024 rule: a character may attune to at most three magic items. */
const MAX_ATTUNED = 3

type ItemKind = 'weapon' | 'armor' | 'gear'

interface CatalogEntry {
  id: string
  name: string
  kind: ItemKind
  /** Heading this item is listed under: "Weapons", "Armor", or a gear category. */
  group: string
  cost?: string
  weightLb?: number
  /** Short catalogue summary shown under the name, where the catalogue has one. */
  detail?: string
}

const GEAR_GROUP_LABELS: Record<GearCategory, string> = {
  adventuringGear: 'Adventuring gear',
  pack: 'Packs',
  tool: 'Tools',
  focus: 'Spellcasting focuses',
  holySymbol: 'Holy symbols',
  instrument: 'Instruments',
  clothing: 'Clothing',
}

const ARMOR_CATEGORY_LABELS: Record<string, string> = {
  light: 'Light armor',
  medium: 'Medium armor',
  heavy: 'Heavy armor',
  shield: 'Shield',
}

/**
 * Weapons, armor and gear flattened into one list: this is the only shape the
 * picker and the carried rows read from, so ids resolve the same way in both.
 */
const CATALOG: CatalogEntry[] = [
  ...WEAPONS.map(
    (weapon): CatalogEntry => ({
      id: weapon.id,
      name: weapon.name,
      kind: 'weapon',
      group: 'Weapons',
      cost: weapon.cost,
      weightLb: weapon.weightLb,
      detail: `${weapon.damage} ${weapon.damageType} · ${weapon.mastery}`,
    }),
  ),
  ...ARMOR.map(
    (armor): CatalogEntry => ({
      id: armor.id,
      name: armor.name,
      kind: 'armor',
      group: 'Armor',
      cost: armor.cost,
      weightLb: armor.weightLb,
      detail:
        armor.category === 'shield' || armor.baseAc === null
          ? (ARMOR_CATEGORY_LABELS[armor.category] ?? 'Armor')
          : `${ARMOR_CATEGORY_LABELS[armor.category] ?? 'Armor'} · AC ${armor.baseAc}`,
    }),
  ),
  ...GEAR.map(
    (gear): CatalogEntry => ({
      id: gear.id,
      name: gear.name,
      kind: 'gear',
      group: GEAR_GROUP_LABELS[gear.category],
      cost: gear.cost,
      weightLb: gear.weightLb,
    }),
  ),
]

const CATALOG_BY_ID = new Map(CATALOG.map((entry) => [entry.id, entry]))

/** Order the carried list is grouped in; groups with no items are skipped. */
const GROUP_ORDER = [
  'Weapons',
  'Armor',
  'Packs',
  'Adventuring gear',
  'Clothing',
  'Holy symbols',
  'Spellcasting focuses',
  'Tools',
  'Instruments',
  'Other',
]

/** Joins the parts a catalogue entry provides, dropping the ones it omits. */
function joinMeta(parts: (string | undefined)[]): string {
  return parts.filter((part) => part !== undefined && part !== '').join(' · ')
}

function inventoryMeta(entry: CatalogEntry | null): string {
  if (!entry) return 'Not in the equipment catalogue'
  const weight = entry.weightLb === undefined ? undefined : `${entry.weightLb} lb`
  return joinMeta([entry.detail, entry.cost, weight])
}

interface InventoryRowData {
  item: InventoryItem
  entry: CatalogEntry | null
}

function groupInventoryRows(rows: InventoryRowData[]): { group: string; rows: InventoryRowData[] }[] {
  const buckets = new Map<string, InventoryRowData[]>()
  for (const row of rows) {
    const group = row.entry?.group ?? 'Other'
    const bucket = buckets.get(group)
    if (bucket) {
      bucket.push(row)
    } else {
      buckets.set(group, [row])
    }
  }

  const extraGroups = Array.from(buckets.keys()).filter((group) => !GROUP_ORDER.includes(group))
  const grouped: { group: string; rows: InventoryRowData[] }[] = []
  for (const group of [...GROUP_ORDER, ...extraGroups]) {
    const bucket = buckets.get(group)
    if (!bucket) continue
    bucket.sort((a, b) =>
      (a.entry?.name ?? a.item.itemId).localeCompare(b.entry?.name ?? b.item.itemId),
    )
    grouped.push({ group, rows: bucket })
  }
  return grouped
}

function InventoryItemRow({
  item,
  entry,
  attunedCount,
  capNoteId,
  onQuantity,
  onRemove,
  onEquipped,
  onAttuned,
}: {
  item: InventoryItem
  entry: CatalogEntry | null
  attunedCount: number
  capNoteId: string
  onQuantity: (quantity: number) => void
  onRemove: () => void
  onEquipped: (equipped: boolean) => void
  onAttuned: (attuned: boolean) => void
}) {
  const quantityId = useId()
  const name = entry?.name ?? item.itemId
  const canEquip = entry?.kind === 'weapon' || entry?.kind === 'armor'
  const attuneBlocked = !item.attuned && attunedCount >= MAX_ATTUNED

  return (
    <li className="sheet-inv-row">
      <div className="sheet-inv-main">
        <span className="sheet-inv-name">{name}</span>
        <span className="sheet-inv-meta">{inventoryMeta(entry)}</span>
      </div>

      <div className="sheet-inv-controls">
        <div className="sheet-inv-qty">
          <label className="visually-hidden" htmlFor={quantityId}>
            Quantity of {name}
          </label>
          <NumberInput
            id={quantityId}
            value={item.quantity}
            min={1}
            onValueChange={onQuantity}
            decrementLabel={`Decrease quantity of ${name}`}
            incrementLabel={`Increase quantity of ${name}`}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon="trash"
          aria-label={`Remove ${name}`}
          onClick={onRemove}
        />
      </div>

      {entry ? (
        <div className="sheet-inv-toggles">
          {canEquip ? (
            <label className="sheet-inv-toggle">
              <input
                type="checkbox"
                checked={item.equipped}
                onChange={(event) => onEquipped(event.target.checked)}
              />
              <span>Equipped</span>
            </label>
          ) : null}
          <label className="sheet-inv-toggle">
            <input
              type="checkbox"
              checked={item.attuned}
              disabled={attuneBlocked}
              aria-describedby={attuneBlocked ? capNoteId : undefined}
              onChange={(event) => onAttuned(event.target.checked)}
            />
            <span>Attuned</span>
          </label>
        </div>
      ) : null}
    </li>
  )
}

/**
 * Carried items, grouped by kind, plus the catalogue picker that adds them.
 * Quantity, equip and attune changes are written through the sheet's save path.
 */
function InventoryBlock({
  inventory,
  onInventoryChange,
}: {
  inventory: InventoryItem[]
  onInventoryChange: (inventory: InventoryItem[]) => void
}) {
  const [adding, setAdding] = useState(false)
  const [query, setQuery] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const addId = useId()
  const capNoteId = `${addId}-attune-cap`

  const attunedCount = inventory.filter((item) => item.attuned).length
  const attuneAtLimit = attunedCount >= MAX_ATTUNED

  const rows: InventoryRowData[] = inventory.map((item) => ({
    item,
    entry: CATALOG_BY_ID.get(item.itemId) ?? null,
  }))
  const groups = groupInventoryRows(rows)

  const needle = query.trim().toLowerCase()
  const matches = CATALOG.filter(
    (entry) =>
      (groupFilter === 'all' || entry.group === groupFilter) &&
      (needle === '' || entry.name.toLowerCase().includes(needle)),
  ).sort((a, b) => a.name.localeCompare(b.name))
  const visible = matches.slice(0, 40)
  const countText =
    matches.length === 0
      ? 'No items match.'
      : `${matches.length} item${matches.length === 1 ? '' : 's'}${
          matches.length > visible.length ? `, showing the first ${visible.length}` : ''
        }`

  const filterOptions = [
    { value: 'all', label: 'All categories' },
    ...GROUP_ORDER.filter((group) => CATALOG.some((entry) => entry.group === group)).map(
      (group) => ({ value: group, label: group }),
    ),
  ]

  const addItem = (itemId: string) => {
    const owned = inventory.some((item) => item.itemId === itemId)
    onInventoryChange(
      owned
        ? inventory.map((item) =>
            item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...inventory, { itemId, quantity: 1, equipped: false, attuned: false }],
    )
  }

  const setQuantity = (itemId: string, quantity: number) => {
    onInventoryChange(
      inventory.map((item) =>
        item.itemId === itemId
          ? { ...item, quantity: Math.max(1, Math.round(quantity)) }
          : item,
      ),
    )
  }

  const removeItem = (itemId: string) =>
    onInventoryChange(inventory.filter((item) => item.itemId !== itemId))

  const setFlag = (itemId: string, flag: 'equipped' | 'attuned', value: boolean) => {
    // The cap is enforced here as well as in the UI, so a stale render cannot
    // attune a fourth item.
    if (flag === 'attuned' && value && attunedCount >= MAX_ATTUNED) return
    onInventoryChange(
      inventory.map((item) => {
        if (item.itemId !== itemId) return item
        return flag === 'equipped' ? { ...item, equipped: value } : { ...item, attuned: value }
      }),
    )
  }

  return (
    <Card
      title="Inventory"
      className="sheet-card"
      actions={
        <>
          <Tag tone={attunedCount > MAX_ATTUNED ? 'danger' : attuneAtLimit ? 'warning' : 'accent'}>
            Attuned {attunedCount} / {MAX_ATTUNED}
          </Tag>
          <Button
            size="sm"
            variant="secondary"
            icon="plus"
            aria-expanded={adding}
            aria-controls={addId}
            onClick={() => setAdding((open) => !open)}
          >
            {adding ? 'Close' : 'Add item'}
          </Button>
        </>
      }
    >
      <div className="sheet-inv">
        <p className="sheet-hint">
          Add items from the equipment catalogue to track quantity, equipment and attunement.
          Starting equipment is listed as written and is not linked to this list.
        </p>

        {attuneAtLimit ? (
          <p className="sheet-inv-cap" id={capNoteId} role="note">
            <Icon name="alert" size={14} />
            <span>
              {attunedCount > MAX_ATTUNED
                ? `${attunedCount} items are attuned — the limit is ${MAX_ATTUNED}. Untune one before attuning another.`
                : `Attunement limit reached: ${MAX_ATTUNED} items. Untune one before attuning another.`}
            </span>
          </p>
        ) : null}

        <div className="sheet-inv-add" id={addId} hidden={!adding}>
          <div className="sheet-inv-toolbar">
            <Field label="Search equipment">
              <TextInput
                type="search"
                value={query}
                onValueChange={setQuery}
                placeholder="Rope, javelin, chain mail"
              />
            </Field>
            <Field label="Category">
              <Select
                value={groupFilter}
                onValueChange={setGroupFilter}
                options={filterOptions}
              />
            </Field>
          </div>

          <p className="sheet-inv-count" aria-live="polite">
            {countText}
          </p>

          {matches.length === 0 ? (
            <p className="sheet-empty-note">No items match that search.</p>
          ) : (
            <ul className="sheet-inv-results">
              {visible.map((entry) => {
                const owned =
                  inventory.find((item) => item.itemId === entry.id)?.quantity ?? 0
                const weight =
                  entry.weightLb === undefined ? undefined : `${entry.weightLb} lb`
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      className="sheet-inv-result"
                      onClick={() => addItem(entry.id)}
                    >
                      <span className="sheet-inv-result-body">
                        <span className="sheet-inv-result-name">{entry.name}</span>
                        <span className="sheet-inv-result-meta">
                          {joinMeta([
                            entry.group,
                            entry.cost,
                            weight,
                            owned > 0 ? `${owned} in inventory` : undefined,
                          ])}
                        </span>
                      </span>
                      <span className="sheet-inv-result-action">
                        <Icon name="plus" size={14} />
                        Add
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {rows.length === 0 ? (
          <p className="sheet-empty-note">
            No items tracked yet. Use Add item to pick from the equipment catalogue.
          </p>
        ) : (
          groups.map(({ group, rows: groupRows }) => (
            <div key={group} className="sheet-inv-group">
              <h3 className="sheet-inv-group-name">{group}</h3>
              <ul className="sheet-inv-list">
                {groupRows.map(({ item, entry }) => (
                  <InventoryItemRow
                    key={item.itemId}
                    item={item}
                    entry={entry}
                    attunedCount={attunedCount}
                    capNoteId={capNoteId}
                    onQuantity={(quantity) => setQuantity(item.itemId, quantity)}
                    onRemove={() => removeItem(item.itemId)}
                    onEquipped={(equipped) => setFlag(item.itemId, 'equipped', equipped)}
                    onAttuned={(attuned) => setFlag(item.itemId, 'attuned', attuned)}
                  />
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

function EquipmentCoinageBlock({
  character,
  derived,
  onCoinsChange,
}: {
  character: Character
  derived: DerivedCharacter
  onCoinsChange: (coins: CoinPurse) => void
}) {
  const bgEquipment = derived.background ? startingEquipmentFor(derived.background.id, 'background') : undefined;
  const bgOpt = bgEquipment?.options.find((o) => o.id === character.background.startingEquipmentOptionId);

  // Get class equipment for the primary class (first entry)
  const primaryClassEntry = character.classes[0];
  const classEquipment = primaryClassEntry ? startingEquipmentFor(primaryClassEntry.classId, 'class') : undefined;
  const classOpt = classEquipment?.options.find((o) => o.id === primaryClassEntry?.startingEquipmentOptionId);

  // Only render the package section if there's something to show
  const hasEquipment = (bgEquipment && bgEquipment.options.length > 0) || (classEquipment && classEquipment.options.length > 0);

  return (
    <Card title="Equipment & Coinage" className="sheet-card">
      {hasEquipment ? (
        <>
          {bgEquipment && bgEquipment.options.length > 0 && (
            <div className="sheet-equip-package">
              <p className="sheet-hint sheet-equip-origin">
                <strong>{derived.background?.name ?? 'Background'}</strong> — {bgOpt?.label ?? 'Not chosen'}
              </p>
              <p className="sheet-feature-desc sheet-equip-contents">
                {bgOpt
                  ? bgOpt.kind === 'coins'
                    ? `${bgOpt.coinsGp} GP`
                    : bgOpt.items
                  : '—'}
              </p>
            </div>
          )}
          {classEquipment && classEquipment.options.length > 0 && (
            <div className="sheet-equip-package">
              <p className="sheet-hint sheet-equip-origin">
                <strong>{derived.classDefs[0]?.name ?? 'Class'}</strong> — {classOpt?.label ?? 'Not chosen'}
              </p>
              <p className="sheet-feature-desc sheet-equip-contents">
                {classOpt
                  ? classOpt.kind === 'coins'
                    ? `${classOpt.coinsGp} GP`
                    : classOpt.items
                  : '—'}
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="sheet-empty-note">No starting equipment package chosen.</p>
      )}
      <CoinPurseEditor
        coins={character.coins ?? { cp: 0, sp: 0, gp: 0 }}
        onCoinsChange={onCoinsChange}
      />
    </Card>
  );
}

export default function CharacterSheetPage() {
  const {
    status,
    character,
    derived,
    error,
    reload,
    exportCharacter,
    setCurrentHp,
    adjustCurrentHp,
    setTemporaryHp,
    setHpBonusFlat,
    setHpOverride,
    healToFull,
    setCoins,
    setInventory,
    setAccent,
    removeSubclassSpell,
  } = useCharacterSheet()
  const navigate = useNavigate()

  if (status === 'loading') {
    return (
      <section className="page sheet-page">
        <header className="page-head">
          <div>
            <h1 className="page-title">Character sheet</h1>
            <p className="page-subtitle">Loading character</p>
          </div>
        </header>
        <div className="panel roster-loading" aria-busy="true" aria-live="polite">
          <p className="roster-loading-text">Loading character</p>
          <div className="skeleton-row" aria-hidden="true" />
          <div className="skeleton-row" aria-hidden="true" />
        </div>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="page sheet-page">
        <header className="page-head">
          <div>
            <h1 className="page-title">Character sheet</h1>
          </div>
        </header>
        <EmptyState
          tone="warning"
          icon="alert"
          title="Saved characters could not be read"
          description={error ?? 'Local storage returned no readable characters.'}
          action={
            <>
              <Button variant="secondary" onClick={reload}>
                Try again
              </Button>
              <Link className="link" to="/">
                Back to roster
              </Link>
            </>
          }
        />
      </section>
    )
  }

  if (status === 'not-found' || !character || !derived) {
    return (
      <section className="page sheet-page">
        <header className="page-head">
          <div>
            <h1 className="page-title">Character not found</h1>
          </div>
        </header>
        <EmptyState
          icon="search"
          title="That character is not in your roster"
          description={
            error
              ? `${error} It may have been deleted, or the link may be wrong.`
              : 'It may have been deleted, or the link may be wrong.'
          }
          action={
            <Link className="link" to="/">
              Back to roster
            </Link>
          }
        />
      </section>
    )
  }

  const displayName = character.meta.name.trim() || 'Unnamed character'
  const outstanding = derived.outstandingChoices.filter((choice) => !choice.resolved)

  return (
    <section
      className="page sheet-page"
      // Scopes this character's accent to this page only. `undefined` omits the
      // attribute entirely so a character with no override inherits the
      // app-wide accent from <html>.
      data-character-accent={character.accent ?? undefined}
    >
      <header className="page-head">
        <div>
          <h1 className="page-title">{displayName}</h1>
          <p className="page-subtitle">
            Level {derived.level} {derived.species?.name ?? ''}{' '}
            {derived.classDefs.length > 0
              ? derived.classDefs.map((c) => c.name).join(' / ')
              : 'no class'}
            {derived.background ? ` · ${derived.background.name}` : ''}
          </p>
        </div>
        <div className="page-actions">
          <Button
            variant="primary"
            icon="arrow-right"
            onClick={() => navigate(`/character/${character.id}/level-up`)}
          >
            Level up
          </Button>
          <Button
            variant="secondary"
            icon="edit"
            onClick={() => navigate(`/character/${character.id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="secondary" icon="download" onClick={exportCharacter}>
            Export JSON
          </Button>
        </div>
      </header>

      {error ? (
        <div className="banner banner--error" role="alert">
          <Icon name="alert" size={16} />
          <p className="banner-text">{error}</p>
        </div>
      ) : null}

      {derived.warnings.length > 0 ? (
        <div className="sheet-warnings" role="note">
          <div className="sheet-warnings-head">
            <Icon name="alert" size={16} />
            <h2 className="sheet-warnings-title">
              {derived.warnings.length} note
              {derived.warnings.length === 1 ? '' : 's'} about this character
            </h2>
          </div>
          <ul className="sheet-warnings-list">
            {derived.warnings.map((warning) => (
              <li key={warning} className="sheet-warnings-item">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {outstanding.length > 0 ? (
        <div className="banner banner--error" role="alert">
          <Icon name="alert" size={16} />
          <p className="banner-text">
            {outstanding.length} choice{outstanding.length === 1 ? '' : 's'} still outstanding:{' '}
            {outstanding.map((c) => c.label).join(', ')}
          </p>
        </div>
      ) : null}

      <div className="sheet-grid">
        <div className="sheet-column">
          <CombatBlock derived={derived} />
          <AttacksBlock character={character} />
          <HitPointTracker
            derived={derived}
            combat={character.combat}
            onCurrentHp={setCurrentHp}
            onAdjustHp={adjustCurrentHp}
            onTemporaryHp={setTemporaryHp}
            onHpOverride={setHpOverride}
            onHealFull={healToFull}
            onHpBonusFlat={setHpBonusFlat}
          />
          <AbilityBlock derived={derived} />
          <SavesBlock derived={derived} />
          <LineageSpellsBlock derived={derived} />
          <SpellcastingBlock derived={derived} onRemoveSubclassSpell={removeSubclassSpell} />
        </div>
        <div className="sheet-column">
          <Card title="Skills" className="sheet-card">
            <p className="sheet-hint">
              Proficiency comes from class, background, and species. Expertise doubles the
              proficiency bonus.
            </p>
            <ul className="sheet-skills">
              {derived.skills.map((skill) => (
                <SkillRow key={skill.key} skill={skill} />
              ))}
            </ul>
          </Card>
          <ClassesBlock derived={derived} />
          <SpeciesBackgroundBlock derived={derived} />
          <EquipmentCoinageBlock
            character={character}
            derived={derived}
            onCoinsChange={setCoins}
          />
          <InventoryBlock inventory={character.inventory} onInventoryChange={setInventory} />
          <Card title="Accent" className="sheet-card">
            <p className="sheet-hint">
              Give this character their own accent colour. The dashed chip on the left
              clears the override and follows the app-wide accent instead.
            </p>
            <CharacterAccentPicker
              value={character.accent ?? null}
              onChange={setAccent}
            />
          </Card>
        </div>
      </div>
    </section>
  )
}
