import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Icon } from './Icon'

export interface ExpandableTextProps {
  /** The prose itself — a string, or inline markup such as `<strong>`. */
  children: ReactNode
  /** Lines kept on screen before the block is compressed. */
  lines?: number
  /** Element for the text: `p` for prose, `span` inside an inline row. */
  as?: 'p' | 'span' | 'div'
  /**
   * The surface's own class (`compendium-prose`, `sheet-feature-desc`, …) so
   * the block keeps the face, colour and margins it already had.
   */
  className?: string
  /** Extra styles merged onto the text element. */
  style?: CSSProperties
  /** Control copy while compressed. */
  showMoreLabel?: string
  /** Control copy while open. */
  showLessLabel?: string
}

/**
 * Long running text, compressed by default.
 *
 * The text is clamped to `lines` lines with `-webkit-line-clamp` and the last
 * visible line is faded out, so a wall of rules reads as a card rather than a
 * scroll. A single **Show more / Show less** button sits underneath and is
 * rendered only once the element reports it really is clipped — measured as
 * `scrollHeight` against `clientHeight` while clamped — so a one-line blurb
 * stays a one-line blurb with nothing to click.
 *
 * The control is a plain `<button>` with `aria-expanded` and `aria-controls`,
 * so it takes keyboard focus and announces its state. Measurement runs in a
 * layout effect (before paint, no flash of full text) and again whenever the
 * element, its box or the window is resized, plus once after web fonts settle,
 * because a font swap re-flows the lines without changing either box. It is
 * only re-read while closed: an open block fills its own box, so re-reading it
 * open would drop the very control needed to close it again.
 *
 * Motion is a single chevron flip; the `prefers-reduced-motion` guard in
 * `global.css` collapses it, and the rule at the foot of the CSS block repeats
 * that locally.
 */
export function ExpandableText({
  children,
  lines = 5,
  as = 'p',
  className,
  style,
  showMoreLabel = 'Show more',
  showLessLabel = 'Show less',
}: ExpandableTextProps) {
  const generatedId = useId()
  const textId = `${generatedId}-text`
  const textRef = useRef<HTMLElement | null>(null)
  const clippedRef = useRef(false)
  const [clipped, setClipped] = useState(false)
  const [open, setOpen] = useState(false)

  // The tag is picked at runtime, so the callback form keeps the ref typed as
  // HTMLElement instead of guessing one element name. Stable identity keeps
  // React from detaching and re-attaching it on every render.
  const setTextRef = useCallback((node: HTMLElement | null) => {
    textRef.current = node
  }, [])

  const measure = useCallback(() => {
    if (open) return
    const node = textRef.current
    if (!node) return
    const next = node.scrollHeight - node.clientHeight > 1
    if (next === clippedRef.current) return
    clippedRef.current = next
    setClipped(next)
  }, [open])

  // Runs before paint, so the first frame is already clamped.
  useLayoutEffect(() => {
    measure()
  }, [measure, children, lines])

  // Width arrives from the parent (grid tracks, flex columns, the modal), and a
  // font swap after load re-flows the lines without resizing either box, so the
  // text, its box, the window and the font set are all watched.
  useLayoutEffect(() => {
    const node = textRef.current
    if (!node) return
    const box = node.parentElement
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measure())
    if (observer) {
      observer.observe(node)
      if (box) observer.observe(box)
    }
    window.addEventListener('resize', measure)
    let live = true
    document.fonts?.ready.then(() => {
      if (live) measure()
    })
    return () => {
      live = false
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  const Text = as

  return (
    <>
      <Text
        ref={setTextRef}
        id={textId}
        className={[
          'expandable-text',
          clipped && !open ? 'is-clipped' : '',
          open ? 'is-open' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          ...style,
          // Passed as a variable rather than the property itself so the clamp
          // stays a stylesheet value: the print styles drop it, and an inline
          // -webkit-line-clamp could not be overridden from a stylesheet at all.
          '--expandable-lines': lines,
        } as CSSProperties}
      >
        {children}
      </Text>
      {clipped ? (
        <button
          type="button"
          className="expandable-toggle"
          aria-expanded={open}
          aria-controls={textId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="expandable-toggle-label">
            {open ? showLessLabel : showMoreLabel}
          </span>
          <Icon name="chevron-down" size={14} className="expandable-toggle-chevron" />
        </button>
      ) : null}
    </>
  )
}
