import { createContext, useContext, useId } from 'react'
import type { ReactNode } from 'react'

interface FieldContextValue {
  controlId: string
  describedBy: string | undefined
  invalid: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

/**
 * Reads the surrounding `<Field>` so inputs pick up a bound id, `aria-describedby`
 * and `aria-invalid` without prop drilling. Returns `null` outside a Field, in
 * which case the control falls back to its own `id` prop.
 */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext)
}

/** Aria props a control should spread onto its DOM element. */
export interface ControlA11y {
  id: string | undefined
  'aria-describedby': string | undefined
  'aria-invalid': true | undefined
}

/**
 * Binds a control to its surrounding `<Field>`: the field's id, its hint/error
 * ids, and `aria-invalid` when the field reports an error. An explicit id wins.
 */
export function useControlProps(explicitId?: string): ControlA11y {
  const ctx = useFieldContext()
  const invalid = ctx?.invalid ?? false
  return {
    id: explicitId ?? ctx?.controlId,
    'aria-describedby': ctx?.describedBy,
    'aria-invalid': invalid ? true : undefined,
  }
}

export interface FieldProps {
  label: ReactNode
  /** Explicit id for the control; generated when omitted. */
  htmlFor?: string
  /** Helper text shown under the control. */
  hint?: ReactNode
  /** Error message; sets `aria-invalid` on the control. */
  error?: ReactNode
  required?: boolean
  /** Lays label and control side by side on wide screens. */
  inline?: boolean
  className?: string
  children: ReactNode
}

/**
 * Label + control + optional hint/error. The control is a child element; inputs
 * read the context to bind themselves automatically.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  inline = false,
  className,
  children,
}: FieldProps) {
  const generatedId = useId()
  const controlId = htmlFor ?? generatedId
  const hintId = hint ? `${controlId}-hint` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <FieldContext.Provider value={{ controlId, describedBy, invalid: Boolean(error) }}>
      <div
        className={['field', inline ? 'field--inline' : '', className].filter(Boolean).join(' ')}
      >
        <label className="field-label" htmlFor={controlId}>
          {label}
          {required ? (
            <span className="field-required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        <div className="field-control">{children}</div>
        {hint ? (
          <p className="field-hint" id={hintId}>
            {hint}
          </p>
        ) : null}
        {error ? (
          <p className="field-error" id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  )
}
