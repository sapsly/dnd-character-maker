import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { useParams } from 'react-router-dom'
import type {
  AbilityBonusMap,
  Character,
  Choice,
  ClassEntry,
  SpellKey,
  SpeciesLineageId,
  WeaponMasteryProperty,
} from '../../types/character'
import type { DerivedCharacter } from '../../lib/derived'
import { deriveCharacter } from '../../lib/derived'
import { createId } from '../../lib/storage'
import { useCharacters } from '../../hooks/useCharacters'
import { MAX_CHARACTER_LEVEL, nextLevelChoices, validateAsiAllocation } from '../../lib/rules/leveling'
import { asiIncreases } from '../../lib/rules/asi'
import type { NextLevelChoicesResult, NextLevelChoicesInput } from '../../lib/rules/leveling'
import { FEATS } from '../../data/feats'
import { lineageGrantsAtLevel } from '../../data/lineages'
import { getSpell } from '../../data/spells'
import { isEntryAllowed } from '../../lib/rules/sources'

export type LevelUpStatus = 'loading' | 'ready' | 'saving' | 'not-found' | 'error' | 'saved' | 'save-error'

/** How the player spends this level's ASI: a feat, or raw score increases. */
export type AsiMode = 'feat' | 'ability'

/** Whether the level-up is advancing an existing class or adding a new one. */
export type LevelUpKind = 'advance' | 'new-class'

/**
 * Folds the spells a species lineage grants on reaching `newLevel` into the
 * character's own `lineageSpellIds` map.
 *
 * Three properties matter, and are why this is a helper rather than an inline
 * push:
 *
 *  - **Slotless.** Lineage spells live outside every `ClassEntry` because in
 *    2024 they are cast without expending a slot. Folding them into
 *    `spellIdsPrepared` would silently eat one of the character's prepared picks.
 *  - **Idempotent.** Saving a level twice, or re-saving after a reload, must
 *    not duplicate a grant, so existing keys are checked before appending.
 *  - **Quiet on a bad id.** A grant the catalog cannot resolve is skipped, so a
 *    stale save or a renamed spell degrades to "not shown" rather than
 *    rendering a row that breaks the sheet.
 *
 * Keyed by *spell* level (the grant's own level), which is what the sheet groups
 * by, not the character level it was gained at.
 */
function applyLineageGrants(
  lineageId: SpeciesLineageId | undefined,
  newLevel: number,
  existing: Record<number, SpellKey[]> | undefined,
): Record<number, SpellKey[]> {
  const base: Record<number, SpellKey[]> = {}
  for (const [level, ids] of Object.entries(existing ?? {})) {
    const numeric = Number(level)
    if (Number.isInteger(numeric) && Array.isArray(ids)) base[numeric] = [...ids]
  }

  for (const spellId of lineageGrantsAtLevel(lineageId, newLevel)) {
    const spell = getSpell(spellId)
    if (!spell) continue
    const bucket = base[spell.level] ?? []
    if (bucket.includes(spellId)) continue
    base[spell.level] = [...bucket, spellId]
  }

  return base
}

export interface AsiDraft {
  mode: AsiMode
  featId: string
  /** Ability -> increase. Per 2024 rules: +2 to one, or +1 to two. */
  increases: AbilityBonusMap
}

export interface LevelUpDraft {
  /** Which kind of level-up: advance existing class, or add new class. */
  kind: LevelUpKind
  /** Class ID for new class (when kind === 'new-class'). */
  newClassId: string
  subclassId: string
  asi: AsiDraft
  /** Masteries the entry will hold once this level is applied. */
  masteries: WeaponMasteryProperty[]
  /** featureId -> selected option ids. */
  featureOptions: Record<string, string[]>
  /** featureId -> selected skill keys. */
  skillOptions: Record<string, string[]>
  /**
   * Subclass feature id -> selected spell ids. Subclass spell pools draw from
   * their own class lists (e.g. College of Lore's Magical Discoveries take
   * cleric, druid, and wizard spells), so they cannot ride on the class's own
   * cantrip/known/prepared draft fields.
   */
  subclassSpellOptions: Record<string, string[]>
  /** Cantrip spell IDs picked at this level. */
  cantripIds: SpellKey[]
  /** Known spell IDs picked at this level (for 'known' classes). */
  spellIdsKnown: SpellKey[]
  /** Prepared spell IDs picked at this level (for 'prepared' classes). */
  spellIdsPrepared: SpellKey[]
}

