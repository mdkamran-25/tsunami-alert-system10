'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

// ──────────────────────────────────────────
// Types – all JWT-based, no Firebase
// ──────────────────────────────────────────
export interface JWTUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

type AuthContextType = {
  user: JWTUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: () => {},
});

// ──────────────────────────────────────────
// Provider – reads JWT data from localStorage
// ──────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JWTUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      const raw = localStorage.getItem('user');
      if (token && raw) {
        setUser(JSON.parse(raw));
      }
    } catch {
      // corrupt data – clear
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/auth/signin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
