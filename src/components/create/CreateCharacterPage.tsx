import { Link } from 'react-router-dom'
import type { AbilityKey, Character } from '../../types/character'
import { SPECIES } from '../../data/species'
import { BACKGROUNDS } from '../../data/backgrounds'
import { CLASSES } from '../../data/classes'
import { skillName } from '../../lib/rules/skillList'
import { getSpell } from '../../data/spells'
import { ARTISAN_TOOLS, GAMING_SETS, MUSICAL_INSTRUMENTS } from '../../data/tools'
import { startingEquipmentFor } from '../../data/startingEquipment'
import { lineagesForSpecies } from '../../data/lineages'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Divider } from '../ui/Divider'
import { Field } from '../ui/Field'
import { Icon } from '../ui/Icon'
import { NumberInput } from '../ui/NumberInput'
import { Select } from '../ui/Select'
import { Tag } from '../ui/Tag'
import { TextInput } from '../ui/TextInput'
import { SpellPicker } from './SpellPicker'
import { abilityModifier } from '../../lib/rules/ability'
import {
  ABILITY_KEYS,
  ABILITY_LABELS,
  MAX_ALLOCATED_SCORE,
  MAX_FINAL_SCORE,
  MAX_ROLLED_SCORE,
  MIN_ALLOCATED_SCORE,
  MIN_ROLLED_SCORE,
  POINT_BUY_BUDGET,
  WIZARD_STEPS,
  useCreateCharacter,
} from './useCreateCharacter'