export interface Blocker {
  label: string
  reason: string
}

export interface FeatOption {
  id: string
  name: string
  description: string
  source: string
  prerequisite?: string
}

export interface LevelUpModel {
  status: LevelUpStatus
  character: Character | null
  derived: DerivedCharacter | null
  error: string | null
  saveError: string | null
  atMaxLevel: boolean
  entries: ClassEntry[]
  entryId: string | null
  setEntryId: (id: string) => void
  entry: ClassEntry | null
  entryClassName: string
  newClassLevel: number
  newTotalLevel: number
  choices: NextLevelChoicesResult | null
  draft: LevelUpDraft
  setDraft: Dispatch<SetStateAction<LevelUpDraft>>
  featOptions: FeatOption[]
  asiErrors: string[]
  blockers: Blocker[]
  masteryCount: number
  /** True when the level-up is adding a new class (multiclassing). */
  isNewClass: boolean
  /** Available classes to add as a new class (not already on the character). */
  availableNewClasses: { id: string; name: string }[]
  /** Set the kind of level-up (advance vs new-class). */
  setKind: (kind: LevelUpKind) => void
  /** Set the new class ID when adding a class. */
  setNewClassId: (id: string) => void
  reload: () => void
  apply: () => void
  reset: () => void
}

function emptyDraft(): LevelUpDraft {
  return {
    kind: 'advance',
    newClassId: '',
    subclassId: '',
    asi: { mode: 'ability', featId: '', increases: {} },
    masteries: [],
    featureOptions: {},
    skillOptions: {},
    subclassSpellOptions: {},
    cantripIds: [],
    spellIdsKnown: [],
    spellIdsPrepared: [],
  }
}

/**
 * SRD prerequisites are stored as display-only prose (see the note in
 * data/feats.ts), so the UI shows them and leaves enforcement to the player
 * rather than parsing strings that would be fragile to reword.
 */
function buildFeatOptions(character: Character): FeatOption[] {
  return FEATS.filter((feat) => isEntryAllowed(character, feat))
    .map((feat) => ({
      id: feat.id,
      name: feat.name,
      description: feat.description,
      source: feat.source ?? 'general',
      prerequisite: feat.prerequisites,
    }))
}

