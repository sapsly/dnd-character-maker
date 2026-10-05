import { useMemo, useState } from 'react'
import type { SpellDef, SpeciesLineageId } from '../../types/character'
import { SPELLS, spellsForClass } from '../../data/spells'
import { Card } from '../ui/Card'
import { Field } from '../ui/Field'
import { Select } from '../ui/Select'
import { Tag } from '../ui/Tag'
import { TextInput } from '../ui/TextInput'

export interface SpellPickerProps {
  /** The class ID to filter spells for, or all spells if not provided */
  classId?: string
  /**
   * Draw from several class spell lists at once, for pools that mix lists
   * (e.g. Bard College of Lore's Magical Discoveries: cleric, druid, wizard).
   * Takes precedence over `classId`.
   */
  classIds?: string[]
  /**
   * Lineage whose granted spells join the pool, for species that pick one
   * (Elf, Gnome, Tiefling). Matches against `SpellDef.speciesLineages` only —
   * deliberately separate from the `classes` matching above, because a lineage
   * grant is not a class feature. Rows are then labelled "Race" or "Class" so
   * the player can see where each spell came from.
   */
  lineageId?: SpeciesLineageId
  /** Minimum spell level to show (0 = cantrips, 1 = 1st level, etc.) */
  minLevel?: number
  /** Maximum spell level to show */
  maxLevel?: number
  /** Spell ids to hide — used to keep a filled pool from offering the same spell twice */
  excludeIds?: string[]
  /** Number of spells the player must pick */
  count: number
  /** Currently picked spell IDs */
  pickedIds: string[]
  /** Called when the picked set changes */
  onChange: (pickedIds: string[]) => void
  /** Optional label for the picker */
  label?: string
  /** Optional hint text */
  hint?: string
  /** Optional extra CSS classes for the container */
  className?: string
  /** Show spell description in the option */
  showDescription?: boolean
}

const LEVEL_LABELS: Record<number, string> = {
  0: 'Cantrip',
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th',
  6: '6th',
  7: '7th',
  8: '8th',
  9: '9th',
}

/** Format spell level for display */
function formatLevel(level: number): string {
  return LEVEL_LABELS[level] ?? `Level ${level}`
}

/** Format casting components for display */
function formatComponents(spell: SpellDef): string {
  const parts: string[] = []
  if (spell.components.verbal) parts.push('V')
  if (spell.components.somatic) parts.push('S')
  if (spell.components.material) parts.push('M')
  if (spell.components.ritual) parts.push('Ritual')
  return parts.join(', ')
}

/**
 * Whether a spell sits on the class list this picker was pointed at.
 *
 * Kept apart from `speciesLineages` on purpose: a lineage grant is not a class
 * feature, so the two sources are matched independently and only compared when
 * the row label is built. With no class filter there is no list to attribute a
 * spell to, so nothing claims one.
 */
function onClassList(spell: SpellDef, classId?: string, classIds?: string[]): boolean {
  if (classIds && classIds.length > 0) {
    const wanted = new Set(classIds)
    return spell.classes.some((c) => wanted.has(c))
  }
  if (classId) return spell.classes.includes(classId)
  return false
}

