import type { ReactNode } from 'react'

export interface TooltipProps {
  /** Tooltip text. Kept short — it is supplementary, never the only label. */
  text: string
  /** Where the bubble sits relative to the trigger. */
  side?: 'top' | 'bottom'
  className?: string
  children: ReactNode
}

/**
 * CSS-only tooltip: the bubble is always in the DOM and revealed on hover or
 * keyboard focus (`:hover` / `:focus-within`). It carries `role="tooltip"` so a
 * screen reader encounters the text alongside the trigger content.
 *
 * Never put an interactive control inside — clicks pass through to the bubble's
 * owner, and the text must not be load-bearing for the primary action.
 */
export function Tooltip({ text, side = 'top', className, children }: TooltipProps) {
  return (
    <span className={['tooltip', `tooltip--${side}`, className].filter(Boolean).join(' ')}>
      <span className="tooltip-trigger">{children}</span>
      <span className="tooltip-bubble" role="tooltip">
        {text}
      </span>
    </span>
  )
}
