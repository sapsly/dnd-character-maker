import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Character } from '../../types/character'
import { useAuth } from '../../context/AuthContext'
import { downloadCharacter, parseImport } from '../../lib/storage'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Field } from '../ui/Field'
import { Icon } from '../ui/Icon'
import { TextInput } from '../ui/TextInput'
import { CharacterRow } from './CharacterRow'
import { DeleteDialog } from './DeleteDialog'
import { useCharacters } from './useCharacters'

type Notice = { tone: 'error' | 'success'; text: string }

const FILTER_THRESHOLD = 4

/** Favorites first, then alphabetical by name regardless of case. */
function sortRoster(characters: Character[]): Character[] {
  return [...characters].sort((a, b) => {
    if (a.meta.isFavorite !== b.meta.isFavorite) return a.meta.isFavorite ? -1 : 1
    return a.meta.name.localeCompare(b.meta.name, undefined, { sensitivity: 'base' })
  })
}

/**
 * Where the roster lives decides how the count reads: signed in, characters
 * are stored on the account; signed out, they are stored in this browser.
 * Stating it keeps the promise honest in both directions.
 */
function countLabel(count: number, signedIn: boolean): string {
  const where = signedIn ? 'to your account' : 'in this browser'
  if (count === 0) return `No characters saved yet`
  return count === 1 ? `1 character saved ${where}` : `${count} characters saved ${where}`
}

export default function RosterPage() {
  const { characters, loading, error, saveCharacter, removeCharacter, reload, clearError } =
    useCharacters()
  const { user } = useAuth()
  const navigate = useNavigate()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Character | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [importing, setImporting] = useState(false)

  const showFilter = characters.length > FILTER_THRESHOLD
  const visible = useMemo(() => {
    const sorted = sortRoster(characters)
    const needle = query.trim().toLowerCase()
    if (!needle) return sorted
    return sorted.filter((character) =>
      `${character.meta.name} ${character.species.speciesId} ${character.classes
        .map((entry) => entry.classId)
        .join(' ')}`
        .toLowerCase()
        .includes(needle),
    )
  }, [characters, query])

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const file = input.files?.[0]
    // Reset so choosing the same file again still fires a change event.
    input.value = ''
    if (!file) return

    setImporting(true)
    setNotice(null)
    try {
      const text = await file.text()
      const parsed = parseImport(text)
      if (!parsed.ok || !parsed.character) {
        setNotice({
          tone: 'error',
          text: parsed.error ?? 'That file does not contain a readable character.',
        })
        return
      }
      const saved = saveCharacter(parsed.character)
      if (!saved.ok) {
        setNotice({ tone: 'error', text: saved.error ?? 'That character could not be saved.' })
        return
      }
      setNotice({
        tone: 'success',
        text: `Imported ${parsed.character.meta.name.trim() || 'character'}.`,
      })
      navigate(`/character/${parsed.character.id}`)
    } catch (caught) {
      setNotice({
        tone: 'error',
        text: `Could not read that file: ${caught instanceof Error ? caught.message : 'unknown error'}`,
      })
    } finally {
      setImporting(false)
    }
  }

  const handleExport = (character: Character) => {
    downloadCharacter(character)
    setNotice({
      tone: 'success',
      text: `Exported ${character.meta.name.trim() || 'character'} as a JSON file.`,
    })
  }

  const handleDelete = (character: Character) => {
    const result = removeCharacter(character.id)
    setPendingDelete(null)
    if (!result.ok) {
      setNotice({ tone: 'error', text: result.error ?? 'That character could not be deleted.' })
      return
    }
    setNotice({
      tone: 'success',
      text: `Deleted ${character.meta.name.trim() || 'character'}.`,
    })
  }

  const fileInput = (
    <input
      ref={fileInputRef}
      className="visually-hidden"
      type="file"
      accept=".json,application/json"
      tabIndex={-1}
      aria-hidden="true"
      onChange={handleFile}
    />
  )

  return (
    <section className="page roster-page">
      <header className="page-head">
        <div>
          <h1 className="page-title">Roster</h1>
          <p className="page-subtitle">
            {loading ? 'Loading characters' : countLabel(characters.length, Boolean(user))}
          </p>
        </div>
        <div className="page-actions">
          <Button variant="primary" icon="plus" onClick={() => navigate('/create')}>
            New character
          </Button>
          <Button
            variant="secondary"
            icon="upload"
            onClick={handleImportClick}
            disabled={importing}
          >
            {importing ? 'Reading file' : 'Import'}
          </Button>
          {fileInput}
        </div>
      </header>

      {notice ? (
        <div
          className={notice.tone === 'error' ? 'banner banner--error' : 'banner banner--success'}
          role={notice.tone === 'error' ? 'alert' : 'status'}
        >
          <Icon name={notice.tone === 'error' ? 'alert' : 'check'} size={16} />
          <p className="banner-text">{notice.text}</p>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setNotice(null)}
            aria-label="Dismiss message"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      ) : null}

      {error && characters.length > 0 ? (
        <div className="banner banner--error" role="alert">
          <Icon name="alert" size={16} />
          <p className="banner-text">{error}</p>
          <button type="button" className="icon-btn" onClick={clearError} aria-label="Dismiss message">
            <Icon name="close" size={14} />
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="panel roster-loading" aria-busy="true" aria-live="polite">
          <p className="roster-loading-text">Loading characters</p>
          <div className="skeleton-row" aria-hidden="true" />
          <div className="skeleton-row" aria-hidden="true" />
          <div className="skeleton-row" aria-hidden="true" />
        </div>
      ) : null}

      {!loading && error && characters.length === 0 ? (
        <EmptyState
          tone="warning"
          icon="alert"
          title="Saved characters could not be read"
          description={error}
          action={
            <Button variant="secondary" onClick={reload}>
              Try again
            </Button>
          }
        />
      ) : null}

      {!loading && !error && characters.length === 0 ? (
        <EmptyState
          icon="user"
          title="No characters yet"
          description="Create a character, or import a JSON file someone exported."
          action={
            <>
              <Button variant="primary" icon="plus" onClick={() => navigate('/create')}>
                New character
              </Button>
              <Button variant="secondary" icon="upload" onClick={handleImportClick}>
                Import
              </Button>
            </>
          }
        />
      ) : null}

      {!loading && characters.length > 0 ? (
        <>
          {showFilter ? (
            <Field label="Filter roster" className="roster-filter" htmlFor="roster-filter">
              <TextInput
                id="roster-filter"
                value={query}
                onValueChange={setQuery}
                placeholder="Search by name, class, or species"
                type="search"
              />
            </Field>
          ) : null}

          {visible.length === 0 ? (
            <EmptyState
              icon="search"
              title="No characters match that filter"
              description={`Nothing in your roster matches “${query.trim()}”.`}
              action={
                <Button variant="secondary" onClick={() => setQuery('')}>
                  Clear filter
                </Button>
              }
            />
          ) : (
            <ul className="roster-list">
              {visible.map((character) => (
                <CharacterRow
                  key={character.id}
                  character={character}
                  onExport={handleExport}
                  onDelete={setPendingDelete}
                />
              ))}
            </ul>
          )}
        </>
      ) : null}

      <DeleteDialog
        character={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </section>
  )
}
