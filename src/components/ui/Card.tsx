import type { ReactNode } from 'react'

export interface CardProps {
  /** Optional display-font heading rendered in the card header. */
  title?: ReactNode
  /** Right-aligned header content, typically small actions. */
  actions?: ReactNode
  /** Optional footer strip below the body. */
  footer?: ReactNode
  /** Removes body padding — for lists that draw their own rows. */
  flush?: boolean
  className?: string
  children?: ReactNode
}

export function Card({ title, actions, footer, flush = false, className, children }: CardProps) {
  const hasHead = Boolean(title || actions)
  return (
    <section className={['card', className].filter(Boolean).join(' ')}>
      {hasHead ? (
        <header className="card-head">
          {title ? <h2 className="card-title">{title}</h2> : <span />}
          {actions ? <div className="card-actions">{actions}</div> : null}
        </header>
      ) : null}
      <div className={flush ? 'card-body card-body--flush' : 'card-body'}>{children}</div>
      {footer ? <footer className="card-foot">{footer}</footer> : null}
    </section>
  )
}
