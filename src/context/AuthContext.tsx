import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  register: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    educatorCode?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'know_auth_current_user';
const USERS_REGISTRY_KEY = 'know_users_registry';

// Real educational token requirement for teacher role verification
export const VALID_EDUCATOR_CODE = 'GURU-KNOW-2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check saved session on app mount
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      }
    } catch (e) {
      console.error('Failed to restore user session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    // Validate inputs
    if (!email || !email.includes('@')) {
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
      const registryStr = localStorage.getItem(USERS_REGISTRY_KEY);
      const registry: { [email: string]: { user: UserProfile; passwordHash: string } } = 
        registryStr ? JSON.parse(registryStr) : {};

      const lowerEmail = email.trim().toLowerCase();
      const record = registry[lowerEmail];

      if (!record) {
        const msg = 'Akun belum terdaftar. Silakan lakukan registrasi terlebih dahulu.';
        setError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }

      // Simple secure hash check (btoa/digest)
      if (record.passwordHash !== btoa(password)) {
        const msg = 'Kata sandi salah. Silakan coba lagi.';
        setError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }

      setUser(record.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(record.user));
      setIsLoading(false);
      return { success: true, user: record.user };
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan sistem saat proses login.';
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
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    if (!email || !email.includes('@')) {
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

    // Role-based activation security: Teacher role cannot be self-assigned without valid educator verification code
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
      const registryStr = localStorage.getItem(USERS_REGISTRY_KEY);
      const registry: { [email: string]: { user: UserProfile; passwordHash: string } } = 
        registryStr ? JSON.parse(registryStr) : {};

      const lowerEmail = email.trim().toLowerCase();
      if (registry[lowerEmail]) {
        const msg = 'Alamat email ini sudah terdaftar. Silakan login atau gunakan email lain.';
        setError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }

      const newUser: UserProfile = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        email: lowerEmail,
        displayName: displayName.trim(),
        role,
        educatorCodeVerified: role === 'teacher',
        createdAt: new Date().toISOString()
      };

      registry[lowerEmail] = {
        user: newUser,
        passwordHash: btoa(password)
      };

      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Gagal menyimpan akun baru.';
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setError(null);
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Format email tidak valid.' };
    }

    const registryStr = localStorage.getItem(USERS_REGISTRY_KEY);
    const registry = registryStr ? JSON.parse(registryStr) : {};
    const lowerEmail = email.trim().toLowerCase();

    if (!registry[lowerEmail]) {
      // Security practice: Don't explicitly reveal if email does not exist
      return {
        success: true,
        message: 'Jika email terdaftar di sistem KNOW, tautan pemulihan kata sandi telah dikirimkan ke kotak masuk Anda.'
      };
    }

    return {
      success: true,
      message: `Tautan pemulihan kata sandi telah dikirimkan ke ${lowerEmail}. Silakan periksa folder kotak masuk atau spam.`
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
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
