import { useId, useLayoutEffect, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useControlProps } from './Field'
import { Icon } from './Icon'
import { ACCENTS, applyAccent, getAccent, setAccent } from '../../lib/theme'
import type { Accent } from '../../lib/theme'

export interface AccentPickerProps {
  /** Controlled selection. Omit it and the picker owns the stored preference. */
  value?: Accent
  /** Fires once the new accent is applied to `<html>` and persisted. */
  onChange?: (accent: Accent) => void
  /** Accessible name for the group. */
  label?: string
  /** Renders the group label instead of leaving it for screen readers only. */
  showLabel?: boolean
  className?: string
}

/** Keys that move focus across the swatch row (a toolbar-style roving stop). */
const MOVE_KEYS = new Set(['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'])

/**
 * Swatch row for the accent colour — the visual sibling of `DensityToggle`.
 *
 * Native buttons with `aria-pressed` rather than radios: each chip announces
 * as "Gold, toggle button, pressed", and the selected one is marked twice —
 * a ring in its own accent plus the check glyph — so the state never rests on
 * colour alone. One tab stop (roving `tabIndex`), arrow keys / Home / End
 * move between chips, Enter and Space pick — the same keyboard feel as the
 * density segments, which clip their radios to 1px.
 *
 * Each chip carries `data-accent` locally, so the `[data-accent]` blocks in
 * `styles/theme.css` paint it with its own colour no matter which accent is
 * applied app-wide: the hex values live in CSS only, never in this file.
 *
 * Safe to render before anything has been read: state starts from whatever is
 * already applied (or the stored choice, or the default) and a layout effect
 * writes the attribute before the browser paints.
 */
export function AccentPicker({
  value,
  onChange,
  label = 'Accent colour',
  showLabel = false,
  className,
}: AccentPickerProps) {
  const groupId = useId()
  const a11y = useControlProps()
  const [stored, setStored] = useState<Accent>(() => getAccent())
  const current = value ?? stored

  // Keeps `<html data-accent>` truthful when a parent drives `value`.
  // Layout effect, so the attribute is set before paint — no flash.
  useLayoutEffect(() => {
    applyAccent(current)
  }, [current])

  const select = (next: Accent) => {
    setAccent(next)
    if (value === undefined) setStored(next)
    onChange?.(next)
  }

  // Roving focus: the group is one tab stop, arrows walk the row with wrap.
  const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!MOVE_KEYS.has(event.key)) return
    const chips = Array.from(event.currentTarget.querySelectorAll('button'))
    const from = chips.indexOf(document.activeElement as HTMLButtonElement)
    if (from === -1) return
    event.preventDefault()
    let to = from
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      to = (from + 1) % chips.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      to = (from - 1 + chips.length) % chips.length
    } else if (event.key === 'Home') {
      to = 0
    } else if (event.key === 'End') {
      to = chips.length - 1
    }
    chips[to]?.focus()
  }

  return (
    <div className={['theme-picker', className].filter(Boolean).join(' ')}>
      <span
        id={`${groupId}-label`}
        className={showLabel ? 'theme-picker-label' : 'visually-hidden'}
      >
        {label}
      </span>
      <div
        className="theme-swatches"
        role="group"
        aria-labelledby={`${groupId}-label`}
        aria-describedby={a11y['aria-describedby']}
        aria-invalid={a11y['aria-invalid']}
        onKeyDown={moveFocus}
      >
        {ACCENTS.map((option) => {
          const checked = option.value === current
          return (
            <button
              key={option.value}
              type="button"
              className={['theme-swatch', checked ? 'is-active' : '']
                .filter(Boolean)
                .join(' ')}
              data-accent={option.value}
              aria-pressed={checked}
              aria-label={option.label}
              title={option.label}
              tabIndex={checked ? 0 : -1}
              onClick={() => select(option.value)}
            >
              {checked ? <Icon name="check" size={12} /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
