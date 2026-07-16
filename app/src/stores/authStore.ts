import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import type { User } from '../types';
import { authService } from '../services/auth';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  initialize: () => (() => void) | undefined;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: Parameters<typeof authService.register>[0]) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  user: null,
  loading: true,
  error: null,

  initialize: () => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        set({ firebaseUser, loading: true });
        
        // Subscribe to Firestore user document
        const unsubscribeUser = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              set({ 
                user: { uid: docSnap.id, ...docSnap.data() } as User,
                loading: false 
              });
            } else {
              set({ user: null, loading: false });
            }
          },
          (error) => {
            console.error('Error listening to user:', error);
            set({ error: error.message, loading: false });
          }
        );

        return () => unsubscribeUser();
      } else {
        set({ firebaseUser: null, user: null, loading: false });
      }
    });

    return () => unsubscribeAuth();
  },

  login: async (email, password) => {
    try {
      set({ error: null, loading: true });
      await authService.login(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ error: null, loading: true });
      await authService.signInWithGoogle();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión con Google';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  register: async (data) => {
    try {
      set({ error: null, loading: true });
      await authService.register(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({ user: null, firebaseUser: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cerrar sesión';
      set({ error: message });
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      set({ error: null });
      await authService.resetPassword(email);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al enviar email';
      set({ error: message });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
