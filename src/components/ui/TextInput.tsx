import type { InputHTMLAttributes } from 'react'
import { useControlProps } from './Field'

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'value' | 'onChange' | 'id'> {
  value: string
  onValueChange: (value: string) => void
  id?: string
  className?: string
}

export function TextInput({ value, onValueChange, id, className, type = 'text', ...rest }: TextInputProps) {
  const a11y = useControlProps(id)
  return (
    <input
      type={type}
      className={['input', className].filter(Boolean).join(' ')}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      {...a11y}
      {...rest}
    />
  )
}