export function useLevelUp(): LevelUpModel {
  const { id } = useParams<{ id: string }>()
  const [status, setStatus] = useState<LevelUpStatus>('loading')
  const [character, setCharacter] = useState<Character | null>(null)
  const [derived, setDerived] = useState<DerivedCharacter | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [entryId, setEntryId] = useState<string | null>(null)
  const [draft, setDraft] = useState<LevelUpDraft>(emptyDraft)
  const [attempt, setAttempt] = useState(0)

  const { getOne, upsert } = useCharacters()

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    if (!id) {
      setStatus('not-found')
      return
    }
    let cancelled = false
    setStatus('loading')

    getOne(id).then((result) => {
      if (cancelled) return

      if (!result.ok) {
        setError(result.error ?? 'Saved characters could not be read.')
        setCharacter(null)
        setDerived(null)
        setStatus('error')
        return
      }

      const found = result.value
      if (!found) {
        setError(result.ok ? null : (result.error ?? null))
        setCharacter(null)
        setDerived(null)
        setStatus('not-found')
        return
      }

      setCharacter(found)
      setDerived(deriveCharacter(found))
      setError(result.ok ? null : (result.error ?? null))
      // Default to the highest-level class entry: that is the one a player most
      // often means when they open "level up".
      const top = [...found.classes].sort((a, b) => b.level - a.level)[0]
      setEntryId(top?.id ?? null)
      setDraft(emptyDraft())
      setStatus('ready')
    })

    return () => {
      cancelled = true
    }
  }, [id, attempt, getOne])

  const entries = character?.classes ?? []
  const entry = useMemo(() => entries.find((e) => e.id === entryId) ?? null, [entries, entryId])

  // Whether we're adding a new class (multiclassing) vs advancing existing
  const isNewClass = draft.kind === 'new-class'

  // When adding a new class, the "entry" is the new class being added (level 1)
  const newClassEntryClassDef = isNewClass && draft.newClassId
    ? derived?.classDefs.find((c) => c.id === draft.newClassId) ?? null
    : null

  // Resolve the "target entry" for choice computation:
  // - advance: the existing entry gaining a level
  // - new-class: a virtual entry for the new class at level 1
  const targetEntry = useMemo<ClassEntry | null>(() => {
    if (isNewClass && draft.newClassId && newClassEntryClassDef) {
      // Create a virtual ClassEntry for choice computation
      return {
        id: '', // Not persisted, only for choice computation
        classId: draft.newClassId,
        level: 0, // Current level before gaining (0 -> will become 1)
        isPrimary: false,
        skillPicks: [],
        cantripIds: [],
        spellIdsKnown: [],
        spellIdsPrepared: [],
        weaponMasteries: [],
        featurePicks: {},
      }
    }
    return entry
  }, [isNewClass, draft.newClassId, newClassEntryClassDef, entry])

  const newClassLevel = targetEntry ? targetEntry.level + 1 : 0
  const newTotalLevel = character ? character.level + 1 : 0
  const atMaxLevel = character ? character.level >= MAX_CHARACTER_LEVEL : false

  const choices = useMemo<NextLevelChoicesResult | null>(() => {
    if (!character || !derived || !targetEntry) return null
    return nextLevelChoices({
      character,
      classDefs: derived.classDefs,
      gainingEntry: targetEntry,
      newClassLevel,
      // The draft wins over the stored subclass: a subclass is frequently chosen
      // on the very level that grants its first picks (College of Lore's three
      // Bonus Proficiencies arrive at the subclass level), so the picks must
      // appear as soon as the player picks the subclass.
      subclassId: draft.subclassId || targetEntry.subclassId,
      sources: character.sources,
    } as NextLevelChoicesInput)
  }, [character, derived, targetEntry, newClassLevel, draft.subclassId])

  const entryClassName = useMemo(() => {
    if (!entry || !derived) return ''
    return derived.classDefs.find((c) => c.id === entry.classId)?.name ?? entry.classId
  }, [entry, derived])

  const featOptions = useMemo(() => character ? buildFeatOptions(character) : [], [character])

  // Classes not already on the character that can be added as a new class (multiclass)
  const availableNewClasses = useMemo(() => {
    if (!character || !derived) return []
    const existingClassIds = new Set(character.classes.map((c) => c.classId))
    return derived.classDefs
      .filter((c) => !existingClassIds.has(c.id))
      .map((c) => ({ id: c.id, name: c.name }))
  }, [character, derived])

  // Seed the mastery list from what the entry already holds, so the 2024 rule
  // "you may replace one property each time a level is gained" is visible: the
  // player starts from their current picks and edits them.
  useEffect(() => {
    if (!entry) return
    setDraft((d) => ({ ...d, masteries: [...entry.weaponMasteries] }))
  }, [entry])

  // Reset spell picks when the entry changes
  useEffect(() => {
    if (!entry) return
    setDraft((d) => ({ ...d, cantripIds: [], spellIdsKnown: [], spellIdsPrepared: [] }))
  }, [entry?.id])

  const asiErrors = useMemo(() => {
    if (!character || !choices?.asiChoice) return []
    if (draft.asi.mode === 'feat') {
      return draft.asi.featId ? [] : ['Choose a feat, or switch to ability score increases.']
    }
    // Include existing ASI increases from the choice log when validating the 20 cap.
    // The base no longer includes baked ASI, so we must add them here to get the true current final scores.
    const existingAsiBonuses = asiIncreases(character.choices);
    return validateAsiAllocation(
      character.abilityScoreBase,
      character.species.abilityBonuses,
      character.background.abilityBonuses,
      draft.asi.increases,
      false,
      existingAsiBonuses,
    ).errors
  }, [character, choices, draft.asi])

  const masteryRequired = choices?.weaponMasteryPicks[0]?.picks ?? 0
  const masteryCount = draft.masteries.length

  const blockers = useMemo<Blocker[]>(() => {
    if (!choices || !derived) return []
    const classDefs = derived.classDefs
    const out: Blocker[] = []

    if (choices.subclassChoice && !draft.subclassId) {
      out.push({
        label: 'Subclass',
        reason: `Choose one of the ${choices.subclassChoice.subclasses.length} ${choices.subclassChoice.className} subclasses.`,
      })
    }

    if (choices.asiChoice && asiErrors.length > 0) {
      out.push({ label: 'Ability score improvement', reason: asiErrors[0] })
    }

    for (const pick of choices.weaponMasteryPicks) {
      if (masteryRequired > 0 && draft.masteries.length === 0) {
        out.push({
          label: 'Weapon mastery',
          reason: `Choose ${pick.picks} weapon mastery propert${pick.picks === 1 ? 'y' : 'ies'}.`,
        })
      }
    }

    for (const feature of choices.featureChoices) {
      const selected = draft.featureOptions[feature.featureId]?.length ?? 0
      if (selected < feature.count) {
        out.push({
          label: feature.name,
          reason: `Choose ${feature.count} option${feature.count === 1 ? '' : 's'}; ${selected} chosen.`,
        })
      }
    }

    for (const skill of choices.skillChoices) {
      const selected = draft.skillOptions[skill.featureId]?.length ?? 0
      if (selected < skill.count) {
        out.push({
          label: skill.subclassName ? `${skill.subclassName} skills` : 'Skill proficiencies',
          reason: `Choose ${skill.count} skill${skill.count === 1 ? '' : 's'}; ${selected} chosen.`,
        })
      }
    }

    for (const pick of choices.subclassSpellChoices) {
      const selected = draft.subclassSpellOptions[pick.featureId]?.length ?? 0
      if (selected < pick.count) {
        out.push({
          label: pick.name,
          reason: pick.replace
            ? `Choose ${pick.count} replacement spell${pick.count === 1 ? '' : 's'}; ${selected} chosen.`
            : `Choose ${pick.count} spell${pick.count === 1 ? '' : 's'}; ${selected} chosen.`,
        })
      }
    }

    // Spell pick blockers
    for (const spellPick of choices.spellPicks) {
      const sc = classDefs.find((c) => c.id === spellPick.classId)?.spellcasting
      if (!sc) continue
      const spellKind = sc.spellsMode === 'prepared' ? 'prepared' : 'known'

      if (spellPick.cantripCount > 0 && draft.cantripIds.length < spellPick.cantripCount) {
        out.push({
          label: 'Cantrips',
          reason: `Choose ${spellPick.cantripCount} cantrip${spellPick.cantripCount === 1 ? '' : 's'}; ${draft.cantripIds.length} chosen.`,
        })
      }

      if (spellPick.spellCount > 0) {
        const spellIds = spellKind === 'prepared' ? draft.spellIdsPrepared : draft.spellIdsKnown
        if (spellIds.length < spellPick.spellCount) {
          out.push({
            label: `${spellKind === 'prepared' ? 'Prepared spells' : 'Known spells'}`,
            reason: `Choose ${spellPick.spellCount} spell${spellPick.spellCount === 1 ? '' : 's'}; ${spellIds.length} chosen.`,
          })
        }
      }
    }

    return out
  }, [choices, draft, asiErrors, masteryRequired, derived, upsert])

  const apply = useCallback(async () => {
    if (!character || !targetEntry || !choices) return
    if (blockers.length > 0) return

    const newLevel = character.level + 1
    const asiApplied: AbilityBonusMap = draft.asi.mode === 'ability' ? draft.asi.increases : {}

    // ASI increases are recorded in the choice log (asiAbilityIncrease / featOrAsi picks).
    // They are NO LONGER baked into abilityScoreBase. deriveCharacter reads the choice log
    // via asiIncreases() and adds them at read time, so past ASIs remain editable.
    const abilityScoreBase = { ...character.abilityScoreBase }

    const newChoices: Choice[] = [...character.choices]
    let counter = 0
    const nextChoiceId = () => {
      counter += 1
      return createId(counter === 1 ? 'choice' : `choice${counter}`)
    }
    const levelLabel = `Level ${newLevel}`

    // Determine the class entry ID for choice records and the class name for labels
    const gainingEntryId = isNewClass ? '' : entry?.id ?? ''
    const gainingClassName = isNewClass ? newClassEntryClassDef?.name ?? draft.newClassId : entryClassName
    const gainingClassId = isNewClass ? draft.newClassId : entry?.classId ?? ''

    // Helper to compute skill picks from draft.skillOptions
    const computeSkillPicks = () =>
      choices.skillChoices.flatMap((s) => draft.skillOptions[s.featureId] ?? [])

    /**
     * Merge this level's picks into the entry's `featurePicks`.
     *
     * Class feature options and subclass picks share this one map and are keyed
     * by feature id, so they are merged together here. Subclass spell pools
     * append rather than overwrite: once a pool is full, each later level adds
     * one spell and the player drops one from the sheet, which is the net effect
     * of the rules' "replace one each level". Duplicates are dropped so a
     * re-pick cannot bloat a pool.
     */
    const computeFeaturePicks = (existingPicks: Record<string, string[]> = {}) => {
      const merged = { ...existingPicks }
      const append = (featureId: string, selected: string[]) => {
        if (selected.length === 0) return
        const next = [...(merged[featureId] ?? [])]
        for (const id of selected) {
          if (!next.includes(id)) next.push(id)
        }
        merged[featureId] = next
      }
      for (const feature of choices.featureChoices) {
        append(feature.featureId, draft.featureOptions[feature.featureId] ?? [])
      }
      for (const pick of choices.subclassSpellChoices) {
        append(pick.featureId, draft.subclassSpellOptions[pick.featureId] ?? [])
      }
      return merged
    }

    // Build Choice records for the gained level
    if (choices.subclassChoice && draft.subclassId && gainingEntryId) {
      newChoices.push({
        id: nextChoiceId(),
        kind: 'subclass',
        classEntryId: gainingEntryId,
        grantedAtLevel: newLevel,
        label: `${levelLabel}: ${gainingClassName} subclass`,
        count: 1,
        picks: [{ optionId: draft.subclassId }],
        resolved: true,
      })
    }

    if (choices.asiChoice) {
      if (draft.asi.mode === 'feat' && draft.asi.featId) {
        newChoices.push({
          id: nextChoiceId(),
          kind: 'featOrAsi',
          classEntryId: gainingEntryId,
          grantedAtLevel: newLevel,
          label: `${levelLabel}: feat`,
          count: 1,
          picks: [{ optionId: draft.asi.featId }],
          resolved: true,
        })
      } else {
        newChoices.push({
          id: nextChoiceId(),
          kind: 'asiAbilityIncrease',
          classEntryId: gainingEntryId,
          grantedAtLevel: newLevel,
          label: `${levelLabel}: ability score increase`,
          count: 1,
          picks: [{ optionId: 'asi', abilityIncreases: asiApplied }],
          resolved: true,
        })
      }
    }

    if (masteryRequired > 0 && draft.masteries.length > 0 && gainingEntryId) {
      newChoices.push({
        id: nextChoiceId(),
        kind: 'weaponMastery',
        classEntryId: gainingEntryId,
        grantedAtLevel: newLevel,
        label: `${levelLabel}: weapon mastery`,
        count: draft.masteries.length,
        picks: draft.masteries.map((mastery) => ({ optionId: mastery })),
        resolved: true,
      })
    }

    for (const feature of choices.featureChoices) {
      const selected = draft.featureOptions[feature.featureId] ?? []
      if (selected.length === 0) continue
      newChoices.push({
        id: nextChoiceId(),
        kind: 'other',
        classEntryId: gainingEntryId,
        grantedAtLevel: newLevel,
        label: `${levelLabel}: ${feature.name}`,
        count: feature.count,
        picks: selected.map((optionId) => ({ optionId })),
        resolved: true,
      })
    }

    for (const skill of choices.skillChoices) {
      const selected = draft.skillOptions[skill.featureId] ?? []
      if (selected.length === 0) continue
      newChoices.push({
        id: nextChoiceId(),
        kind: 'classSkills',
        classEntryId: gainingEntryId,
        grantedAtLevel: newLevel,
        label: `${levelLabel}: ${skill.subclassName ? skill.subclassName : gainingClassName} skills`,
        count: skill.count,
        picks: selected.map((optionId) => ({ optionId })),
        resolved: true,
      })
    }

    for (const pick of choices.subclassSpellChoices) {
      const selected = draft.subclassSpellOptions[pick.featureId] ?? []
      if (selected.length === 0) continue
      newChoices.push({
        id: nextChoiceId(),
        kind: 'other',
        classEntryId: gainingEntryId,
        grantedAtLevel: newLevel,
        label: `${levelLabel}: ${pick.subclassName} ${pick.name}${pick.replace ? ' (replacement)' : ''}`,
        count: pick.count,
        picks: selected.map((optionId) => ({ optionId })),
        resolved: true,
      })
    }

    // Spell picks - create Choice records
    for (const spellPick of choices.spellPicks) {
      if (spellPick.classId !== gainingClassId) continue

      // Cantrips
      if (spellPick.cantripCount > 0 && draft.cantripIds.length > 0 && gainingEntryId) {
        newChoices.push({
          id: nextChoiceId(),
          kind: 'cantrips',
          classEntryId: gainingEntryId,
          grantedAtLevel: newLevel,
          label: `${levelLabel}: ${gainingClassName} cantrips`,
          count: spellPick.cantripCount,
          picks: draft.cantripIds.map((id) => ({ optionId: id })),
          resolved: true,
        })
      }

      // Levelled spells
      if (spellPick.spellCount > 0 && gainingEntryId) {
        const sc = derived?.classDefs.find((c) => c.id === gainingClassId)?.spellcasting
        if (sc) {
          const spellKind = sc.spellsMode === 'prepared' ? 'spellsPrepared' : 'spellsKnown'
          const spellIds = spellKind === 'spellsPrepared' ? draft.spellIdsPrepared : draft.spellIdsKnown
          if (spellIds.length > 0) {
            newChoices.push({
              id: nextChoiceId(),
              kind: spellKind,
              classEntryId: gainingEntryId,
              grantedAtLevel: newLevel,
              label: `${levelLabel}: ${gainingClassName} ${spellPick.spellLevel.join('/')}th-level spells`,
              count: spellPick.spellCount,
              picks: spellIds.map((id) => ({ optionId: id })),
              resolved: true,
            })
          }
        }
      }
    }

    // Build updated classes array
    let updatedClasses: ClassEntry[]
    if (isNewClass) {
      // New class: append a new ClassEntry at level 1
      // NOTE: Per 2024 rules, multiclassing does NOT grant starting equipment or coins.
      const newEntryId = createId('class')
      const skillPicks = computeSkillPicks()
      const featurePicks = computeFeaturePicks()
      const spellPick = choices.spellPicks.find((sp) => sp.classId === gainingClassId)
      const sc = derived?.classDefs.find((cl) => cl.id === gainingClassId)?.spellcasting
      const spellKind = sc?.spellsMode === 'prepared' ? 'prepared' : 'known'
      const newCantripIds = spellPick && spellPick.cantripCount > 0 ? draft.cantripIds : []
      const newSpellIds = spellPick && spellPick.spellCount > 0
        ? (spellKind === 'prepared' ? draft.spellIdsPrepared : draft.spellIdsKnown)
        : []

      const newEntry: ClassEntry = {
        id: newEntryId,
        classId: draft.newClassId,
        level: 1,
        isPrimary: false,
        subclassId: draft.subclassId || undefined,
        skillPicks,
        cantripIds: newCantripIds,
        spellIdsKnown: spellKind === 'known' ? newSpellIds : [],
        spellIdsPrepared: spellKind === 'prepared' ? newSpellIds : [],
        weaponMasteries: draft.masteries,
        featurePicks,
        // startingEquipmentOptionId is intentionally NOT set — multiclassing grants no starting equipment
      }

      updatedClasses = [...character.classes, newEntry]
    } else {
      // Advance existing class: map and update the gaining entry
      updatedClasses = character.classes.map((c) => {
        if (c.id !== entry?.id) return c
        const featurePicks = computeFeaturePicks(c.featurePicks)
        const spellPick = choices.spellPicks.find((sp) => sp.classId === entry.classId)
        const sc = derived?.classDefs.find((cl) => cl.id === entry.classId)?.spellcasting
        const spellKind = sc?.spellsMode === 'prepared' ? 'prepared' : 'known'
        const newCantripIds = spellPick && spellPick.cantripCount > 0 ? draft.cantripIds : []
        const newSpellIds = spellPick && spellPick.spellCount > 0
          ? (spellKind === 'prepared' ? draft.spellIdsPrepared : draft.spellIdsKnown)
          : []

        return {
          ...c,
          level: newClassLevel,
          subclassId: draft.subclassId || c.subclassId,
          weaponMasteries: draft.masteries,
          featurePicks,
          skillPicks: [
            ...c.skillPicks,
            ...computeSkillPicks(),
          ],
          cantripIds: [...c.cantripIds, ...newCantripIds],
          spellIdsKnown: spellKind === 'known' ? [...c.spellIdsKnown, ...newSpellIds] : c.spellIdsKnown,
          spellIdsPrepared: spellKind === 'prepared' ? [...c.spellIdsPrepared, ...newSpellIds] : c.spellIdsPrepared,
        }
      })
    }

    const updated: Character = {
      ...character,
      level: newLevel,
      abilityScoreBase,
      choices: newChoices,
      updatedAt: new Date().toISOString(),
      classes: updatedClasses,
      lineageSpellIds: applyLineageGrants(
        character.species.lineageId,
        newLevel,
        character.lineageSpellIds,
      ),
      // Coins are NOT modified for multiclass — 2024 rules grant no starting equipment/coins
    }

    // Mark the write in flight before the await so a double click cannot queue a
    // second save; the button reads this to disable itself.
    setStatus('saving')
    const saved = await upsert(updated)
    if (!saved.ok) {
      setSaveError(saved.error ?? 'That level could not be saved.')
      setStatus('save-error')
      return
    }
    setCharacter(updated)
    setDerived(deriveCharacter(updated))
    setStatus('saved')
  }, [character, entry, targetEntry, choices, draft, blockers, newClassLevel, entryClassName, masteryRequired, isNewClass, newClassEntryClassDef, derived])

  const reset = useCallback(() => {
    setDraft(emptyDraft())
    setSaveError(null)
    setStatus('ready')
  }, [])

  return {
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
    isNewClass,
    availableNewClasses,
    setKind: (kind: LevelUpKind) => setDraft((d) => ({ ...d, kind })),
    setNewClassId: (id: string) => setDraft((d) => ({ ...d, newClassId: id })),
    reload,
    apply,
    reset,
  }
}
