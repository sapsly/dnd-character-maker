import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { Field } from '../ui/Field'
import { Icon } from '../ui/Icon'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { Tag } from '../ui/Tag'
import { TextInput } from '../ui/TextInput'
import {
  SECTION_BY_ID,
  SECTIONS,
  SPELL_LEVEL_OPTIONS,
  SPELL_SCHOOL_OPTIONS,
  buildEntries,
} from './compendiumModel'
import type { CompendiumSectionId } from './compendiumModel'
import { CompendiumDetail } from './CompendiumDetail'

/**
 * Rows drawn at a time. The catalogs are large (455 spells, 208 feats), so the
 * filtered slice is capped and extended on demand instead of mounting the whole
 * section in one frame.
 */
const PAGE_SIZE = 60

export default function CompendiumPage() {
  const [sectionId, setSectionId] = useState<CompendiumSectionId>('species')
  const [groupId, setGroupId] = useState('')
  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  /** The card that launched the dialog, so focus can return to it on close. */
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const section = SECTION_BY_ID[sectionId]

  // Filters are scoped to the section they were typed in, so switching sections
  // starts clean — a leftover needle would otherwise read as an empty catalog.
  const openSection = (id: CompendiumSectionId) => {
    if (id !== sectionId) {
      setSectionId(id)
      setQuery('')
      setLevelFilter('')
      setSchoolFilter('')
      setSelectedId(null)
    }
    setGroupId('')
  }

  // Moving between sub-groups keeps the search: "longbow" stays useful when the
  // player steps from Weapons to Armor.
  const openGroup = (id: CompendiumSectionId, group: string) => {
    if (id !== sectionId) {
      setSectionId(id)
      setQuery('')
      setLevelFilter('')
      setSchoolFilter('')
      setSelectedId(null)
    }
    setGroupId(group)
  }

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [sectionId, groupId, query, levelFilter, schoolFilter])

  const entries = useMemo(
    () => buildEntries(sectionId, groupId),
    [sectionId, groupId],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = entries
    if (needle) list = list.filter((entry) => entry.haystack.includes(needle))
    if (levelFilter !== '') {
      const level = Number(levelFilter)
      list = list.filter((entry) => entry.facetLevel === level)
    }
    if (schoolFilter !== '') {
      list = list.filter((entry) => entry.facetSchool === schoolFilter)
    }
    return list
  }, [entries, query, levelFilter, schoolFilter])

  // Falls back to the first match so there is always a current row; a selection
  // that drops out of the filter simply returns to it later.
  const selected = useMemo(() => {
    if (filtered.length === 0) return null
    return filtered.find((entry) => entry.id === selectedId) ?? filtered[0]
  }, [filtered, selectedId])

  // The dialog reads the same entry the list highlights, so one source of truth
  // drives both: a click on another row swaps the content in place rather than
  // closing and reopening.
  const modalEntry = dialogOpen ? selected : null

  /** Opens the dialog and remembers which card to hand focus back to. */
  const openEntry = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    triggerRef.current = event.currentTarget
    setSelectedId(id)
    setDialogOpen(true)
  }

  // Kept referentially stable: the Modal's open/close effect depends on it, and
  // a fresh function each render would re-capture its restore target every time
  // this page re-rendered while the dialog was up.
  const closeEntry = useCallback(() => setDialogOpen(false), [])

  // The Modal restores focus to whatever was focused when it opened, which is
  // the card wherever clicking a button focuses it. Where it does not (Safari
  // leaves focus on <body>), re-point the restore at the card that launched the
  // dialog so Tab carries on through the list.
  useEffect(() => {
    if (dialogOpen) return
    const trigger = triggerRef.current
    if (trigger?.isConnected) trigger.focus({ preventScroll: true })
  }, [dialogOpen])

  const visible = filtered.slice(0, visibleCount)
  const group = groupId ? section.groups.find((item) => item.id === groupId) ?? null : null
  const listLabel = group ? group.label : section.label
  const kicker = group ? `${section.label} · ${group.label}` : section.label
  const noun = sectionId === 'equipment' ? 'items' : section.label.toLowerCase()
  const trimmed = query.trim()
  const matchesAll = filtered.length === entries.length
  const countText = matchesAll ? `${entries.length} entries` : `${filtered.length} of ${entries.length}`

  return (
    <section className="page compendium-page">
      <header className="page-head">
        <div>
          <h1 className="page-title">Compendium</h1>
          <p className="page-subtitle">
            Browse the rules reference: species, classes, backgrounds, feats, equipment, tools, and
            spells.
          </p>
        </div>
        <div className="page-actions">
          <Tag tone="muted">
            {section.count} {noun}
          </Tag>
        </div>
      </header>

      <div className="compendium-body">
        <nav className="compendium-nav" aria-label="Compendium sections">
          <p className="compendium-nav-label">Contents</p>
          <ul className="compendium-nav-list">
            {SECTIONS.map((item) => {
              const isCurrent = item.id === sectionId
              const isRootSelected = isCurrent && groupId === ''
              return (
                <li key={item.id} className="compendium-nav-row">
                  <button
                    type="button"
                    className={`compendium-nav-item${isCurrent ? ' is-active' : ''}${
                      isRootSelected ? ' is-selected' : ''
                    }`}
                    aria-current={isRootSelected ? 'true' : undefined}
                    onClick={() => openSection(item.id)}
                  >
                    <span className="compendium-nav-name">{item.label}</span>
                    <span className="compendium-nav-count">{item.count}</span>
                  </button>
                  {item.groups.length > 0 ? (
                    <ul className="compendium-nav-sub">
                      {item.groups.map((sub) => {
                        const isSubSelected = isCurrent && groupId === sub.id
                        return (
                          <li key={sub.id}>
                            <button
                              type="button"
                              className={`compendium-nav-item compendium-nav-item--sub${
                                isSubSelected ? ' is-active is-selected' : ''
                              }`}
                              aria-current={isSubSelected ? 'true' : undefined}
                              onClick={() => openGroup(item.id, sub.id)}
                            >
                              <span className="compendium-nav-name">{sub.label}</span>
                              <span className="compendium-nav-count">{sub.count}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="compendium-main">
          <div className="compendium-toolbar">
            <Field
              label="Search"
              htmlFor="compendium-search"
              className="compendium-toolbar-search"
            >
              <TextInput
                id="compendium-search"
                type="search"
                value={query}
                onValueChange={setQuery}
                placeholder={`Search ${section.label.toLowerCase()}`}
              />
            </Field>

            {sectionId === 'spells' ? (
              <>
                <Field
                  label="Level"
                  htmlFor="compendium-level"
                  className="compendium-toolbar-facet"
                >
                  <Select id="compendium-level" value={levelFilter} onValueChange={setLevelFilter}>
                    {SPELL_LEVEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field
                  label="School"
                  htmlFor="compendium-school"
                  className="compendium-toolbar-facet"
                >
                  <Select
                    id="compendium-school"
                    value={schoolFilter}
                    onValueChange={setSchoolFilter}
                  >
                    {SPELL_SCHOOL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </>
            ) : null}
          </div>

          <Card
            flush
            className="compendium-list-card"
            title={
              <span className="compendium-list-title">
                <Icon name="book" size={14} />
                {listLabel}
              </span>
            }
            actions={<Tag tone="muted">{countText}</Tag>}
          >
            {filtered.length === 0 ? (
              <EmptyState
                icon="search"
                title="No results match your search"
                description={
                  trimmed
                    ? `Nothing in ${listLabel.toLowerCase()} matches “${trimmed}”.`
                    : `Nothing in ${listLabel.toLowerCase()} matches the selected level and school.`
                }
                action={
                  trimmed ? (
                    <Button variant="secondary" onClick={() => setQuery('')}>
                      Clear search
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setLevelFilter('')
                        setSchoolFilter('')
                      }}
                    >
                      Reset filters
                    </Button>
                  )
                }
                className="compendium-empty"
              />
            ) : (
              <>
                <ul className="compendium-list">
                  {visible.map((entry) => {
                    const isSelected = selected?.id === entry.id
                    return (
                      <li key={entry.id}>
                        <button
                          type="button"
                          className={`compendium-card${isSelected ? ' is-selected' : ''}`}
                          aria-current={isSelected ? 'true' : undefined}
                          aria-haspopup="dialog"
                          onClick={(event) => openEntry(event, entry.id)}
                        >
                          <span className="compendium-card-name" title={entry.name}>
                            {entry.name}
                          </span>
                          <span className="compendium-card-meta" title={entry.meta}>
                            {entry.meta}
                          </span>
                          <span className="compendium-card-tags">
                            {entry.badges.map((badge, index) => (
                              <Tag
                                key={`${badge.label}-${index}`}
                                tone={badge.tone}
                                solid={badge.solid}
                                title={badge.title}
                                className="compendium-card-tag"
                              >
                                <span className="compendium-tag-text">{badge.label}</span>
                              </Tag>
                            ))}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>

                {filtered.length > visible.length ? (
                  <div className="compendium-more">
                    <p className="compendium-more-text">
                      Showing {visible.length} of {filtered.length}
                    </p>
                    <Button
                      variant="secondary"
                      icon="chevron-down"
                      onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                    >
                      Show more
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </Card>

          {/* Same entry as the highlighted card: portal, Escape, backdrop click
              and focus handling all come from the shared dialog. */}
          <Modal
            open={modalEntry !== null}
            onClose={closeEntry}
            title={modalEntry ? modalEntry.name : ''}
            size="md"
            className="compendium-modal"
            backdropClassName="compendium-backdrop"
          >
            <CompendiumDetail sectionId={sectionId} kicker={kicker} entry={modalEntry} />
          </Modal>
        </div>
      </div>
    </section>
  )
}
