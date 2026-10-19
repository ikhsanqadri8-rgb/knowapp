import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import type { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  loginWithGoogle: (roleForNewUser?: UserRole, educatorCode?: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  register: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    educatorCode?: string
  ) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'know_auth_current_user';
export const VALID_EDUCATOR_CODE = 'GURU-KNOW-2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync auth state with Firebase Authentication and Cloud Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentFbUser) => {
      setFirebaseUser(currentFbUser);

      if (currentFbUser) {
        try {
          const userDocRef = doc(db, 'users', currentFbUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const profileData = userSnap.data() as UserProfile;
            setUser(profileData);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profileData));
          } else {
            // Profile document does not exist yet (e.g. new Google sign-in)
            // Restore from local cache if matches or create minimal profile
            const cached = localStorage.getItem(AUTH_STORAGE_KEY);
            if (cached) {
              try {
                const parsed = JSON.parse(cached);
                if (parsed.id === currentFbUser.uid) {
                  setUser(parsed);
                  await setDoc(userDocRef, parsed);
                }
              } catch (_) {}
            }
          }
        } catch (err: any) {
          console.error('Failed to sync user profile from Firestore:', err);
          // Keep cached profile if available
          const cached = localStorage.getItem(AUTH_STORAGE_KEY);
          if (cached) {
            try {
              setUser(JSON.parse(cached));
            } catch (_) {}
          }
        }
      } else {
        // Logged out
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const formatAuthError = (err: any): string => {
    const code = err.code || '';
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return 'Email atau kata sandi tidak cocok. Silakan periksa kembali.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'Alamat email ini sudah terdaftar. Silakan login atau gunakan opsi Masuk dengan Google.';
    }
    if (code === 'auth/invalid-email') {
      return 'Format alamat email tidak valid.';
    }
    if (code === 'auth/weak-password') {
      return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.';
    }
    if (code === 'auth/operation-not-allowed') {
      return 'Metode email & password belum aktif di Firebase Console. Silakan gunakan tombol "Masuk dengan Google" yang sudah siap digunakan!';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Jendela login Google ditutup sebelum autentikasi selesai.';
    }
    if (code === 'auth/popup-blocked') {
      return 'Jendela popup Google diblokir peramban Anda. Mohon izinkan popup untuk situs ini.';
    }
    return err.message || 'Terjadi kesalahan sistem autentikasi.';
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    setIsLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const msg = 'Format email tidak valid.';
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
    if (!password || password.length < 6) {
      const msg = 'Kata sandi minimal 6 karakter.';
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const uid = cred.user.uid;

      // Fetch user profile document from Firestore
      const userDocRef = doc(db, 'users', uid);
      let profile: UserProfile;
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          profile = userDoc.data() as UserProfile;
        } else {
          // Fallback if user registered via auth without firestore doc
          profile = {
            id: uid,
            email: cleanEmail,
            displayName: cred.user.displayName || cleanEmail.split('@')[0],
            role: 'student',
            educatorCodeVerified: false,
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, profile);
        }
      } catch (fsErr) {
        handleFirestoreError(fsErr, OperationType.GET, `users/${uid}`);
      }

      setUser(profile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
      setIsLoading(false);
      return { success: true, user: profile };
    } catch (err: any) {
      const msg = formatAuthError(err);
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
  };

  const loginWithGoogle = async (
    roleForNewUser: UserRole = 'student',
    educatorCode?: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    setIsLoading(true);
    setError(null);

    // If teacher role intended for new registration, verify token
    if (roleForNewUser === 'teacher') {
      const cleanCode = educatorCode?.trim().toUpperCase();
      if (!cleanCode || cleanCode !== VALID_EDUCATOR_CODE) {
        const msg = 'Kode verifikasi Guru tidak valid. Gunakan kode resmi institusi.';
        setError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      const uid = cred.user.uid;

      const userDocRef = doc(db, 'users', uid);
      let profile: UserProfile;

      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        profile = userDoc.data() as UserProfile;
      } else {
        // First-time user profile creation in Firestore
        profile = {
          id: uid,
          email: cred.user.email || '',
          displayName: cred.user.displayName || 'Pengguna KNOW',
          role: roleForNewUser,
          educatorCodeVerified: roleForNewUser === 'teacher',
          avatarUrl: cred.user.photoURL || undefined,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profile);
      }

      setUser(profile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
      setIsLoading(false);
      return { success: true, user: profile };
    } catch (err: any) {
      const msg = formatAuthError(err);
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    educatorCode?: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    setIsLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const msg = 'Format alamat email tidak valid.';
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
    if (!displayName || displayName.trim().length < 2) {
      const msg = 'Nama lengkap minimal 2 karakter.';
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
    if (!password || password.length < 6) {
      const msg = 'Kata sandi minimal 6 karakter.';
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }

    // Role-based activation security
    if (role === 'teacher') {
      const cleanCode = educatorCode?.trim().toUpperCase();
      if (!cleanCode || cleanCode !== VALID_EDUCATOR_CODE) {
        const msg = 'Kode aktivasi Guru tidak valid. Gunakan kode aktivasi resmi institusi atau kontak admin sekolah.';
        setError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const uid = cred.user.uid;

      const newUser: UserProfile = {
        id: uid,
        email: cleanEmail,
        displayName: displayName.trim(),
        role,
        educatorCodeVerified: role === 'teacher',
        createdAt: new Date().toISOString()
      };

      // Persist user profile directly into Cloud Firestore
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, newUser);

      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (err: any) {
      const msg = formatAuthError(err);
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error signing out:', e);
    } finally {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setError(null);
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Format email tidak valid.' };
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: `Tautan pemulihan kata sandi telah dikirimkan ke ${cleanEmail}. Silakan periksa folder kotak masuk atau spam.`
      };
    } catch (err: any) {
      // Security practice: Don't leak user existence
      return {
        success: true,
        message: 'Jika email terdaftar di sistem KNOW, tautan pemulihan kata sandi telah dikirimkan ke kotak masuk Anda.'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        error,
        login,
        loginWithGoogle,
        register,
        logout,
        requestPasswordReset,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
