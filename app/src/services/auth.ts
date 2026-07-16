import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User, UserRole, Municipality } from '../types';

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  cedula: string;
  phone?: string;
  municipality: Municipality;
  role?: UserRole;
}

export const authService = {
  async register(data: RegisterData): Promise<User> {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    const firebaseUser = userCredential.user;
    
    // Update display name
    await updateProfile(firebaseUser, {
      displayName: `${data.first_name} ${data.last_name}`
    });
    
    // Create user document in Firestore
    const userDoc: User = {
      uid: firebaseUser.uid,
      email: data.email,
      role: data.role || 'STUDENT',
      status: 'ACTIVE',
      profile: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || null,
        cedula: data.cedula,
        municipality: data.municipality,
        digital_literacy_level: 'NONE',
        is_affected: false,
        camp_id: null
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: null
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);
    
    return userDoc;
  },

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      const names = (firebaseUser.displayName || '').split(' ');
      const userDocData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        role: 'STUDENT',
        status: 'ACTIVE',
        profile: {
          first_name: names[0] || '',
          last_name: names.slice(1).join(' ') || '',
          phone: firebaseUser.phoneNumber,
          cedula: '',
          municipality: 'CATIA_LA_MAR',
          digital_literacy_level: 'NONE',
          is_affected: false,
          camp_id: null
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);
      return userDocData;
    }

    const userData = userDoc.data() as User;

    await updateDoc(doc(db, 'users', firebaseUser.uid), {
      last_login: new Date().toISOString()
    });

    return userData;
  },

  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    const firebaseUser = userCredential.user;
    
    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }
    
    const userData = userDoc.data() as User;
    
    // Update last login
    await updateDoc(doc(db, 'users', firebaseUser.uid), {
      last_login: new Date().toISOString()
    });
    
    return userData;
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async resetPassword(email: string): Promise<void> {
    const actionCodeSettings = {
      url: `${import.meta.env.VITE_APP_URL || 'https://laguiairaresilente--laguairaresilente.us-east4.hosted.app'}/login`,
      handleCodeInApp: true
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  },

  async getCurrentUser(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userDoc.data() as User;
  },

  async updateProfile(uid: string, updates: Partial<User['profile']>): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      profile: updates,
      updated_at: new Date().toISOString()
    });
  },

  getFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  }
};
