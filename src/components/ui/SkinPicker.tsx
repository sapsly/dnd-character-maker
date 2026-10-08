import { useId, useLayoutEffect, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useControlProps } from './Field'
import {
  SKINS,
  applySkin,
  getSkin,
  setSkin,
} from '../../lib/skin'
import type { Skin } from '../../lib/skin'

export interface SkinPickerProps {
  /** Controlled selection. Omit it and the picker owns the stored preference. */
  value?: Skin
  /** Fires once the new skin is applied to `<html>` and persisted. */
  onChange?: (skin: Skin) => void
  /** Accessible name for the group. */
  label?: string
  /** Renders the group label instead of leaving it for screen readers only. */
  showLabel?: boolean
  className?: string
}

/** Keys that move focus across the row (a toolbar-style roving stop). */
const MOVE_KEYS = new Set(['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'])

/**
 * Segmented row for visual style — the direct sibling of `ThemeModePicker`,
 * sharing its `.theme-picker` / `.theme-swatches` shell and its keyboard
 * model: native buttons with `aria-pressed`, one tab stop (roving
 * `tabIndex`), arrow keys / Home / End to walk the row, Enter and Space to
 * pick.
 *
 * Unlike `AccentPicker`, skins have no colour to preview yet (the skin
 * stylesheets are not written), so the segments are label-only — the same
 * treatment `ThemeModePicker` uses for light / dark / system. The selected
 * segment uses the shared `.theme-segment.is-active` treatment (accent fill
 * with the accent's contrast colour) so it stays legible in both colour modes
 * and under all eight accents without a single hardcoded value in this file.
 *
 * Safe to render before anything has been read: state starts from whatever is
 * already applied (or the stored choice, or the default) and a layout effect
 * writes `data-skin` before the browser paints, so a controlled caller cannot
 * flash the wrong skin either.
 */
export function SkinPicker({
  value,
  onChange,
  label = 'Visual style',
  showLabel = false,
  className,
}: SkinPickerProps) {
  const groupId = useId()
  const a11y = useControlProps()
  const [stored, setStored] = useState<Skin>(() => getSkin())
  const current = value ?? stored

  // Keeps `<html data-skin>` truthful when a parent drives `value`.
  // Layout effect, so the attribute is set before paint — no flash.
  useLayoutEffect(() => {
    applySkin(current)
  }, [current])

  const select = (next: Skin) => {
    setSkin(next)
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
{SKINS.map((option) => {
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
                data-skin={option.value}
              >
                <span className="skin-thumb" aria-hidden="true" />
                {option.label}
              </button>
            )
          })}
      </div>
    </div>
  )
}