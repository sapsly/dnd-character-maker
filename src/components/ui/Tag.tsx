import type { ReactNode } from 'react'

export type TagTone = 'neutral' | 'muted' | 'accent' | 'success' | 'warning' | 'danger'

export interface TagProps {
  tone?: TagTone
  /** Renders as a circular pip before the text — used for level badges. */
  solid?: boolean
  className?: string
  title?: string
  children: ReactNode
}

export function Tag({ tone = 'neutral', solid = false, className, title, children }: TagProps) {
  const classes = ['tag', `tag--${tone}`, solid ? 'tag--solid' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes} title={title}>
      {children}
    </span>
  )
}