export function SpellPicker({
  classId,
  classIds,
  lineageId,
  minLevel = 0,
  maxLevel = 9,
  excludeIds,
  count,
  pickedIds,
  onChange,
  label,
  hint,
  className,
  showDescription = true,
}: SpellPickerProps) {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all')

  const candidateSpells = useMemo((): SpellDef[] => {
    let spells: SpellDef[]
    if (classIds && classIds.length > 0) {
      // A pool that mixes lists (e.g. Magical Discoveries) keeps any spell at
      // least one of its lists offers, matched against `SpellDef.classes`.
      const wanted = new Set(classIds)
      spells = SPELLS.filter((s) => s.classes.some((c) => wanted.has(c)))
    } else if (classId) {
      spells = spellsForClass(classId)
    } else {
      spells = SPELLS
    }
    // Lineage grants join the same list as class spells rather than living in a
    // panel of their own. They are matched via `speciesLineages` here instead of
    // being pushed into the `classes` comparison above, so a class pool stays
    // honest about what its class actually teaches.
    if (lineageId) {
      const inPool = new Set(spells.map((s) => s.id))
      spells = spells.concat(
        SPELLS.filter((s) => s.speciesLineages?.includes(lineageId) && !inPool.has(s.id)),
      )
    }
    const excluded = excludeIds && excludeIds.length > 0 ? new Set(excludeIds) : null
    return spells.filter(
      (s) => s.level >= minLevel && s.level <= maxLevel && !(excluded && excluded.has(s.id))
    )
  }, [classId, classIds, lineageId, excludeIds, minLevel, maxLevel])

  const filteredSpells = useMemo((): SpellDef[] => {
    let result = candidateSpells

    if (search.trim()) {
      const query = search.trim().toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.school.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query),
      )
    }

    if (levelFilter !== 'all') {
      result = result.filter((s) => s.level === levelFilter)
    }

    // Sort: picked first, then by level, then by name
    result.sort((a, b) => {
      const aPicked = pickedIds.includes(a.id)
      const bPicked = pickedIds.includes(b.id)
      if (aPicked !== bPicked) return aPicked ? -1 : 1
      if (a.level !== b.level) return a.level - b.level
      return a.name.localeCompare(b.name)
    })

    return result
  }, [candidateSpells, search, levelFilter, pickedIds])

  const availableLevels = useMemo((): number[] => {
    const levels = new Set<number>()
    candidateSpells.forEach((s) => levels.add(s.level))
    return Array.from(levels).sort((a, b) => a - b)
  }, [candidateSpells])

  const isAtLimit = pickedIds.length >= count
  const isSatisfied = pickedIds.length === count

  const toggleSpell = (spellId: string) => {
    const isPicked = pickedIds.includes(spellId)
    if (isPicked) {
      onChange(pickedIds.filter((id) => id !== spellId))
    } else if (!isAtLimit) {
      onChange([...pickedIds, spellId])
    }
  }

  return (
    <Card title={label} className={`spell-picker ${className ?? ''}`}>
      {hint && <p className="sheet-hint">{hint}</p>}

      <div className="spell-picker-toolbar">
        <Field label="Search spells" htmlFor="spell-search" inline>
          <TextInput
            id="spell-search"
            value={search}
            onValueChange={setSearch}
            placeholder="Filter by name, school, or description"
          />
        </Field>
        <Field label="Level" htmlFor="spell-level-filter" inline>
          <Select
            id="spell-level-filter"
            value={levelFilter === 'all' ? '' : String(levelFilter)}
            onValueChange={(v) => setLevelFilter(v === '' ? 'all' : Number(v))}
            placeholder="All levels"
          >
            <option value="">All levels</option>
            {availableLevels.map((lvl) => (
              <option key={lvl} value={String(lvl)}>
                {formatLevel(lvl)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="spell-picker-status">
        <span className={isSatisfied ? 'spell-picker-status--satisfied' : ''}>
          {pickedIds.length} / {count} selected
        </span>
        {isAtLimit && !isSatisfied && (
          <span className="spell-picker-status--warning">
            Maximum reached — unselect to change
          </span>
        )}
      </div>

      <ul className="spell-picker-list" role="listbox" aria-label={label ?? 'Spells'}>
        {filteredSpells.length === 0 ? (
          <li className="spell-picker-empty">
            <p>No spells match your filters.</p>
            {search && <p>Try clearing the search or level filter.</p>}
          </li>
        ) : (
          filteredSpells.map((spell) => {
            const isPicked = pickedIds.includes(spell.id)
            const disabled = isAtLimit && !isPicked

            // Source label, only meaningful once a lineage is in play. A spell
            // both granted by the lineage and on the class list (e.g.
            // Prestidigitation for a High Elf wizard) is credited to the race,
            // with the tag title carrying the "and your class list too" nuance.
            let sourceLabel: string | null = null
            let sourceTone: 'accent' | 'muted' = 'muted'
            let sourceTitle: string | undefined
            if (lineageId) {
              const inLineage = spell.speciesLineages?.includes(lineageId) ?? false
              const inClass = onClassList(spell, classId, classIds)
              if (inLineage) {
                sourceLabel = 'Race'
                sourceTone = 'accent'
                sourceTitle = inClass
                  ? 'Granted by your lineage — also on your class spell list.'
                  : 'Granted by your lineage, not on your class spell list.'
              } else if (inClass) {
                sourceLabel = 'Class'
                sourceTone = 'muted'
                sourceTitle = 'On your class spell list.'
              }
            }

            return (
              <li key={spell.id} className="spell-picker-item">
                <label
                  className={`spell-picker-option${isPicked ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isPicked}
                    onChange={() => toggleSpell(spell.id)}
                    disabled={disabled}
                    aria-selected={isPicked}
                  />
                  <div className="spell-picker-option-body">
                    <div className="spell-picker-option-header">
                      <span className="spell-picker-option-name">{spell.name}</span>
                      <Tag tone="neutral" className="spell-picker-level-tag">
                        {formatLevel(spell.level)}
                      </Tag>
                      {sourceLabel ? (
                        <Tag tone={sourceTone} className="spell-picker-source-tag" title={sourceTitle}>
                          {sourceLabel}
                        </Tag>
                      ) : null}
                    </div>
                    <div className="spell-picker-option-meta">
                      <span className="spell-picker-school">{spell.school}</span>
                      <span className="spell-picker-casting-time">{spell.castingTime}</span>
                      <span className="spell-picker-range">{spell.range}</span>
                      <span className="spell-picker-components">{formatComponents(spell)}</span>
                      <span className="spell-picker-duration">{spell.duration}</span>
                      {spell.concentration && (
                        <Tag tone="accent" className="spell-picker-concentration">
                          Concentration
                        </Tag>
                      )}
                    </div>
                    {showDescription && (
                      <p className="spell-picker-description">{spell.description}</p>
                    )}
                  </div>
                </label>
              </li>
            )
          })
        )}
      </ul>
    </Card>
  )
}