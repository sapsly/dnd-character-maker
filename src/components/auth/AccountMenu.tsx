import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../ui/Icon'
import { AuthModal } from './AuthModal'
import '../../styles/auth.css'

/**
 * The account end of the header strip.
 *
 * Signed out: one quiet accent pill that opens the sign-in dialog. Signed in:
 * a chip carrying the account's name (or address) next to a Sign out action.
 * While the provider is still reading the persisted session the slot holds a
 * pulsing dot, so the strip neither jumps nor flashes "Sign in" at somebody
 * who is already signed in.
 *
 * The dialog is rendered from here and portals itself to `<body>`, which is
 * what keeps it clear of the header's `backdrop-filter` containing block and
 * the ≤1200px strip's scroll clip — the same reason `HeaderSettings` portals.
 */
export function AccountMenu() {
  const { user, loading, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const accountRef = useRef<HTMLDivElement | null>(null)
  // True while a dialog opened from this component is (or has just been) on
  // screen. It tells a sign-in made *in that dialog* — which must hand focus
  // to the account chip, because its own trigger has just unmounted — apart
  // from the session merely resolving on page load, which must not steal focus.
  const dialogWasOpen = useRef(false)

  useEffect(() => {
    if (open) dialogWasOpen.current = true
  }, [open])

  // The dialog restores focus to the control it opened from, but that control
  // is gone the moment the user is signed in and focus would fall on <body>.
  // Park it on the account group instead, so keyboard users stay in the header.
  useEffect(() => {
    if (!user || open || !dialogWasOpen.current) return
    dialogWasOpen.current = false
    accountRef.current?.focus()
  }, [user, open])

  const handleSignOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      await logout()
    } catch {
      // The provider has already stored the message in `error`; this strip has
      // no surface for it, and the next dialog open clears it.
    } finally {
      setSigningOut(false)
    }
  }

  const accountLabel = user ? user.displayName?.trim() || user.email || 'Account' : ''

  return (
    <>
      {loading ? (
        <span className="auth-account-pending">
          <span className="auth-account-dot" aria-hidden="true" />
          <span className="visually-hidden">Checking session</span>
        </span>
      ) : user ? (
        <div
          ref={accountRef}
          className="auth-account"
          role="group"
          tabIndex={-1}
          aria-label={`Signed in as ${accountLabel}`}
        >
          <span className="auth-account-chip" title={user.email || undefined}>
            <Icon name="user" size={14} className="auth-account-icon" />
            <span className="auth-account-name">{accountLabel}</span>
          </span>
          {/* Label stays "Sign out" while the request runs: the strip is
              width-starved and a reflowing control shoves the settings trigger
              out from under the pointer. The disabled state carries the wait. */}
          <button
            type="button"
            className="auth-signout-btn"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="auth-signin-btn"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <Icon name="user" size={14} />
          <span>Sign in</span>
        </button>
      )}
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
