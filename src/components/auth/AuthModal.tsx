import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import { Divider } from '../ui/Divider'
import { Field } from '../ui/Field'
import { Icon } from '../ui/Icon'
import { Modal } from '../ui/Modal'
import { TextInput } from '../ui/TextInput'
import '../../styles/auth.css'

type AuthMode = 'login' | 'signup'

/** Which of the three actions is in flight — drives their labels. */
type Pending = 'submit' | 'reset' | 'google' | null

/**
 * Deliberately loose: it only has to catch obvious typos before a network
 * round trip. Firebase re-checks both values and reports through `error`.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FieldErrors {
  email?: string
  password?: string
}

export interface AuthModalProps {
  /** Whether the dialog is on screen. */
  open: boolean
  /** Escape, the close button and a backdrop click all land here. */
  onClose: () => void
}

/**
 * Sign-in / create-account dialog, built on the shared `Modal` (portal,
 * `role="dialog"` + `aria-modal`, focus trap, Escape, backdrop close, focus
 * restore, body scroll lock) so it behaves exactly like every other dialog in
 * the app and picks up each skin's dialog styling for free.
 *
 * Two identities are pinned while it is open, because `Modal` takes them into
 * an effect that also moves focus:
 *   - `onClose` — the provider's callbacks and a parent's inline arrow both
 *     change identity every render, and a fresh one would re-run that effect
 *     (restoring focus to the header, then re-focusing the first field) on
 *     every keystroke;
 *   - `clearError` — the provider rebuilds it on each of its renders, so as a
 *     dependency of the open-reset it would wipe whatever the user had typed
 *     every time an auth error landed.
 * Both are read through refs instead.
 */
export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, signup, loginWithGoogle, resetPassword, error, clearError, loading } = useAuth()

  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [pending, setPending] = useState<Pending>(null)

  const clearErrorRef = useRef(clearError)
  clearErrorRef.current = clearError
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const close = useCallback(() => onCloseRef.current(), [])

  // A fresh start for every open: no half-typed credentials, no error carried
  // over from an attempt the user has already abandoned.
  useEffect(() => {
    if (!open) return
    setMode('login')
    setEmail('')
    setPassword('')
    setFieldErrors({})
    setNotice(null)
    setPending(null)
    clearErrorRef.current()
  }, [open])

  const setFieldError = (key: keyof FieldErrors, message?: string) => {
    setFieldErrors((prev) => {
      const next: FieldErrors = { ...prev }
      if (message) next[key] = message
      else delete next[key]
      return next
    })
  }

  // Every edit clears the provider error and this field's own message: a
  // mistake that has been corrected should stop looking like a mistake.
  const handleEmailChange = (value: string) => {
    setEmail(value)
    setNotice(null)
    setFieldError('email')
    clearError()
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setFieldError('password')
    clearError()
  }

  const switchMode = (next: AuthMode) => {
    if (next === mode || pending) return
    setMode(next)
    // A password picked for one mode is not evidence for the other, and the
    // signup rule (6 characters) does not apply to a login.
    setPassword('')
    setFieldError('password')
    setNotice(null)
    clearError()
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.'
    if (mode === 'signup') {
      if (password.length < 6) next.password = 'Use at least 6 characters.'
    } else if (password.length === 0) {
      next.password = 'Enter your password.'
    }
    return next
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (pending || loading) return
    clearError()
    setNotice(null)
    const next = validate()
    setFieldErrors(next)
    if (next.email || next.password) return

    setPending('submit')
    try {
      if (mode === 'login') await login(email.trim(), password)
      else await signup(email.trim(), password)
      close()
    } catch {
      // The provider has already stored a human-readable message in `error`,
      // which renders in the alert below the mode switch.
    } finally {
      setPending(null)
    }
  }

  const handleGoogle = async () => {
    if (pending || loading) return
    clearError()
    setNotice(null)
    setFieldErrors({})
    setPending('google')
    try {
      await loginWithGoogle()
      close()
    } catch {
      // Same as above: `error` carries the message.
    } finally {
      setPending(null)
    }
  }

  const handleReset = async () => {
    if (pending || loading) return
    clearError()
    setNotice(null)
    // Resetting needs the address but nothing else, so an empty password is
    // not allowed to block it.
    if (!EMAIL_PATTERN.test(email.trim())) {
      setFieldError('email', 'Enter a valid email address.')
      return
    }
    setFieldError('email')
    setPending('reset')
    try {
      await resetPassword(email.trim())
      setNotice(`Password reset email sent to ${email.trim()}.`)
    } catch {
      // Same as above: `error` carries the message.
    } finally {
      setPending(null)
    }
  }

  // Disable everything that talks to Firebase while a request is in flight,
  // and until the provider has finished reading the persisted session.
  const busy = pending !== null || loading

  const isLogin = mode === 'login'
  const submitLabel =
    pending === 'submit' ? (isLogin ? 'Signing in…' : 'Creating account…') : isLogin ? 'Sign in' : 'Create account'
  const googleLabel = pending === 'google' ? 'Opening Google…' : 'Continue with Google'
  const forgotLabel = pending === 'reset' ? 'Sending…' : 'Forgot password?'

  return (
    <Modal open={open} onClose={close} title={isLogin ? 'Sign in' : 'Create account'}>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-mode" role="group" aria-label="Account action">
          <button
            type="button"
            className={isLogin ? 'auth-mode-btn is-active' : 'auth-mode-btn'}
            aria-pressed={isLogin}
            onClick={() => switchMode('login')}
            disabled={busy}
          >
            Sign in
          </button>
          <button
            type="button"
            className={isLogin ? 'auth-mode-btn' : 'auth-mode-btn is-active'}
            aria-pressed={!isLogin}
            onClick={() => switchMode('signup')}
            disabled={busy}
          >
            Create account
          </button>
        </div>

        {error ? (
          <p className="auth-alert" role="alert">
            <Icon name="alert" size={16} />
            <span>{error}</span>
          </p>
        ) : null}
        {notice ? (
          <p className="auth-notice" role="status">
            <Icon name="check" size={16} />
            <span>{notice}</span>
          </p>
        ) : null}

        <Field label="Email" required error={fieldErrors.email}>
          <TextInput
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            value={email}
            onValueChange={handleEmailChange}
            data-autofocus
          />
        </Field>

        <Field
          label="Password"
          required
          error={fieldErrors.password}
          hint={isLogin || fieldErrors.password ? undefined : 'At least 6 characters.'}
        >
          <TextInput
            type="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            value={password}
            onValueChange={handlePasswordChange}
          />
        </Field>

        {isLogin ? (
          <div className="auth-row">
            <button type="button" className="link auth-forgot" onClick={handleReset} disabled={busy}>
              {forgotLabel}
            </button>
          </div>
        ) : null}

        <Button type="submit" variant="primary" block disabled={busy}>
          {submitLabel}
        </Button>

        <Divider label="or" />

        <Button type="button" variant="secondary" block onClick={handleGoogle} disabled={busy}>
          {googleLabel}
        </Button>
      </form>
    </Modal>
  )
}
