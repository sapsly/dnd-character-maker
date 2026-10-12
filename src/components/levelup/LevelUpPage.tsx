import { Link, useNavigate } from 'react-router-dom'
import type { AbilityKey, WeaponMasteryProperty } from '../../types/character'
import { WEAPON_MASTERY_PROPERTIES } from '../../types/character'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Divider } from '../ui/Divider'
import { EmptyState } from '../ui/EmptyState'
import { Field } from '../ui/Field'
import { Icon } from '../ui/Icon'
import { NumberInput } from '../ui/NumberInput'
import { Select } from '../ui/Select'
import { Tag } from '../ui/Tag'
import { ABILITY_LABELS, ABILITY_ORDER, formatModifier } from '../sheet/useCharacterSheet'
import { MAX_CHARACTER_LEVEL } from '../../lib/rules/leveling'
import { useLevelUp } from './useLevelUp'
import { SpellPicker } from '../create/SpellPicker'


/** Human label for an ability-key option id produced by the rules engine. */
function skillLabel(key: string): string {
  return key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function LevelUpPage() {
  const model = useLevelUp()
  const navigate = useNavigate()
  const {
    status,
    character,
    derived,
    error,
    saveError,
    atMaxLevel,
    entries,
    entryId,
    setEntryId,
    entry,
    entryClassName,
    newClassLevel,
    newTotalLevel,
    choices,
    draft,
    setDraft,
    featOptions,
    asiErrors,
    blockers,
    masteryCount,
    apply,
    reset,
  } = model

  // Spell pick helpers
  const classDef = derived?.classDefs.find((c) => c.id === entry?.classId)
  const spellcasting = classDef?.spellcasting
  const spellKind = spellcasting?.spellsMode === 'prepared' ? 'prepared' : 'known'

  if (status === 'loading') {
    return (
      <section className="page levelup-page">
        <header className="page-head">
          <div>
            <h1 className="page-title">Level up</h1>
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
      <section className="page levelup-page">
        <header className="page-head">
          <h1 className="page-title">Level up</h1>
        </header>
        <EmptyState
          tone="warning"
          icon="alert"
          title="Saved characters could not be read"
          description={error ?? 'Local storage returned no readable characters.'}
          action={
            <Link className="link" to="/">
              Back to roster
            </Link>
          }
        />
      </section>
    )
  }

  if (status === 'not-found' || !character || !derived || !entry) {
    return (
      <section className="page levelup-page">
        <header className="page-head">
          <h1 className="page-title">Character not found</h1>
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

  if (status === 'saved') {
    return (
      <section className="page levelup-page">
        <header className="page-head">
          <div>
            <h1 className="page-title">Level {character.level}</h1>
            <p className="page-subtitle">
              {character.meta.name.trim() || 'Unnamed character'} is now level {character.level}.
            </p>
          </div>
        </header>
        <EmptyState
          icon="check"
          title={`Level ${character.level} applied`}
          description="The character sheet now reflects this level."
          action={
            <>
              <Button variant="primary" onClick={() => navigate(`/character/${character.id}`)}>
                Open character sheet
              </Button>
              <Button variant="secondary" onClick={reset}>
                Level up again
              </Button>
            </>
          }
        />
      </section>
    )
  }

  if (atMaxLevel) {
    return (
      <section className="page levelup-page">
        <header className="page-head">
          <div>
            <h1 className="page-title">Level {character.level}</h1>
            <p className="page-subtitle">{character.meta.name.trim() || 'Unnamed character'}</p>
          </div>
        </header>
        <EmptyState
          icon="alert"
          title={`Already at the maximum level of ${MAX_CHARACTER_LEVEL}`}
          description="There is nothing further to gain."
          action={
            <Link className="link" to={`/character/${character.id}`}>
              Back to character sheet
            </Link>
          }
        />
      </section>
    )
  }

  const displayName = character.meta.name.trim() || 'Unnamed character'
  const hasChoices =
    choices !== null &&
    (choices.subclassChoice !== null ||
      choices.asiChoice !== null ||
      choices.weaponMasteryPicks.length > 0 ||
      choices.featureChoices.length > 0 ||
      choices.skillChoices.length > 0 ||
      choices.subclassSpellChoices.length > 0 ||
      choices.spellPicks.length > 0)

  const toggleIn = (list: string[], value: string, max: number): string[] => {
    if (list.includes(value)) return list.filter((v) => v !== value)
    if (list.length >= max) return list
    return [...list, value]
  }

  const toggleMastery = (mastery: WeaponMasteryProperty) => {
    setDraft((d) => {
      const has = d.masteries.includes(mastery)
      return {
        ...d,
        masteries: has ? d.masteries.filter((m) => m !== mastery) : [...d.masteries, mastery],
      }
    })
  }

  return (
    <section className="page levelup-page">
      <header className="page-head">
        <div>
          <h1 className="page-title">
            Level {character.level} <span className="levelup-arrow">→</span> {newTotalLevel}
          </h1>
          <p className="page-subtitle">
            {displayName} · advancing {entryClassName} from {entry.level} to {newClassLevel}
          </p>
        </div>
        <div className="page-actions">
          <Link className="link" to={`/character/${character.id}`}>
            Back to sheet
          </Link>
        </div>
      </header>

      {saveError ? (
        <div className="banner banner--error" role="alert">
          <Icon name="alert" size={16} />
          <p className="banner-text">{saveError}</p>
        </div>
      ) : null}

      {entries.length > 1 ? (
        <Card title="Which class is advancing?" className="levelup-card">
          <p className="sheet-hint">
            This character has {entries.length} class entries. The level is added to the one you
            pick here, and that class decides what is offered below.
          </p>
          <Field label="Class entry" htmlFor="levelup-entry" className="levelup-field">
            <Select
              id="levelup-entry"
              value={entryId ?? ''}
              onValueChange={setEntryId}
            >
              {entries.map((e) => {
                const name = derived.classDefs.find((c) => c.id === e.classId)?.name ?? e.classId
                return (
                  <option key={e.id} value={e.id}>
                    {name} {e.level}
                    {e.isPrimary ? ' (primary)' : ''}
                  </option>
                )
              })}
            </Select>
          </Field>
        </Card>
      ) : null}

      {blockers.length > 0 ? (
        <div className="banner banner--error" role="status">
          <Icon name="alert" size={16} />
          <p className="banner-text">
            Still needed: {blockers.map((b) => `${b.label} — ${b.reason}`).join(' ')}
          </p>
        </div>
      ) : null}

      {!hasChoices ? (
        <Card title="No choices at this level" className="levelup-card">
          <p className="sheet-hint">
            Nothing in the SRD offers a choice when {entryClassName} reaches level {newClassLevel}.
            Hit the button below to take the level.
          </p>
        </Card>
      ) : null}

      {choices?.subclassChoice ? (
        <Card title={`${entryClassName} subclass`} className="levelup-card">
          <p className="sheet-hint">
            Your {entryClassName} reaches its subclass level. One pick, and it sticks.
          </p>
          <ul className="levelup-options">
            {choices.subclassChoice.subclasses.map((subclass) => {
              const full = derived.classDefs
                .find((c) => c.id === entry.classId)
                ?.subclasses.find((s) => s.id === subclass.id)
              return (
                <li key={subclass.id}>
                  <label className="levelup-option">
                    <input
                      type="radio"
                      name="levelup-subclass"
                      value={subclass.id}
                      checked={draft.subclassId === subclass.id}
                      onChange={() => setDraft((d) => ({ ...d, subclassId: subclass.id }))}
                    />
                    <span className="levelup-option-body">
                      <span className="levelup-option-name">{subclass.name}</span>
                      {full ? (
                        <span className="levelup-option-desc">{full.description}</span>
                      ) : null}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </Card>
      ) : null}

      {choices?.asiChoice ? (
        <Card
          title={`Ability score improvement (${entryClassName} ${choices.asiChoice.level})`}
          className="levelup-card"
        >
          <p className="sheet-hint">
            Take a feat, or increase scores: +2 to one ability, or +1 to two. No score may exceed
            20. Species and background bonuses already count toward that cap.
          </p>

          <div className="levelup-modes" role="group" aria-label="How to spend the improvement">
            <label className="levelup-mode">
              <input
                type="radio"
                name="levelup-asi-mode"
                checked={draft.asi.mode === 'ability'}
                onChange={() =>
                  setDraft((d) => ({
                    ...d,
                    asi: { ...d.asi, mode: 'ability', featId: '', increases: {} },
                  }))
                }
              />
              <span>Ability score increase</span>
            </label>
            <label className="levelup-mode">
              <input
                type="radio"
                name="levelup-asi-mode"
                checked={draft.asi.mode === 'feat'}
                onChange={() =>
                  setDraft((d) => ({
                    ...d,
                    asi: { ...d.asi, mode: 'feat', increases: {} },
                  }))
                }
              />
              <span>Take a feat</span>
            </label>
          </div>

          {draft.asi.mode === 'ability' ? (
            <>
              <Divider label="Increases" />
              <ul className="levelup-abilities">
                {ABILITY_ORDER.map((key: AbilityKey) => (
                  <li key={key} className="levelup-ability">
                    <Field label={ABILITY_LABELS[key]} htmlFor={`asi-${key}`}>
                      <NumberInput
                        id={`asi-${key}`}
                        value={draft.asi.increases[key] ?? 0}
                        min={0}
                        max={2}
                        step={1}
                        onValueChange={(value) =>
                          setDraft((d) => {
                            const increases = { ...d.asi.increases }
                            if (value <= 0) {
                              delete increases[key]
                            } else {
                              increases[key] = value
                            }
                            return { ...d, asi: { ...d.asi, increases } }
                          })
                        }
                      />
                    </Field>
                    <span className="levelup-ability-preview">
                      {character.abilityScoreBase[key] +
                        (character.species.abilityBonuses[key] ?? 0) +
                        (character.background.abilityBonuses[key] ?? 0) +
                        (draft.asi.increases[key] ?? 0)}{' '}
                      ({formatModifier(
                        Math.floor(
                          (character.abilityScoreBase[key] +
                            (character.species.abilityBonuses[key] ?? 0) +
                            (character.background.abilityBonuses[key] ?? 0) +
                            (draft.asi.increases[key] ?? 0) -
                            10) /
                            2,
                        ),
                      )})
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <Divider label="Feat" />
              <Field label="Feat" htmlFor="asi-feat" className="levelup-field">
                <Select
                  id="asi-feat"
                  value={draft.asi.featId}
                  onValueChange={(value) =>
                    setDraft((d) => ({ ...d, asi: { ...d.asi, featId: value } }))
                  }
                  placeholder="Choose a feat"
                >
                  {featOptions.map((feat) => (
                    <option key={feat.id} value={feat.id}>
                      {feat.name}
                    </option>
                  ))}
                </Select>
              </Field>
              {draft.asi.featId ? (
                <FeatNote featId={draft.asi.featId} options={featOptions} newLevel={newTotalLevel} />
              ) : null}
              <p className="levelup-note">
                Prerequisites are shown but not checked: the SRD stores them as prose, and this app
                does not parse rule text.
              </p>
            </>
          )}

          {asiErrors.length > 0 ? (
            <ul className="levelup-errors" role="alert">
              {asiErrors.map((err) => (
                <li key={err} className="levelup-error">
                  {err}
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      ) : null}

      {choices && choices.weaponMasteryPicks.length > 0 ? (
        <Card title="Weapon mastery" className="levelup-card">
          <p className="sheet-hint">
            You may replace one property each time you gain a level, so this starts from what you
            already hold. {masteryCount} selected.
          </p>
          <ul className="levelup-masteries">
            {WEAPON_MASTERY_PROPERTIES.map((mastery) => {
              const held = draft.masteries.includes(mastery)
              return (
                <li key={mastery}>
                  <label className="levelup-option levelup-option--chip">
                    <input
                      type="checkbox"
                      checked={held}
                      onChange={() => toggleMastery(mastery)}
                    />
                    <span>{mastery}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </Card>
      ) : null}

      {choices && choices.featureChoices.length > 0
        ? choices.featureChoices.map((feature) => (
            <Card key={feature.featureId} title={feature.name} className="levelup-card">
              <p className="sheet-hint">
                {feature.source === 'subclass' && feature.subclassName ? `Granted by ${feature.subclassName}. ` : ''}
                Choose {feature.count} option{feature.count === 1 ? '' : 's'}.
              </p>
              <ul className="levelup-options">
                {feature.options.map((option) => {
                  const selected = draft.featureOptions[feature.featureId] ?? []
                  const checked = selected.includes(option.id)
                  return (
                    <li key={option.id}>
                      <label className="levelup-option">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setDraft((d) => ({
                              ...d,
                              featureOptions: {
                                ...d.featureOptions,
                                [feature.featureId]: toggleIn(selected, option.id, feature.count),
                              },
                            }))
                          }
                        />
                        <span className="levelup-option-body">
                          <span className="levelup-option-name">{option.name}</span>
                          <span className="levelup-option-desc">{option.description}</span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </Card>
          ))
        : null}

      {choices && choices.skillChoices.length > 0
        ? choices.skillChoices.map((skill) => (
            <Card
              key={skill.featureId}
              title={skill.source === 'subclass' && skill.subclassName ? `${skill.subclassName}: ${skill.name}` : 'Skill proficiencies'}
              className="levelup-card"
            >
              <p className="sheet-hint">
                {skill.source === 'subclass' && skill.subclassName ? `Granted by ${skill.subclassName}. ` : ''}
                Choose {skill.count} skill{skill.count === 1 ? '' : 's'}.
              </p>
              <ul className="levelup-options">
                {skill.skills.map((skillKey) => {
                  const selected = draft.skillOptions[skill.featureId] ?? []
                  const checked = selected.includes(skillKey)
                  return (
                    <li key={skillKey}>
                      <label className="levelup-option">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setDraft((d) => ({
                              ...d,
                              skillOptions: {
                                ...d.skillOptions,
                                [skill.featureId]: toggleIn(selected, skillKey, skill.count),
                              },
                            }))
                          }
                        />
                        <span className="levelup-option-body">
                          <span className="levelup-option-name">{skillLabel(skillKey)}</span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </Card>
          ))
        : null}

      {choices && choices.subclassSpellChoices.length > 0
        ? choices.subclassSpellChoices.map((pick) => {
            // Spells already stored for this pool are hidden from the picker, so
            // a replacement cannot duplicate a spell the character already has.
            const stored = entry?.featurePicks?.[pick.featureId] ?? [];
            const listLabel = pick.lists.join(', ');
            return (
              <Card
                key={pick.featureId}
                title={`${pick.subclassName}: ${pick.name}`}
                className="levelup-card"
              >
                <p className="sheet-hint">
                  {pick.replace
                    ? `Choose ${pick.count} spell${pick.count === 1 ? '' : 's'} from the ${listLabel} spell list to replace one of your stored choices.`
                    : `Choose ${pick.count} spell${pick.count === 1 ? '' : 's'} from the ${listLabel} spell list.`}
                  {pick.alwaysPrepared
                    ? ' They are always prepared and do not count against your prepared spells.'
                    : ''}
                </p>
                <SpellPicker
                  classIds={pick.lists}
                  minLevel={pick.minLevel}
                  maxLevel={pick.maxLevel}
                  excludeIds={stored}
                  count={pick.count}
                  pickedIds={draft.subclassSpellOptions[pick.featureId] ?? []}
                  onChange={(ids) =>
                    setDraft((d) => ({
                      ...d,
                      subclassSpellOptions: { ...d.subclassSpellOptions, [pick.featureId]: ids },
                    }))
                  }
                  showDescription={false}
                  sources={character.sources}
                />
              </Card>
            );
          })
        : null}

      {choices && choices.spellPicks.length > 0 ? (
        choices.spellPicks
          .filter((pick) => pick.classId === entry?.classId)
          .map((spellPick) => {
            const sc = classDef?.spellcasting
            if (!sc) return null

            const cantripCount = spellPick.cantripCount
            const spellCount = spellPick.spellCount
            const maxSpellLevel = Math.max(...spellPick.spellLevel, 1)
            const minSpellLevel = Math.min(...spellPick.spellLevel.filter((l) => l > 0), 1) || 1

            return (
              <Card key={`${spellPick.classId}-spells`} title={`${entryClassName} Spells & Cantrips`} className="levelup-card">
                <p className="sheet-hint">
                  {entryClassName} level {newClassLevel} grants {cantripCount} cantrip{cantripCount === 1 ? '' : 's'}
                  {spellCount > 0 ? ` and ${spellCount} ${spellKind} spell${spellCount === 1 ? '' : 's'}` : ''}.
                </p>

                {cantripCount > 0 && (
                  <SpellPicker
                    classId={entry.classId}
                    minLevel={0}
                    maxLevel={0}
                    count={cantripCount}
                    pickedIds={draft.cantripIds}
                    onChange={(ids) => setDraft((d) => ({ ...d, cantripIds: ids }))}
                    label={`Cantrips (choose ${cantripCount})`}
                    hint={`Select ${cantripCount} cantrip${cantripCount === 1 ? '' : 's'} from the ${entryClassName} spell list.`}
                    showDescription
                    sources={character.sources}
                  />
                )}

                {spellCount > 0 && (
                  <SpellPicker
                    classId={entry.classId}
                    minLevel={minSpellLevel}
                    maxLevel={maxSpellLevel}
                    count={spellCount}
                    pickedIds={spellKind === 'prepared' ? draft.spellIdsPrepared : draft.spellIdsKnown}
                    onChange={(ids) =>
                      setDraft((d) => ({
                        ...d,
                        [spellKind === 'prepared' ? 'spellIdsPrepared' : 'spellIdsKnown']: ids,
                      }))
                    }
                    label={`Level ${minSpellLevel}${minSpellLevel !== maxSpellLevel ? `–${maxSpellLevel}` : ''} spells (choose ${spellCount})`}
                    hint={`Select ${spellCount} spell${spellCount === 1 ? '' : 's'} to ${spellKind}.`}
                    showDescription
                    sources={character.sources}
                  />
                )}

                </Card>
            )
          })
      ) : null}

      <div className="levelup-actions">
        <Button
          variant="primary"
          icon="arrow-right"
          disabled={blockers.length > 0}
          onClick={apply}
        >
          Take {entryClassName} level {newClassLevel}
        </Button>
        <Button variant="ghost" onClick={reset}>
          Reset choices
        </Button>
        {blockers.length > 0 ? (
          <Tag tone="warning">
            {blockers.length} thing{blockers.length === 1 ? '' : 's'} left
          </Tag>
        ) : null}
      </div>
    </section>
  )
}

function FeatNote({
  featId,
  options,
  newLevel,
}: {
  featId: string
  options: { id: string; name: string; description: string; prerequisite?: string }[]
  newLevel: number
}) {
  const feat = options.find((f) => f.id === featId)
  if (!feat) return null
  const epicBoon = feat.prerequisite?.toLowerCase().includes('19') ?? false
  const tooEarly = epicBoon && newLevel < 19
  return (
    <div className={tooEarly ? 'levelup-note levelup-note--warn' : 'levelup-note'}>
      <p className="levelup-note-name">{feat.name}</p>
      <p className="levelup-note-desc">{feat.description}</p>
      {feat.prerequisite ? (
        <p className="levelup-note-prereq">Prerequisite: {feat.prerequisite}</p>
      ) : null}
      {tooEarly ? (
        <p className="levelup-note-prereq">
          This looks like an Epic Boon, which needs level 19. You are choosing it at level {newLevel}.
        </p>
      ) : null}
    </div>
  )
}
