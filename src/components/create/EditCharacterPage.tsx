import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import type { Character } from '../../types/character'
import { loadCharacters } from '../../lib/storage'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'
import CreateCharacterPage from './CreateCharacterPage'

/**
 * Loads the character named by the route and hands it to the shared creation
 * wizard in edit mode. Nothing is written here — saving is the wizard's job, so
 * cancelling away simply leaves the stored character untouched.
 *
 * The load is keyed on the id *and* the location key so navigating from one
 * character straight to another's editor re-reads storage instead of showing the
 * previously loaded character.
 */
export default function EditCharacterPage() {
  const { id = '' } = useParams<{ id: string }>()
  const location = useLocation()
  const [character, setCharacter] = useState<Character | null>(null)
  const [status, setStatus] = useState<'loading' | 'missing' | 'ready'>('loading')

  useEffect(() => {
    let cancelled = false

    const result = loadCharacters()
    const found = result.value.find((candidate) => candidate.id === id) ?? null

    if (cancelled) return
    setCharacter(found)
    setStatus(found ? 'ready' : 'missing')
    return () => {
      cancelled = true
    }
  }, [id, location.key])

  if (status === 'loading') {
    return (
      <section className="page">
        <p className="page-subtitle">Loading character…</p>
      </section>
    )
  }

  if (status === 'missing' || !character) {
    return (
      <section className="page">
        <header className="page-head">
          <div>
            <h1 className="page-title">Character not found</h1>
            <p className="page-subtitle">
              This character is not in the local library, so there is nothing to edit.
            </p>
          </div>
        </header>
        <Card className="create-card">
          <div className="banner banner--error" role="alert">
            <Icon name="alert" size={16} />
            <p className="banner-text">
              No character matched <span className="mono">{id || '(no id)'}</span>. It may have
              been deleted in another tab.
            </p>
          </div>
          <p className="create-note">
            <Link className="link" to="/">
              Back to the roster
            </Link>
          </p>
        </Card>
      </section>
    )
  }

  return <CreateCharacterPage existing={character} />
}