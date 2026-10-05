import type { TextareaHTMLAttributes } from 'react'
import { useControlProps } from './Field'

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'value' | 'onChange'> {
  value: string
  onValueChange: (value: string) => void
  id?: string
  className?: string
}

export function Textarea({ value, onValueChange, id, className, rows = 4, ...rest }: TextareaProps) {
  const a11y = useControlProps(id)
  return (
    <textarea
      rows={rows}
      className={['input', 'textarea', className].filter(Boolean).join(' ')}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      {...a11y}
      {...rest}
    />
  )
}