function modifierText(score: number): string {
  const mod = abilityModifier(score)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

/**
 * `existing` switches the wizard from creation to editing: the same steps and
 * validation run, but the form starts from a saved character and saving patches
 * it in place instead of writing a new one.
 */
export default function CreateCharacterPage({ existing = null }: { existing?: Character | null }) {
  const model = useCreateCharacter(existing)
  const {
    state,
    isEdit,
    stepIndex,
    species,
    classDef,
    background,
    standardValues,
    pointsSpent: spent,
    pointsRemaining: remaining,
    stepErrors,
    equipmentErrors,
    canAdvance,
    canCreate,
    saving,
    saveError,
    setStep,
    next,
    back,
    setName,
    setPlayerName,
    setSpeciesId,
    setLineageId,
    setClassId,
    setBackgroundId,
    setScoreMethod,
    setAbilityScore,
    setBackgroundMode,
    setBackgroundBonus,
    setCantripIds,
    setSpellIdsKnown,
    setSpellIdsPrepared,
    setBackgroundTool,
    setSkillPicks,
    setWeaponMasteries,
    setBackgroundStartingEquipmentOptionId,
    setClassStartingEquipmentOptionId,
    create,
  } = model

  const isReview = state.step === 'review'

  // Elf, Gnome and Tiefling offer a lineage; every other species renders
  // nothing extra. `setSpeciesId` in the hook already clears a stale lineage
  // when the player switches to a species that has none, so this list is the
  // only gate the UI needs.
  const lineageOptions = lineagesForSpecies(state.speciesId)
  const selectedLineage =
    lineageOptions.find((option) => option.id === state.lineageId) ?? null

  return (
    <section className="page create-page">
      <header className="page-head">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit character' : 'New character'}</h1>
          <p className="page-subtitle">
            {isEdit
              ? 'Changing these origins does not change your level, spell slots, inventory or notes.'
              : 'Everything here comes from the SRD 5.2. Choices this app does not model are said so plainly rather than guessed.'}
          </p>
        </div>
      </header>

      <nav className="create-steps" aria-label="Creation steps">
        {WIZARD_STEPS.map((step, index) => {
          const isCurrent = step.id === state.step
          const isDone = index < stepIndex
          return (
            <button
              key={step.id}
              type="button"
              className={`create-step${isCurrent ? ' is-current' : ''}${isDone ? ' is-done' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              onClick={() => setStep(step.id)}
            >
              <span className="create-step-index" aria-hidden="true">
                {isDone ? <Icon name="check" size={14} /> : index + 1}
              </span>
              <span className="create-step-label">{step.label}</span>
            </button>
          )
        })}
      </nav>

      {stepErrors.length > 0 ? (
        <div className="banner banner--error" role="alert">
          <Icon name="alert" size={16} />
          <p className="banner-text">{stepErrors.join(' ')}</p>
        </div>
      ) : null}

      {saveError ? (
        <div className="banner banner--error" role="alert">
          <Icon name="alert" size={16} />
          <p className="banner-text">{saveError}</p>
        </div>
      ) : null}

      {state.step === 'identity' ? (
        <Card title="Who are they?" className="create-card">
          <Field label="Character name" htmlFor="create-name">
            <TextInput
              id="create-name"
              value={state.name}
              onValueChange={setName}
              placeholder="e.g. Thia Blackwood"
            />
          </Field>
          <Field
            label="Player name"
            htmlFor="create-player"
            className="create-field"
          >
            <TextInput
              id="create-player"
              value={state.playerName}
              onValueChange={setPlayerName}
              placeholder="Optional"
            />
          </Field>

          <Divider label="Species" />
          <div className="create-choices" role="radiogroup" aria-label="Species">
            {SPECIES.map((option) => {
              const checked = state.speciesId === option.id
              return (
                <label key={option.id} className={`create-choice${checked ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="create-species"
                    value={option.id}
                    checked={checked}
                    onChange={() => setSpeciesId(option.id)}
                  />
                  <span className="create-choice-body">
                    <span className="create-choice-name">{option.name}</span>
                    <span className="create-choice-meta">
                      {option.size}
                      {option.featLevels?.includes(1) ? ' · feat at 1' : ''}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>

          {species ? (
            <div className="create-detail">
              {species.traits.map((trait) => (
                <div key={trait.name} className="create-trait">
                  <p className="create-trait-name">{trait.name}</p>
                  <p className="create-trait-desc">{trait.description}</p>
                </div>
              ))}
              <p className="create-note">
                Species grant no ability score increases in 2024. Your background supplies those.
              </p>
            </div>
          ) : null}

          {lineageOptions.length > 0 ? (
            <>
              <Divider label="Lineage" />
              <p className="create-note">
                {species?.name ?? state.speciesId} picks one of these instead of a fixed spell
                list. The spells a lineage grants appear in the Spells step tagged "Race". Each is
                always prepared and can be cast once without a spell slot (regained on a Long Rest),
                or using a spell slot.
              </p>
              <div
                className="create-choices create-choices--lineage"
                role="radiogroup"
                aria-label="Lineage"
              >
                {lineageOptions.map((option) => {
                  const checked = state.lineageId === option.id
                  return (
                    <label
                      key={option.id}
                      className={`create-choice create-choice--lineage${checked ? ' is-selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="create-lineage"
                        value={option.id}
                        checked={checked}
                        onChange={() => setLineageId(option.id)}
                      />
                      <span className="create-choice-body">
                        <span className="create-choice-name">{option.name}</span>
                        <span className="create-choice-meta">{option.summary}</span>
                      </span>
                    </label>
                  )
                })}
              </div>

              {selectedLineage ? (
                <div className="create-detail">
                  <div className="create-lineage-ability">
                    <p className="create-list-title">
                      Spellcasting ability for {selectedLineage.name} spells
                    </p>
                    <div className="create-lineage-ability-options">
                      {selectedLineage.spellcastingAbilityOptions.map((key) => (
                        <Tag key={key} tone="neutral" className="create-lineage-ability-tag">
                          {ABILITY_LABELS[key]}
                        </Tag>
                      ))}
                    </div>
                    <p className="create-note">
                      Use one of these to cast your lineage spells. It does not have to match your
                      class spellcasting ability. This form does not record the pick — decide it at
                      the table.
                    </p>
                  </div>

                  {selectedLineage.bonusTrait ? (
                    <div className="create-trait">
                      <p className="create-trait-name">{selectedLineage.name} bonus trait</p>
                      <p className="create-trait-desc">{selectedLineage.bonusTrait}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </Card>
      ) : null}

      {state.step === 'class' ? (
        <Card title="Class" className="create-card">
          <div className="create-choices create-choices--grid" role="radiogroup" aria-label="Class">
            {CLASSES.map((option) => {
              const checked = state.classId === option.id
              return (
                <label key={option.id} className={`create-choice${checked ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="create-class"
                    value={option.id}
                    checked={checked}
                    onChange={() => setClassId(option.id)}
                  />
                  <span className="create-choice-body">
                    <span className="create-choice-name">{option.name}</span>
                    <span className="create-choice-meta">d{option.hitDie}</span>
                  </span>
                </label>
              )
            })}
          </div>

          {classDef ? (
            <div className="create-detail">
              <div className="create-lists">
                <div>
                  <p className="create-list-title">Saving throws</p>
                  <p className="create-list-body">
                    {classDef.savingThrowProficiencies.map((s) => ABILITY_LABELS[s]).join(', ')}
                  </p>
                </div>
                <div>
                  <p className="create-list-title">Armour</p>
                  <p className="create-list-body">{classDef.armorProficiencies.join('; ')}</p>
                </div>
                <div>
                  <p className="create-list-title">Weapons</p>
                  <p className="create-list-body">{classDef.weaponProficiencies.join('; ')}</p>
                </div>
                <div>
                  <p className="create-list-title">Skills</p>
                  <p className="create-list-body">
                    {classDef.skills.granted.length > 0
                      ? `${classDef.skills.granted.map((s) => skillName(s)).join(', ')}, plus `
                      : ''}
                    choose {classDef.skills.choiceCount} of {classDef.skills.choices.length}
                  </p>
                </div>
              </div>

              {classDef.skills.choiceCount > 0 && (
                <div className="create-pick-section">
                  <Divider label={`Skill Proficiencies (${state.skillPicks.length}/${classDef.skills.choiceCount})`} />
                  <p className="create-note">Choose {classDef.skills.choiceCount} from the {classDef.name} skill list.</p>
                  <div className="create-choices create-choices--grid" role="group" aria-label="Class skill proficiencies">
                    {classDef.skills.choices.map((skill) => {
                      const checked = state.skillPicks.includes(skill)
                      const disabled = !checked && state.skillPicks.length >= classDef.skills.choiceCount
                      return (
                        <label key={skill} className={`create-choice${checked ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}`}>
                          <input
                            type="checkbox"
                            name={`create-skill-${skill}`}
                            checked={checked}
                            disabled={disabled}
                            onChange={() => {
                              if (disabled && !checked) return
                              setSkillPicks(checked
                                ? state.skillPicks.filter((s) => s !== skill)
                                : [...state.skillPicks, skill])
                            }}
                          />
                          <span className="create-choice-body">
                            <span className="create-choice-name">{skillName(skill)}</span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  {state.skillPicks.length < classDef.skills.choiceCount && (
                    <p className="create-error">{state.skillPicks.length}/{classDef.skills.choiceCount} chosen — select {classDef.skills.choiceCount - state.skillPicks.length} more</p>
                  )}
{state.skillPicks.length > classDef.skills.choiceCount && (
                    <p className="create-error">Too many skills selected (max {classDef.skills.choiceCount})</p>
                  )}
                </div>
              )}

              {classDef.weaponMastery && classDef.weaponMastery.choiceCount > 0 && (
                (() => {
                  const wm = classDef.weaponMastery
                  return (
                    <div className="create-pick-section">
                      <Divider label={`Weapon Mastery (${state.weaponMasteries.length}/${wm.choiceCount})`} />
                      <p className="create-note">Choose {wm.choiceCount} weapon mastery properties. You gain additional picks at levels {wm.extraPicksAtLevels?.join(', ')}.</p>
                      <div className="create-choices create-choices--grid" role="group" aria-label="Weapon mastery properties">
                        {wm.pool.map((mastery) => {
                          const checked = state.weaponMasteries.includes(mastery)
                          const disabled = !checked && state.weaponMasteries.length >= wm.choiceCount
                          return (
                            <label key={mastery} className={`create-choice${checked ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}`}>
                              <input
                                type="checkbox"
                                name={`create-mastery-${mastery}`}
                                checked={checked}
                                disabled={disabled}
                                onChange={() => {
                                  if (disabled && !checked) return
                                  setWeaponMasteries(checked
                                    ? state.weaponMasteries.filter((m) => m !== mastery)
                                    : [...state.weaponMasteries, mastery])
                                }}
                              />
                              <span className="create-choice-body">
                                <span className="create-choice-name">{mastery}</span>
                              </span>
                            </label>
                          )
                        })}
                      </div>
                      {state.weaponMasteries.length < wm.choiceCount && (
                        <p className="create-error">{state.weaponMasteries.length}/{wm.choiceCount} chosen — select {wm.choiceCount - state.weaponMasteries.length} more</p>
                      )}
                      {state.weaponMasteries.length > wm.choiceCount && (
                        <p className="create-error">Too many weapon masteries selected (max {wm.choiceCount})</p>
                      )}
                    </div>
                  )
                })()
              )}

              <div>
                <p className="create-list-title">Starting Equipment</p>
                <p className="create-list-body">
                  {(() => {
                    const classEquipment = startingEquipmentFor(classDef.id, 'class');
                    if (!classEquipment || classEquipment.options.length === 0) return <span>None</span>;
                    return (
                      <>
                        <p className="create-note" style={{ marginBottom: 'var(--space-2)' }}>
                          Choose one starting equipment option.
                        </p>
                        <div className="create-choices create-choices--grid" role="group" aria-label="Class starting equipment">
                          {classEquipment.options.map((opt) => {
                            const checked = state.classStartingEquipmentOptionId === opt.id;
                            const isCoins = opt.kind === 'coins';
                            return (
                              <label key={opt.id} className={`create-choice${checked ? ' is-selected' : ''}`}>
                                <input
                                  type="radio"
                                  name="create-class-equipment"
                                  value={opt.id}
                                  checked={checked}
                                  onChange={() => setClassStartingEquipmentOptionId(opt.id)}
                                />
                                <span className="create-choice-body">
                                  <span className="create-choice-name">{opt.label}</span>
                                  <span className="create-choice-meta" style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
                                    {isCoins
                                      ? `${opt.coinsGp} GP`
                                      : opt.items}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        {(state.classStartingEquipmentOptionId && equipmentErrors.some(e => e.includes('class'))) && (
                          <p className="create-error">
                            {equipmentErrors.find(e => e.includes('class'))}
                          </p>
                        )}
                      </>
                    );
                  })()}
                </p>
              </div>

              <p className="create-note">
                Cantrips are chosen on the Spells step. Weapon mastery picks can be changed on level up.
              </p>
            </div>
          ) : null}
        </Card>
      ) : null}

      {state.step === 'background' ? (
        <Card title="Background" className="create-card">
          <div className="create-choices create-choices--grid" role="radiogroup" aria-label="Background">
            {BACKGROUNDS.map((option) => {
              const checked = state.backgroundId === option.id
              return (
                <label key={option.id} className={`create-choice${checked ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="create-background"
                    value={option.id}
                    checked={checked}
                    onChange={() => setBackgroundId(option.id)}
                  />
                  <span className="create-choice-body">
                    <span className="create-choice-name">
                      {option.name}
                      {option.source === 'phb' ? (
                        <Tag tone="muted" className="create-source-tag">
                          PHB
                        </Tag>
                      ) : null}
                    </span>
                    <span className="create-choice-meta">{option.originFeatName}</span>
                  </span>
                </label>
              )
            })}
          </div>

          {background ? (
            <>
              <div className="create-detail">
                <div className="create-lists">
                  <div>
                    <p className="create-list-title">Ability increases</p>
                    <p className="create-list-body">
                      Choose two of these:{' '}
                      {background.abilityBonusChoices.map((a) => ABILITY_LABELS[a]).join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="create-list-title">Skills</p>
                    <p className="create-list-body">
                      {background.skillsGranted.map((s) => skillName(s)).join(', ') || 'None'}
                    </p>
                  </div>
                  <div>
                    <p className="create-list-title">Tools</p>
                    <p className="create-list-body">
                      {background.toolsGranted.length > 0
                        ? background.toolsGranted.join(', ')
                        : background.toolChoices.length > 0
                          ? background.toolChoices.join(', ')
                          : 'None'}
                    </p>
                  </div>

                  {background.toolChoiceCount > 0 && (
                    <div>
                      <p className="create-list-title">Choose Tool Proficiency</p>
                      <p className="create-list-body">
                        <Field
                          label="Tool proficiency"
                          htmlFor="background-tool"
                          hint={background.toolChoiceCategory === 'artisansTools'
                            ? 'Choose one of the 17 Artisan\'s Tools (each is a separate proficiency).'
                            : background.toolChoiceCategory === 'musicalInstrument'
                              ? 'Choose one of the available Musical Instruments.'
                              : 'Choose one of the 4 Gaming Sets.'}
                        >
                          <Select
                            id="background-tool"
                            value={state.backgroundTool ?? ''}
                            onValueChange={(v) => setBackgroundTool(v || null)}
                            placeholder="Select a tool"
                          >
                            <option value="">— Select a tool —</option>
                            {(() => {
                              const tools = background.toolChoiceCategory === 'artisansTools'
                                ? ARTISAN_TOOLS
                                : background.toolChoiceCategory === 'musicalInstrument'
                                  ? MUSICAL_INSTRUMENTS
                                  : GAMING_SETS;
                              return tools.map((tool) => (
                                <option key={tool.id} value={tool.name}>
                                  {tool.name}
                                </option>
                              ));
                            })()}
                          </Select>
                        </Field>
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="create-list-title">Starting Equipment</p>
                    <p className="create-list-body">
                      {(() => {
                        const bgEquipment = startingEquipmentFor(background.id, 'background');
                        if (!bgEquipment || bgEquipment.options.length === 0) return <span>None</span>;
                        return (
                          <>
                            <p className="create-note" style={{ marginBottom: 'var(--space-2)' }}>
                              Choose one starting equipment option.
                            </p>
                            <div className="create-choices create-choices--grid" role="group" aria-label="Background starting equipment">
                              {bgEquipment.options.map((opt) => {
                                const checked = state.backgroundStartingEquipmentOptionId === opt.id;
                                const isCoins = opt.kind === 'coins';
                                return (
                                  <label key={opt.id} className={`create-choice${checked ? ' is-selected' : ''}`}>
                                    <input
                                      type="radio"
                                      name="create-bg-equipment"
                                      value={opt.id}
                                      checked={checked}
                                      onChange={() => setBackgroundStartingEquipmentOptionId(opt.id)}
                                    />
                                    <span className="create-choice-body">
                                      <span className="create-choice-name">{opt.label}</span>
                                      <span className="create-choice-meta" style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
                                        {isCoins
                                          ? `${opt.coinsGp} GP`
                                          : opt.items}
                                      </span>
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                            {(state.backgroundStartingEquipmentOptionId && equipmentErrors.some(e => e.includes('background'))) && (
                              <p className="create-error">
                                {equipmentErrors.find(e => e.includes('background'))}
                              </p>
                            )}
                          </>
                        );
                      })()}
                    </p>
                  </div>

                  <div>
                    <p className="create-list-title">Origin feat</p>
                    <p className="create-list-body">
                      <strong>{background.originFeatName}</strong> —{' '}
                      {background.originFeatDescription}
                    </p>
                  </div>
                </div>
              </div>

              <Divider label="Ability score increases" />
              <div
                className="create-choices create-choices--inline"
                role="radiogroup"
                aria-label="Ability score increase pattern"
              >
                <label className="create-choice create-choice--inline">
                  <input
                    type="radio"
                    name="create-bg-mode"
                    checked={state.backgroundMode === 'plus2plus1'}
                    onChange={() => setBackgroundMode('plus2plus1')}
                  />
                  <span className="create-choice-name">+2 and +1</span>
                </label>
                <label className="create-choice create-choice--inline">
                  <input
                    type="radio"
                    name="create-bg-mode"
                    checked={state.backgroundMode === 'plus1each'}
                    onChange={() => setBackgroundMode('plus1each')}
                  />
                  <span className="create-choice-name">+1 to all three</span>
                </label>
              </div>

              <ul className="create-background-scores">
                {background.abilityBonusChoices.map((ability) => (
                  <li key={ability} className="create-bg-score">
                    <span className="create-choice-name">{ABILITY_LABELS[ability]}</span>
                    <NumberInput
                      value={state.backgroundBonuses[ability] ?? 0}
                      min={0}
                      max={2}
                      step={1}
                      decrementLabel={`Decrease ${ABILITY_LABELS[ability]} increase`}
                      incrementLabel={`Increase ${ABILITY_LABELS[ability]} increase`}
                      onValueChange={(value) => setBackgroundBonus(ability, value)}
                    />
                    <span className="create-bg-preview">
                      {state.abilityScoreBase[ability] + (state.backgroundBonuses[ability] ?? 0)}{' '}
                      ({modifierText(
                        state.abilityScoreBase[ability] + (state.backgroundBonuses[ability] ?? 0),
                      )})
                    </span>
                  </li>
                ))}
              </ul>
              <p className="create-note">
                Capped at {MAX_FINAL_SCORE}. Background increases are stored separately from your
                allocated scores so changing background later cannot double-apply them.
              </p>
            </>
          ) : null}
        </Card>
      ) : null}

      {state.step === 'abilities' ? (
        <Card title="Ability scores" className="create-card">
          <div
            className="create-choices create-choices--inline"
            role="radiogroup"
            aria-label="Ability score method"
          >
            <label className="create-choice create-choice--inline">
              <input
                type="radio"
                name="create-score-method"
                checked={state.scoreMethod === 'standard'}
                onChange={() => setScoreMethod('standard')}
              />
              <span className="create-choice-name">Standard array</span>
            </label>
            <label className="create-choice create-choice--inline">
              <input
                type="radio"
                name="create-score-method"
                checked={state.scoreMethod === 'pointBuy'}
                onChange={() => setScoreMethod('pointBuy')}
              />
              <span className="create-choice-name">Point buy</span>
            </label>
            <label className="create-choice create-choice--inline">
              <input
                type="radio"
                name="create-score-method"
                checked={state.scoreMethod === 'rolled'}
                onChange={() => setScoreMethod('rolled')}
              />
              <span className="create-choice-name">Rolled at the table</span>
            </label>
          </div>

          {state.scoreMethod === 'pointBuy' ? (
            <p className="create-budget">
              <Tag tone={remaining < 0 ? 'danger' : remaining === 0 ? 'success' : 'accent'}>
                {spent} spent · {remaining} of {POINT_BUY_BUDGET} left
              </Tag>
              <span className="create-note">
                {MIN_ALLOCATED_SCORE} costs nothing, {MAX_ALLOCATED_SCORE} costs the most.
              </span>
            </p>
          ) : state.scoreMethod === 'rolled' ? (
            <p className="create-budget">
              <Tag tone="muted">Your dice</Tag>
              <span className="create-note">
                Type in what you rolled. This app does not roll dice for you, so the result is
                entirely yours. Four d6, drop the lowest, gives {MIN_ROLLED_SCORE}–{MAX_ROLLED_SCORE}.
              </span>
            </p>
          ) : (
            <p className="create-budget">
              <Tag tone="muted">Six fixed values</Tag>
              <span className="create-note">
                Each of {standardValues.join(', ')} is used exactly once.
              </span>
            </p>
          )}

          <ul className="create-scores">
            {ABILITY_KEYS.map((ability: AbilityKey) => {
              const base = state.abilityScoreBase[ability]
              const bonus = state.backgroundBonuses[ability] ?? 0
              const final = base + bonus
              const low =
                state.scoreMethod === 'rolled' ? MIN_ROLLED_SCORE : MIN_ALLOCATED_SCORE
              const high =
                state.scoreMethod === 'rolled' ? MAX_ROLLED_SCORE : MAX_ALLOCATED_SCORE
              return (
                <li key={ability} className="create-score">
                  <div className="create-score-label">
                    <span className="create-choice-name">{ABILITY_LABELS[ability]}</span>
                    <span className="create-score-key mono">{ability}</span>
                  </div>

                  <div className="create-score-value">
                    {base} <span className="create-score-mod">{modifierText(final)}</span>
                  </div>

                  {state.scoreMethod === 'standard' ? (
                    <div className="create-score-control">
                      <Select
                        value={String(base)}
                        onValueChange={(value) => setAbilityScore(ability, Number(value))}
                        aria-label={`${ABILITY_LABELS[ability]} value`}
                      >
                        {standardValues.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </Select>
                    </div>
                  ) : (
                    <div className="create-score-control">
                      <NumberInput
                        value={base}
                        min={low}
                        max={high}
                        step={1}
                        decrementLabel={`Decrease ${ABILITY_LABELS[ability]}`}
                        incrementLabel={`Increase ${ABILITY_LABELS[ability]}`}
                        onValueChange={(value) => setAbilityScore(ability, value)}
                      />
                    </div>
                  )}

                  <span className="create-score-preview">
                    {bonus > 0
                      ? `${base} + ${bonus} background = ${final}`
                      : `No background increase · ${final}`}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="create-note">
            These are your allocated scores, before species and background increases. The character
            sheet applies those when it reads the character.
          </p>
        </Card>
      ) : null}

      {state.step === 'spells' ? (
        <Card title="Spells & Cantrips" className="create-card">
          {classDef?.spellcasting ? (
            <>
              <p className="create-note">
                Your {classDef.name} spellcasting ability is{' '}
                <strong>{ABILITY_LABELS[classDef.spellcasting.ability]}</strong>.
                {classDef.spellcasting.spellsMode === 'prepared'
                  ? ' You prepare spells each long rest.'
                  : ' You know a fixed list of spells.'}
              </p>

              {(() => {
                const sc = classDef.spellcasting
                const cantripCount = sc.cantripCountByLevel[1] ?? 0
                const spellCount = sc.spellCountByLevel[1] ?? 0
                const spellKind = sc.spellsMode === 'prepared' ? 'prepared' : 'known'
                // A level 1 caster can only ever draw from the spell levels its
                // own level 1 slot table provides (2024 PHB: every class starts
                // with 1st-level slots, so this resolves to 1 in practice).
                const maxSpellLevel = (sc.slotTable[1] ?? []).reduce(
                  (highest: number, slots, idx) => (slots > 0 ? Math.max(highest, idx + 1) : highest),
                  0,
                )

                if (cantripCount === 0 && spellCount === 0) {
                  return (
                    <p className="create-note">
                      {classDef.name} does not gain cantrips or spells at level 1.
                      Spellcasting begins at level 2.
                    </p>
                  )
                }

                return (
                  <>
                    {cantripCount > 0 && (
                      <SpellPicker
                        classId={classDef.id}
                        lineageId={state.lineageId}
                        speciesId={state.speciesId}
                        characterLevel={1}
                        minLevel={0}
                        maxLevel={0}
                        count={cantripCount}
                        pickedIds={state.cantripIds}
                        onChange={setCantripIds}
                        label={`Cantrips (choose ${cantripCount})`}
                        hint={`Select ${cantripCount} cantrip${cantripCount === 1 ? '' : 's'} from the ${classDef.name} spell list.${
                          selectedLineage
                            ? ` Spells tagged "Race" come from your ${selectedLineage.name} lineage.`
                            : state.speciesId === 'tiefling'
                            ? ` Spells tagged "Race" come from your species (Tiefling grants Thaumaturgy).`
                            : ''
                        }`}
                      />
                    )}
                    {spellCount > 0 && (
                      <SpellPicker
                        classId={classDef.id}
                        lineageId={state.lineageId}
                        speciesId={state.speciesId}
                        characterLevel={1}
                        minLevel={1}
                        maxLevel={maxSpellLevel}
                        count={spellCount}
                        pickedIds={
                          spellKind === 'prepared' ? state.spellIdsPrepared : state.spellIdsKnown
                        }
                        onChange={spellKind === 'prepared' ? setSpellIdsPrepared : setSpellIdsKnown}
                        label={`1st-level spells (choose ${spellCount})`}
                        hint={`Select ${spellCount} 1st-level spell${spellCount === 1 ? '' : 's'} to ${spellKind}.${
                          selectedLineage
                            ? ` Spells tagged "Race" come from your ${selectedLineage.name} lineage.`
                            : state.speciesId === 'tiefling'
                            ? ` Spells tagged "Race" come from your species (Tiefling grants Thaumaturgy).`
                            : ''
                        }`}
                      />
                    )}
                  </>
                )
              })()}
            </>
          ) : (
            <p className="create-note">
              {classDef?.name ?? 'This class'} does not have spellcasting at level 1.
            </p>
          )}
        </Card>
      ) : null}

      {isReview ? (
        <Card title="Review" className="create-card">
          <div className="create-lists create-lists--wide">
            <div>
              <p className="create-list-title">Name</p>
              <p className="create-list-body">
                {state.name.trim() || '—'}
                {state.playerName.trim() ? ` · played by ${state.playerName.trim()}` : ''}
              </p>
            </div>
            <div>
              <p className="create-list-title">Species</p>
              <p className="create-list-body">
                {species?.name ?? state.speciesId} ({species?.size ?? 'unknown size'})
                {selectedLineage ? ` · ${selectedLineage.name}` : ''}
              </p>
            </div>
            <div>
              <p className="create-list-title">Class</p>
              <p className="create-list-body">
                {classDef ? `${classDef.name} · d${classDef.hitDie}` : state.classId}
              </p>
            </div>
            <div>
              <p className="create-list-title">Background</p>
              <p className="create-list-body">{background?.name ?? state.backgroundId}</p>
            </div>
          </div>

          <Divider label="Final ability scores" />
          <ul className="create-scores create-scores--readonly">
            {ABILITY_KEYS.map((ability) => {
              const base = state.abilityScoreBase[ability]
              const bonus = state.backgroundBonuses[ability] ?? 0
              const final = base + bonus
              return (
                <li key={ability} className="create-score">
                  <div className="create-score-label">
                    <span className="create-choice-name">{ABILITY_LABELS[ability]}</span>
                    <span className="create-score-key mono">{ability}</span>
                  </div>
                  <span className="create-score-preview create-score-preview--final">
                    {base}
                    {bonus > 0 ? ` + ${bonus} background` : ''} = {final} ({modifierText(final)})
                  </span>
                </li>
              )
            })}
          </ul>

          {classDef?.spellcasting && (
            <>
              <Divider label="Spells & Cantrips" />
              {(() => {
                const sc = classDef.spellcasting
                const cantripCount = sc.cantripCountByLevel[1] ?? 0
                const spellCount = sc.spellCountByLevel[1] ?? 0
                const spellKind = sc.spellsMode === 'prepared' ? 'prepared' : 'known'
                const spellIds = spellKind === 'prepared' ? state.spellIdsPrepared : state.spellIdsKnown

                if (cantripCount === 0 && spellCount === 0) {
                  return (
                    <p className="create-note">
                      {classDef.name} does not gain cantrips or spells at level 1.
                    </p>
                  )
                }

                return (
                  <>
                    {cantripCount > 0 && (
                      <>
                        <p className="create-list-title">Cantrips ({state.cantripIds.length}/{cantripCount})</p>
                        <ul className="create-list-body">
                          {state.cantripIds.length === 0 ? (
                            <li className="create-empty-pick">None selected</li>
                          ) : (
                            state.cantripIds.map((id) => {
                              const spell = getSpell(id)
                              return (
                                <li key={id} className="create-spell-pick">
                                  {spell?.name ?? id}
                                </li>
                              )
                            })
                          )}
                        </ul>
                      </>
                    )}
                    {spellCount > 0 && (
                      <>
                        <p className="create-list-title">
                          1st-level spells {spellKind} ({spellIds.length}/{spellCount})
                        </p>
                        <ul className="create-list-body">
                          {spellIds.length === 0 ? (
                            <li className="create-empty-pick">None selected</li>
                          ) : (
                            spellIds.map((id) => {
                              const spell = getSpell(id)
                              return (
                                <li key={id} className="create-spell-pick">
                                  {spell?.name ?? id}
                                </li>
                              )
                            })
                          )}
                        </ul>
                      </>
                    )}
                  </>
                )
              })()}
            </>
          )}

          {classDef && classDef.skills.choiceCount > 0 && (
            <>
              <Divider label="Class Skill Proficiencies" />
              <p className="create-list-title">Skill Proficiencies ({state.skillPicks.length}/{classDef.skills.choiceCount})</p>
              <ul className="create-list-body">
                {state.skillPicks.length === 0 ? (
                  <li className="create-empty-pick">None selected</li>
                ) : (
                  state.skillPicks.map((skill) => (
                    <li key={skill} className="create-spell-pick">{skillName(skill)}</li>
                  ))
                )}
              </ul>
            </>
          )}

          {classDef?.weaponMastery && classDef.weaponMastery.choiceCount > 0 && (
            <>
              <Divider label="Weapon Mastery" />
              <p className="create-list-title">Weapon Mastery Properties ({state.weaponMasteries.length}/{classDef.weaponMastery.choiceCount})</p>
              <ul className="create-list-body">
                {state.weaponMasteries.length === 0 ? (
                  <li className="create-empty-pick">None selected</li>
                ) : (
                  state.weaponMasteries.map((mastery) => (
                    <li key={mastery} className="create-spell-pick">{mastery}</li>
                  ))
                )}
              </ul>
            </>
          )}

          <Divider label="Starting Equipment" />
          <div>
            {(() => {
              const bgEquipment = background ? startingEquipmentFor(background.id, 'background') : undefined;
              const classEquipment = classDef ? startingEquipmentFor(classDef.id, 'class') : undefined;
              const bgOpt = bgEquipment?.options.find((o) => o.id === state.backgroundStartingEquipmentOptionId);
              const classOpt = classEquipment?.options.find((o) => o.id === state.classStartingEquipmentOptionId);

              if ((!bgEquipment || bgEquipment.options.length === 0) && (!classEquipment || classEquipment.options.length === 0)) {
                return <p className="create-note">No starting equipment options for this background/class combination.</p>;
              }

              return (
                <>
                  {bgEquipment && bgEquipment.options.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                      <p className="create-list-title">{background?.name ?? 'Background'} — {bgOpt?.label ?? 'Not chosen'}</p>
                      <p className="create-list-body" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                        {bgOpt
                          ? bgOpt.kind === 'coins'
                            ? `${bgOpt.coinsGp} GP`
                            : bgOpt.items
                          : '—'}
                      </p>
                    </div>
                  )}
                  {classEquipment && classEquipment.options.length > 0 && (
                    <div>
                      <p className="create-list-title">{classDef?.name ?? 'Class'} — {classOpt?.label ?? 'Not chosen'}</p>
                      <p className="create-list-body" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                        {classOpt
                          ? classOpt.kind === 'coins'
                            ? `${classOpt.coinsGp} GP`
                            : classOpt.items
                          : '—'}
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <Divider label="Not modelled" />
          <ul className="create-gaps">
            <li>
              Coins are tracked on the character sheet but not editable during creation.
            </li>
          </ul>
          <p className="create-note">
            Species feat (if any) is recorded as an outstanding choice so the character sheet can show it.
          </p>
        </Card>
      ) : null}

      <div className="create-actions">
        <Button variant="ghost" icon="chevron-up" onClick={back} disabled={stepIndex === 0}>
          Back
        </Button>
        {isReview ? (
          <Button
            variant="primary"
            icon="check"
            onClick={create}
            disabled={!canCreate || saving}
          >
            {saving
              ? isEdit
                ? 'Saving…'
                : 'Creating…'
              : isEdit
                ? 'Save changes'
                : 'Create character'}
          </Button>
        ) : (
          <Button
            variant="primary"
            icon="chevron-down"
            onClick={next}
            disabled={!canAdvance}
          >
            Next
          </Button>
        )}
        <Link
          className="link create-cancel"
          to={isEdit && existing ? `/character/${existing.id}` : '/'}
        >
          Cancel
        </Link>
      </div>
    </section>
  )
}
