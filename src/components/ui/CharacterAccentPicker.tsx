import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useControlProps } from './Field'
import { Icon } from './Icon'
import { ACCENTS, getAccent } from '../../lib/theme'
import type { Accent } from '../../lib/theme'

export interface CharacterAccentPickerProps {
  /** The character's own override. `null` means it follows the app accent. */
  value: Accent | null
  /** Fires with the new override, or `null` to clear back to the app accent. */
  onChange: (accent: Accent | null) => void
  label?: string
  showLabel?: boolean
  className?: string
}

/** Keys that move focus across the swatch row (a toolbar-style roving stop). */
const MOVE_KEYS = new Set(['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'])

/**
 * Swatch row for a *single character's* accent — the scoped sibling of
 * `AccentPicker`.
 *
 * The two are deliberately separate components rather than one with a `null`
 * state. `AccentPicker` owns a global preference and writes `data-accent` to
 * `<html>`, which is a side effect this feature must never trigger; only the
 * inert variant writes anything to the document, and this one does not. It
 * also renders the extra "follows the app accent" chip that clears the
 * override, which would be meaningless in the global picker.
 *
 * Keyboard behaviour is identical to `AccentPicker` on purpose — native
 * buttons with `aria-pressed`, one tab stop, arrows / Home / End move between
 * chips, Enter and Space pick. The selected chip is marked twice (ring plus
 * check glyph) so the state never rests on colour alone.
 *
 * Each chip carries `data-accent` locally so `theme.css` paints it with its own
 * colour regardless of which accent is applied to the sheet; the hex values
 * stay in CSS and never appear here.
 */
export function CharacterAccentPicker({
  value,
  onChange,
  label = 'This character’s accent colour',
  showLabel = false,
  className,
}: CharacterAccentPickerProps) {
  const groupId = useId()
  const a11y = useControlProps()
  // Read once: the app accent only changes when the header picker is used, and
  // this component is re-rendered by the sheet's own state either way. `null`
  // during SSR/tests is fine — the chip then previews the default gold.
  const [appAccent] = useState<Accent>(() => getAccent())

  // Roving focus: the group is one tab stop, arrows walk the row with wrap.
  const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!MOVE_KEYS.has(event.key)) return
    const nodes = Array.from(event.currentTarget.querySelectorAll('button'))
    const from = nodes.indexOf(document.activeElement as HTMLButtonElement)
    if (from === -1) return
    event.preventDefault()
    let to = from
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      to = (from + 1) % nodes.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      to = (from - 1 + nodes.length) % nodes.length
    } else if (event.key === 'Home') {
      to = 0
    } else if (event.key === 'End') {
      to = nodes.length - 1
    }
    nodes[to]?.focus()
  }

  const isActive = (option: Accent | null) => value === option

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
        {/*
          Escape hatch first, so a keyboard user reaches "use the app default"
          before eight named colours. `data-accent` gives it the live app hue;
          `tint.css` draws the dashed ring and corner wedge.
        */}
        <button
          type="button"
          className={['theme-swatch', 'theme-swatch--inherit', isActive(null) ? 'is-active' : '']
            .filter(Boolean)
            .join(' ')}
          data-accent={appAccent}
          aria-pressed={isActive(null)}
          aria-label="Use the app accent"
          title="Use the app accent"
          tabIndex={isActive(null) ? 0 : -1}
          onClick={() => onChange(null)}
        >
          {isActive(null) ? <Icon name="check" size={12} /> : null}
        </button>

        {ACCENTS.map((option) => {
          const checked = isActive(option.value)
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
              onClick={() => onChange(option.value)}
            >
              {checked ? <Icon name="check" size={12} /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
