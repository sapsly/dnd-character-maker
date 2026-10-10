import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AuthModal } from '../components/auth/AuthModal';

interface AuthDialogContextValue {
  /** Opens the shared sign-in / create-account dialog. */
  openSignIn: () => void;
  /** True while that dialog is on screen. */
  signInOpen: boolean;
}

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);

/**
 * One sign-in dialog for the whole app.
 *
 * The header's AccountMenu owns the same dialog it always did, just through
 * this shared handle: any screen (the campaigns pages, a future paywall, …)
 * can ask for sign-in without rendering its own copy, and the dialog still
 * mounts inside the tree, so `Modal`'s focus restore lands on whichever
 * trigger opened it.
 *
 * `signInOpen` is exposed alongside the trigger because focus hand-off needs
 * to know a dialog *was* open when the session lands — see AccountMenu.
 */
export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSignIn = useCallback(() => setOpen(true), []);
  const closeSignIn = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openSignIn, signInOpen: open }), [openSignIn, open]);

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
      <AuthModal open={open} onClose={closeSignIn} />
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog(): AuthDialogContextValue {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error('useAuthDialog must be used within an AuthDialogProvider');
  }
  return context;
}
