import { Link } from 'react-router-dom'
import type { Character } from '../../types/character'
import { getClass } from '../../data/classes'
import { SPECIES_BY_ID } from '../../data/species'
import { ACCENTS } from '../../lib/theme'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../ui/Icon'
import { Tag } from '../ui/Tag'
import { buttonClassName } from '../ui/Button'

export interface CharacterRowProps {
  character: Character
  onExport: (character: Character) => void
  onDelete: (character: Character) => void
}

function primaryClassLabel(character: Character): string {
  const entry = character.classes.find((item) => item.isPrimary) ?? character.classes[0]
  if (!entry) return 'No class yet'
  return getClass(entry.classId)?.name ?? entry.classId
}

function speciesLabel(character: Character): string {
  return SPECIES_BY_ID[character.species.speciesId]?.name ?? 'Unknown species'
}

function otherClassesLabel(character: Character): string | null {
  const others = character.classes.filter((entry) => !entry.isPrimary)
  if (others.length === 0) return null
  return others
    .map((entry) => `${getClass(entry.classId)?.name ?? entry.classId} ${entry.level}`)
    .join(', ')
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Swatch text must stay readable over whatever color the character carries.
 *
 * The two ink values are tokens (`--swatch-ink-dark` / `--swatch-ink-light`
 * in `styles/global.css`), not literals: they are theme-layer values that
 * intentionally ignore the colour mode, because the swatch ground is a
 * user-chosen colour that does not change with it.
 */
function swatchInk(color: string): string {
  const match = /^#([0-9a-f]{6})$/i.exec(color.trim())
  if (!match) return 'var(--swatch-ink-dark)'
  const value = Number.parseInt(match[1], 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.55 ? 'var(--swatch-ink-dark)' : 'var(--swatch-ink-light)'
}

export function CharacterRow({ character, onExport, onDelete }: CharacterRowProps) {
  const { user } = useAuth()
  const name = character.meta.name.trim() || 'Unnamed character'
  const favorite = character.meta.isFavorite
  const others = otherClassesLabel(character)
  // Only characters that actually override the app accent get a marker, so the
  // dot reads as "this one has its own colour" rather than as roster chrome.
  const accent = character.accent
    ? ACCENTS.find((option) => option.value === character.accent)
    : undefined
  // What the file is for depends on where the roster lives: a backup of a
  // browser-only roster, or a portable copy of one kept on the account.
  const exportTitle = user
    ? `Download ${name} as a JSON file — your roster is on your account`
    : `Download ${name} as a JSON file — your roster is in this browser`

  return (
    <li
      className={favorite ? 'roster-row roster-row--favorite' : 'roster-row'}
      // Scopes this character's accent to their own row, so the row's accent
      // elements match the sheet without tinting the rest of the roster. The
      // avatar swatch keeps its own inline colour and is unaffected.
      data-character-accent={character.accent ?? undefined}
    >
      <span
        className="roster-avatar"
        style={{
          backgroundColor: character.meta.avatarColor,
          color: swatchInk(character.meta.avatarColor),
        }}
        aria-hidden="true"
      >
        {initials(name)}
      </span>

      <div className="roster-info">
        <div className="roster-name-line">
          <Link className="roster-name" to={`/character/${character.id}`}>
            {name}
          </Link>
          {favorite ? (
            <span className="roster-fav">
              <Icon name="star-filled" size={13} />
              <span className="visually-hidden">Favorite character</span>
            </span>
          ) : null}
          <Tag solid className="roster-level" title={`Level ${character.level}`}>
            level {character.level}
          </Tag>
          {accent ? (
            <span
              className="roster-accent-dot"
              title={`Custom accent: ${accent.label}`}
            >
              <span className="visually-hidden">Custom accent: {accent.label}</span>
            </span>
          ) : null}
        </div>
        <p className="roster-meta">
          <span>{primaryClassLabel(character)}</span>
          <span className="roster-dot" aria-hidden="true">
            ·
          </span>
          <span>{speciesLabel(character)}</span>
          {others ? (
            <>
              <span className="roster-dot" aria-hidden="true">
                ·
              </span>
              <span className="roster-multiclass">{others}</span>
            </>
          ) : null}
        </p>
      </div>

      <div className="roster-actions">
        <Link
          className={buttonClassName('secondary', 'sm')}
          to={`/character/${character.id}`}
          aria-label={`Open ${name}`}
        >
          <span className="btn-label">Open</span>
        </Link>
        <Link
          className={buttonClassName('ghost', 'sm', 'roster-icon-action')}
          to={`/character/${character.id}/edit`}
          aria-label={`Edit ${name}`}
        >
          <Icon name="edit" size={15} />
        </Link>
        <button
          type="button"
          className={buttonClassName('ghost', 'sm', 'roster-icon-action')}
          onClick={() => onExport(character)}
          aria-label={`Export ${name}`}
          title={exportTitle}
        >
          <Icon name="download" size={15} />
        </button>
        <button
          type="button"
          className={buttonClassName('danger', 'sm', 'roster-icon-action')}
          onClick={() => onDelete(character)}
          aria-label={`Delete ${name}`}
        >
          <Icon name="trash" size={15} />
        </button>
      </div>
    </li>
  )
}
