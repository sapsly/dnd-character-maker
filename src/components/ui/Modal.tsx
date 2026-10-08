import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export interface ModalProps {
  open: boolean
  /** Called for Escape, the close button, and backdrop clicks. */
  onClose: () => void
  title: string
  /** Optional supporting line under the title. */
  description?: ReactNode
  /** Main content. */
  children?: ReactNode
  /** Action row pinned to the bottom of the dialog. */
  footer?: ReactNode
  size?: 'sm' | 'md'
  className?: string
  /**
   * Extra class for the backdrop only. Lets a caller vary the scrim (e.g. a
   * blurred backdrop) without touching the dialog's own styling, and without
   * changing what existing modals render.
   */
  backdropClassName?: string
}

/**
 * Accessible dialog: rendered in a portal, Escape and backdrop close it, focus
 * moves into the dialog on open, Tab is trapped inside, and focus returns to
 * the trigger on close. Scroll behind the dialog is locked while it is open.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'sm',
  className,
  backdropClassName,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!open) return undefined

    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const dialog = dialogRef.current
    const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : []
    const preferred = dialog?.querySelector<HTMLElement>('[data-autofocus]') ?? focusable[0] ?? dialog
    preferred?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.offsetParent !== null,
      )
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = previousOverflow
      restoreRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className={['modal-backdrop', backdropClassName].filter(Boolean).join(' ')}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className={['modal', `modal--${size}`, className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
      >
        <header className="modal-head">
          <h2 className="modal-title" id={titleId}>
            {title}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={16} />
          </button>
        </header>
        {description ? (
          <p className="modal-desc" id={descId}>
            {description}
          </p>
        ) : null}
        {children ? <div className="modal-body">{children}</div> : null}
        {footer ? <div className="modal-foot">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
