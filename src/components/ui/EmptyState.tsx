import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'

export interface EmptyStateProps {
  title: string
  /** One plain sentence explaining what belongs here. */
  description?: ReactNode
  /** Primary call to action, usually a Button. */
  action?: ReactNode
  icon?: IconName
  /** `warning` for storage/import failures, `neutral` for a genuinely empty list. */
  tone?: 'neutral' | 'warning'
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  icon = 'book',
  tone = 'neutral',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={['empty-state', `empty-state--${tone}`, className].filter(Boolean).join(' ')}
    >
      <span className="empty-icon" aria-hidden="true">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="empty-title">{title}</h3>
      {description ? <p className="empty-desc">{description}</p> : null}
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  )
}
