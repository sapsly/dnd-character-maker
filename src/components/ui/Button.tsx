import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Leading icon. Pair icon-only usage with `aria-label`. */
  icon?: IconName
  /** Trailing icon, e.g. a chevron. */
  iconEnd?: IconName
  block?: boolean
  className?: string
  children?: ReactNode
}

/**
 * Class string shared by `<button>`s and by links that should look like one
 * (`<Link className={buttonClassName('secondary', 'sm')} ...>`).
 */
export function buttonClassName(
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'md',
  extra?: string,
): string {
  return ['btn', `btn--${variant}`, `btn--${size}`, extra].filter(Boolean).join(' ')
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconEnd,
  block = false,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const iconOnly = !children && Boolean(icon)
  const classes = buttonClassName(variant, size, [
    block ? 'btn--block' : '',
    iconOnly ? 'btn--icon-only' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' '))

  return (
    <button type={type} className={classes} {...rest}>
      {icon ? <Icon name={icon} size={size === 'sm' ? 14 : 16} /> : null}
      {children ? <span className="btn-label">{children}</span> : null}
      {iconEnd ? <Icon name={iconEnd} size={size === 'sm' ? 14 : 16} /> : null}
    </button>
  )
}
