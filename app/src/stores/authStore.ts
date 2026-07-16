import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
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
        const isSuperAdmin = (firebaseUser.email || '').toLowerCase() === 'bbmintellegent@gmail.com';
        
        // Subscribe to Firestore user document
        const unsubscribeUser = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (isSuperAdmin && data.role !== 'ADMIN') {
                try {
                  await updateDoc(doc(db, 'users', firebaseUser.uid), {
                    role: 'ADMIN',
                    is_approved: true,
                    is_active: true
                  });
                } catch (e) {
                  console.error('Error auto-upgrading super admin:', e);
                }
              }
              set({ 
                user: { 
                  uid: docSnap.id, 
                  ...data, 
                  role: isSuperAdmin ? 'ADMIN' : (data as any).role,
                  is_approved: isSuperAdmin ? true : (data as any).is_approved,
                  is_active: isSuperAdmin ? true : (data as any).is_active
                } as unknown as User,
                loading: false 
              });
            } else {
              if (isSuperAdmin) {
                const names = (firebaseUser.displayName || 'Super Admin').split(' ');
                const adminDoc: any = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || 'bbmintellegent@gmail.com',
                  role: 'ADMIN',
                  status: 'ACTIVE',
                  is_active: true,
                  is_approved: true,
                  profile: {
                    first_name: names[0] || 'Super',
                    last_name: names.slice(1).join(' ') || 'Admin',
                    phone: firebaseUser.phoneNumber || null,
                    cedula: 'ADMIN-001',
                    municipality: 'CATIA_LA_MAR',
                    digital_literacy_level: 'ADVANCED',
                    is_affected: false,
                    camp_id: null
                  },
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  last_login: new Date().toISOString()
                };
                try {
                  await setDoc(doc(db, 'users', firebaseUser.uid), adminDoc);
                  set({ user: adminDoc as unknown as User, loading: false });
                  return;
                } catch (e) {
                  console.error('Error auto-creating super admin doc:', e);
                }
              }
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
    } catch (error: any) {
      console.error('authStore loginWithGoogle error:', error);
      const message = error?.code === 'auth/unauthorized-domain'
        ? 'Dominio no autorizado en Firebase Console'
        : (error instanceof Error ? error.message : 'Error al iniciar sesión con Google');
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
