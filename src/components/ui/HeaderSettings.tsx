import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DensityToggle } from './DensityToggle'
import { AccentPicker } from './AccentPicker'
import { ThemeModePicker } from './ThemeModePicker'
import { SkinPicker } from './SkinPicker'
import { Icon } from './Icon'

/** Gap in px between the trigger's bottom edge and the popover's top edge. */
const GAP = 8

/** Nearest the popover may come to either horizontal viewport edge, in px. */
const EDGE = 8

interface PopPosition {
  /** Distance from the viewport's right edge to the popover's right edge. */
  x: number
  /** Distance from the viewport's top edge to the popover's top edge. */
  y: number
}

/**
 * Anchors the popover to its trigger in viewport coordinates.
 *
 * The horizontal target is the header's own gutter — read from the trigger's
 * `.app-header-inner` — so the panel lands flush with the brand / nav / content
 * edge (~1rem wide, tighter at the small breakpoints) instead of at an
 * arbitrary offset. It is then clamped against the viewport width so the panel
 * can never slide off either edge, whatever width it measures.
 */
function measure(trigger: HTMLElement, popWidth: number): PopPosition {
  const rect = trigger.getBoundingClientRect()
  const viewport = document.documentElement.clientWidth

  const headerInner = trigger.closest('.app-header-inner')
  const gutter = headerInner
    ? Number.parseFloat(window.getComputedStyle(headerInner).paddingRight) || 16
    : 16

  // Follow the trigger when it sits right of the gutter (never closer to the
  // edge than the chrome is), then clamp so the panel stays on screen.
  const toTrigger = viewport - rect.right
  const desired = Math.max(toTrigger, gutter)
  const widest = viewport - popWidth - EDGE

  return {
    x: Math.max(EDGE, Math.min(desired, widest)),
    y: rect.bottom + GAP,
  }
}

export interface HeaderSettingsProps {
  /** Accessible name for the trigger. */
  label?: string
}

/**
 * One quiet "Settings" button in the header that opens a popover holding every
 * appearance control: `SkinPicker` (the world), then `DensityToggle`,
 * `AccentPicker` and `ThemeModePicker` (the details that tune it), each reused
 * exactly as it appears elsewhere. The skin picker moved in here so the header
 * strip is left with the account control and this one trigger — two quiet pills
 * instead of a row of controls.
 *
 * Behaviour:
 *   - toggles on click; dismisses on outside press, Escape, and focus leaving
 *     the panel (focus-out), so it behaves like the non-modal dialog it is;
 *   - focus moves into the panel on open, and returns to the trigger on Escape
 *     (an outside press or a tab-away keeps whatever focus landed there, and
 *     only falls back to the trigger if focus ended up on `<body>`);
 *   - the panel is portalled to `<body>` and positioned with `position: fixed`
 *     from measured viewport coordinates. That sidesteps the three traps the
 *     header would otherwise set: `.app-header`'s `backdrop-filter` (which
 *     becomes the containing block for fixed descendants), the ≤1200px strip's
 *     `overflow-x: auto` clip, and that strip's right-edge fade mask.
 *
 * All of its chrome styling lives in `styles/app.css`; the four pickers keep
 * their own markup and class names untouched, so `skins.css` / `theme.css`
 * continue to paint them.
 */
export function HeaderSettings({ label = 'Settings' }: HeaderSettingsProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const popoverId = useId()

  // Written straight onto the element rather than into state, so scroll and
  // resize reposition the panel without waiting on a render.
  const reposition = () => {
    const trigger = triggerRef.current
    const pop = popoverRef.current
    if (!trigger || !pop) return
    const { x, y } = measure(trigger, pop.offsetWidth)
    pop.style.setProperty('--settings-pop-x', `${x}px`)
    pop.style.setProperty('--settings-pop-y', `${y}px`)
  }

  const close = (returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) {
      triggerRef.current?.focus()
      return
    }
    // Dismissed by an outside press or by focus leaving the panel: hand focus
    // back only when it fell on <body>, so a click that focused something else
    // is never stolen from it.
    window.setTimeout(() => {
      const active = document.activeElement
      if (active === null || active === document.body) triggerRef.current?.focus()
    }, 0)
  }

  // Open: pin the panel under the trigger, then move focus into it.
  // Layout effect, so it is placed and focused before the panel paints.
  useLayoutEffect(() => {
    if (!open) return
    reposition()
    popoverRef.current?.focus()
  }, [open])

  // While open: outside press, Escape, focus-out, plus repositioning when the
  // viewport or the header's own scroll strip moves under it.
  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (popoverRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      close(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close(true)
    }

    // Focus went anywhere else — out of the panel forwards, or out of the
    // trigger after a Shift+Tab landed there. Listening for focusin on the
    // document rather than focusout on the panel catches both, since the
    // trigger is focusable too.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (popoverRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      close(false)
    }

    const onViewportChange = () => reposition()

    window.addEventListener('scroll', onViewportChange, true)
    window.addEventListener('resize', onViewportChange)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)

    return () => {
      window.removeEventListener('scroll', onViewportChange, true)
      window.removeEventListener('resize', onViewportChange)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="header-settings-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => {
          // Closing by the trigger always hands focus back to it: browsers
          // differ on whether a click focuses a button at all (Firefox does
          // not), and the panel going inert would otherwise drop focus on
          // <body>.
          if (open) close(true)
          else setOpen(true)
        }}
      >
        <Icon name="settings" size={14} />
        <span>{label}</span>
      </button>
      {createPortal(
        <div
          ref={popoverRef}
          id={popoverId}
          className={open ? 'settings-popover is-open' : 'settings-popover'}
          role="dialog"
          aria-label="Site settings"
          tabIndex={-1}
          inert={!open}
        >
          {/* Visible row names are chrome; each picker keeps its own
              (visually hidden) group label as the accessible name, so the two
              never double up for screen readers. */}
          <div className="settings-pop-row">
            <span className="settings-pop-label" aria-hidden="true">
              Visual style
            </span>
            <SkinPicker label="Visual style" />
          </div>
          <div className="settings-pop-row">
            <span className="settings-pop-label" aria-hidden="true">
              Layout density
            </span>
            <DensityToggle label="Layout density" />
          </div>
          <div className="settings-pop-row">
            <span className="settings-pop-label" aria-hidden="true">
              Accent colour
            </span>
            <AccentPicker label="Accent colour" />
          </div>
          <div className="settings-pop-row">
            <span className="settings-pop-label" aria-hidden="true">
              Colour mode
            </span>
            <ThemeModePicker label="Colour mode" />
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
