import { useId, useLayoutEffect, useState } from 'react'
import { useControlProps } from './Field'
import { DENSITIES, applyDensity, getDensity, setDensity } from '../../lib/density'
import type { Density } from '../../lib/density'

export interface DensityToggleProps {
  /** Controlled selection. Omit it and the toggle owns the stored preference. */
  value?: Density
  /** Fires once the new density is applied to `<html>` and persisted. */
  onChange?: (density: Density) => void
  /** Accessible name for the group. */
  label?: string
  /** Renders the group label instead of leaving it for screen readers only. */
  showLabel?: boolean
  className?: string
}

/**
 * Compact / Comfortable / Spacious selector.
 *
 * Native radios inside `role="radiogroup"` rather than toggle buttons: one tab
 * stop, arrow keys move between the three options, and each option announces as
 * "Compact, radio button, 1 of 3". The inputs carry the `.visually-hidden`
 * class and the segment in front of them carries the visible treatment — the
 * focus ring is forwarded onto that segment with `:has()`, so keyboard focus
 * stays visible (styles live in `styles/density.css`).
 *
 * Safe to render before anything has been read: state starts from whatever is
 * already applied (or the stored choice, or the default) and a layout effect
 * writes the attribute before the browser paints.
 */
export function DensityToggle({
  value,
  onChange,
  label = 'Density',
  showLabel = false,
  className,
}: DensityToggleProps) {
  const groupId = useId()
  const a11y = useControlProps()
  const [stored, setStored] = useState<Density>(() => getDensity())
  const current = value ?? stored

  // Keeps `<html data-density>` truthful when a parent drives `value`.
  // Layout effect, so the attribute is set before paint — no flash.
  useLayoutEffect(() => {
    applyDensity(current)
  }, [current])

  const select = (next: Density) => {
    setDensity(next)
    if (value === undefined) setStored(next)
    onChange?.(next)
  }

  return (
    <div className={['density-toggle', className].filter(Boolean).join(' ')}>
      <span
        id={`${groupId}-label`}
        className={showLabel ? 'density-toggle-label' : 'visually-hidden'}
      >
        {label}
      </span>
      <div
        className="density-segments"
        role="radiogroup"
        aria-labelledby={`${groupId}-label`}
        aria-describedby={a11y['aria-describedby']}
        aria-invalid={a11y['aria-invalid']}
      >
        {DENSITIES.map((option) => {
          const checked = option.value === current
          return (
            <label
              key={option.value}
              className={['density-segment', checked ? 'is-active' : '']
                .filter(Boolean)
                .join(' ')}
            >
              {/* The surrounding <Field>'s label binds to the option the user
                  is already on, so clicking that label never changes the pick. */}
              <input
                type="radio"
                className="visually-hidden"
                name={groupId}
                value={option.value}
                checked={checked}
                onChange={() => select(option.value)}
                id={checked ? a11y.id : undefined}
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </div>
  )
}
