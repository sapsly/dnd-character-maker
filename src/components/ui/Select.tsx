import type { SelectHTMLAttributes } from 'react'
import { useControlProps } from './Field'
import { Icon } from './Icon'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'value' | 'onChange' | 'children'> {
  value: string
  onValueChange: (value: string) => void
  options?: SelectOption[]
  /** Rendered first, disabled — used for "choose one" prompts. */
  placeholder?: string
  id?: string
  className?: string
  children?: SelectHTMLAttributes<HTMLSelectElement>['children']
}

/**
 * Native `<select>` — keyboard and screen-reader behaviour comes free, and it
 * stays usable on a phone. The chevron is a positioned icon; the element keeps
 * its own appearance otherwise.
 */
export function Select({
  value,
  onValueChange,
  options,
  placeholder,
  id,
  className,
  children,
  ...rest
}: SelectProps) {
  const a11y = useControlProps(id)
  return (
    <div className="select-wrap">
      <select
        className={['input', 'select', className].filter(Boolean).join(' ')}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        {...a11y}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options?.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      <Icon name="chevron-down" size={14} className="select-chevron" />
    </div>
  )
}
