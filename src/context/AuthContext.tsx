import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { SEED_USERS } from '../data/seed';

interface AuthState {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  sessionExpiredMessage: string;
  clearSessionMessage: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'aduanas_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  // Restaurar sesión desde localStorage al cargar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as User;
        // Verificar que el usuario siga activo
        const dbUser = SEED_USERS.find(u => u.id === parsed.id);
        if (dbUser && dbUser.activo) {
          setUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          if (dbUser && !dbUser.activo) {
            setSessionExpiredMessage('Su sesión ha expirado, inicie sesión nuevamente para actualizar sus permisos.');
          }
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = (email: string, password: string) => {
    const found = SEED_USERS.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'Credenciales incorrectas. Intente nuevamente.' };
    }
    if (!found.activo) {
      return { success: false, error: 'Esta cuenta se encuentra deshabilitada.' };
    }
    setUser(found);
    setSessionExpiredMessage('');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const clearSessionMessage = () => setSessionExpiredMessage('');

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      login,
      logout,
      sessionExpiredMessage,
      clearSessionMessage,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
