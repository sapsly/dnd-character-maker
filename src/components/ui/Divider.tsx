export interface DividerProps {
  /** Optional centred label, e.g. "or". */
  label?: string
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  if (label) {
    return (
      <div className={['divider', 'divider--labelled', className].filter(Boolean).join(' ')}>
        <span className="divider-line" aria-hidden="true" />
        <span className="divider-label">{label}</span>
        <span className="divider-line" aria-hidden="true" />
      </div>
    )
  }
  return (
    <div className={['divider', className].filter(Boolean).join(' ')} role="separator">
      <span className="divider-line" aria-hidden="true" />
    </div>
  )
}
