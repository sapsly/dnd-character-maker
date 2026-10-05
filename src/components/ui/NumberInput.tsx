import { useControlProps } from './Field'
import { Icon } from './Icon'

export interface NumberInputProps {
  value: number
  onValueChange: (value: number) => void
  id?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  /** Accessible name for the decrement/increment buttons when no Field label exists. */
  decrementLabel?: string
  incrementLabel?: string
  className?: string
}

/**
 * Numeric input with explicit -/+ steppers. The text field itself is
 * `type="number"` so keyboard and mobile numeric keyboards behave natively;
 * the browser's own spinners are hidden because the steppers replace them.
 */
export function NumberInput({
  value,
  onValueChange,
  id,
  min,
  max,
  step = 1,
  disabled = false,
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  className,
}: NumberInputProps) {
  const a11y = useControlProps(id)
  const lower = min ?? -Infinity
  const upper = max ?? Infinity

  const commit = (raw: string) => {
    const parsed = Number.parseInt(raw, 10)
    if (Number.isNaN(parsed)) return
    onValueChange(clamp(parsed, lower, upper))
  }

  const nudge = (delta: number) => onValueChange(clamp(value + delta, lower, upper))

  return (
    <div className={['number-input', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="step-btn"
        onClick={() => nudge(-step)}
        disabled={disabled || value <= lower}
        aria-label={decrementLabel}
      >
        <Icon name="minus" size={12} />
      </button>
      <input
        type="number"
        className="input number-input-field"
        inputMode="numeric"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => commit(event.target.value)}
        {...a11y}
      />
      <button
        type="button"
        className="step-btn"
        onClick={() => nudge(step)}
        disabled={disabled || value >= upper}
        aria-label={incrementLabel}
      >
        <Icon name="plus" size={12} />
      </button>
    </div>
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
