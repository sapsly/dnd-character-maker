import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  type AuthError,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleError = (err: AuthError) => {
    const messages: Record<string, string> = {
      'auth/user-not-found': 'No account found with that email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with that email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
    };
    setError(messages[err.code] ?? err.message);
  };

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    clearError();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      handleError(err as AuthError);
      throw err;
    }
  };

  const signup = async (email: string, password: string) => {
    clearError();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      handleError(err as AuthError);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    clearError();
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      handleError(err as AuthError);
      throw err;
    }
  };

  const logout = async () => {
    clearError();
    try {
      await signOut(auth);
    } catch (err) {
      handleError(err as AuthError);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    clearError();
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      handleError(err as AuthError);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, resetPassword, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}