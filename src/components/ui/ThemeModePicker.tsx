import { useId, useLayoutEffect, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useControlProps } from './Field'
import {
  THEME_MODES,
  applyThemeMode,
  getThemeMode,
  setThemeMode,
} from '../../lib/theme'
import type { ThemeMode } from '../../lib/theme'

export interface ThemeModePickerProps {
  /** Controlled selection. Omit it and the picker owns the stored preference. */
  value?: ThemeMode
  /** Fires once the new mode is applied to `<html>` and persisted. */
  onChange?: (mode: ThemeMode) => void
  /** Accessible name for the group. */
  label?: string
  /** Renders the group label instead of leaving it for screen readers only. */
  showLabel?: boolean
  className?: string
}

/** Keys that move focus across the row (a toolbar-style roving stop). */
const MOVE_KEYS = new Set(['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'])

/**
 * Segmented row for light / dark / system — the direct sibling of
 * `AccentPicker`, sharing its `.theme-picker` / `.theme-swatches` shell and
 * its keyboard model: native buttons with `aria-pressed`, one tab stop
 * (roving `tabIndex`), arrow keys / Home / End to walk the row, Enter and
 * Space to pick.
 *
 * Where `AccentPicker` fills each chip with a colour to preview, the three
 * modes have no colour to preview, so the segments borrow the density
 * toggle's treatment instead — accent fill plus that accent's contrast
 * colour when active. That is why the selected mode stays legible in both
 * colour modes and under all eight accents without a single hardcoded value
 * in this file.
 *
 * Safe to render before anything has been read: state starts from whatever is
 * already applied (or the stored choice, or the default) and a layout effect
 * writes `data-theme` before the browser paints, so a controlled caller
 * cannot flash the wrong palette either.
 */
export function ThemeModePicker({
  value,
  onChange,
  label = 'Colour mode',
  showLabel = false,
  className,
}: ThemeModePickerProps) {
  const groupId = useId()
  const a11y = useControlProps()
  const [stored, setStored] = useState<ThemeMode>(() => getThemeMode())
  const current = value ?? stored

  // Keeps `<html data-theme>` truthful when a parent drives `value`.
  // Layout effect, so the attribute is set before paint — no flash.
  useLayoutEffect(() => {
    applyThemeMode(current)
  }, [current])

  const select = (next: ThemeMode) => {
    setThemeMode(next)
    if (value === undefined) setStored(next)
    onChange?.(next)
  }

  // Roving focus: the group is one tab stop, arrows walk the row with wrap.
  const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!MOVE_KEYS.has(event.key)) return
    const segments = Array.from(event.currentTarget.querySelectorAll('button'))
    const from = segments.indexOf(document.activeElement as HTMLButtonElement)
    if (from === -1) return
    event.preventDefault()
    let to = from
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      to = (from + 1) % segments.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      to = (from - 1 + segments.length) % segments.length
    } else if (event.key === 'Home') {
      to = 0
    } else if (event.key === 'End') {
      to = segments.length - 1
    }
    segments[to]?.focus()
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
        {THEME_MODES.map((option) => {
          const checked = option.value === current
          return (
            <button
              key={option.value}
              type="button"
              className={['theme-segment', checked ? 'is-active' : '']
                .filter(Boolean)
                .join(' ')}
              aria-pressed={checked}
              aria-label={option.label}
              title={option.label}
              tabIndex={checked ? 0 : -1}
              onClick={() => select(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
