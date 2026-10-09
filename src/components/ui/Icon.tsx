/**
 * Single shared icon component. Inline SVG only — no icon library.
 *
 * Every icon is decorative by default (`aria-hidden`); icon-only buttons carry
 * their own accessible name. Keep the set small and add shapes only when a new
 * action needs one.
 */

export type IconName =
  | 'plus'
  | 'minus'
  | 'upload'
  | 'download'
  | 'trash'
  | 'star'
  | 'star-filled'
  | 'search'
  | 'settings'
  | 'chevron-up'
  | 'chevron-down'
  | 'close'
  | 'check'
  | 'alert'
  | 'arrow-right'
  | 'book'
  | 'user'
  | 'edit'

export interface IconProps {
  name: IconName
  size?: number
  className?: string
}

/** Path data keyed by name. All shapes live on a 24x24 grid. */
const PATHS: Record<IconName, string> = {
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  upload: 'M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2',
  download: 'M12 4v12m0 0l-4.5-4.5M12 16l4.5-4.5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2',
  trash: 'M4 7h16M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-8 0v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7M10 11v5m4-5v5',
  star: 'M12 4.5l2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 16.49l-4.7 2.47.9-5.23-3.8-3.7 5.25-.77z',
  'star-filled': 'M12 4.5l2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 16.49l-4.7 2.47.9-5.23-3.8-3.7 5.25-.77z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm10 17l-5-5',
  // Gear: the 3px centre ring plus the eight-tooth body, as one path so the
  // single-<path> renderer strokes both halves. Reads clearly at 14px.
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  'chevron-up': 'M6 14.5L12 9l6 5.5',
  'chevron-down': 'M6 9.5L12 15l6-5.5',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  alert: 'M12 8v5m0 3h.01M10.3 4.2L2.9 17a1.9 1.9 0 0 0 1.7 2.9h14.8a1.9 1.9 0 0 0 1.7-2.9L13.7 4.2a1.9 1.9 0 0 0-3.4 0z',
  'arrow-right': 'M5 12h14m0 0l-5.5-5.5M19 12l-5.5 5.5',
  book: 'M5 4.5h9a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H5zM19 6.5V20',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0',
  edit: 'M4 20h4L19.5 8.5a2.12 2.12 0 0 0-3-3L5 17v3z',
}

export function Icon({ name, size = 16, className }: IconProps) {
  const filled = name === 'star-filled'
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
