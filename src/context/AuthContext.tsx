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
  users: User[];
  registrarUsuario: (nombre: string, email: string, password: string, rut: string, role?: UserRole) => { success: boolean; error?: string };
  actualizarUsuario: (id: string, data: Partial<User>) => void;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'aduanas_auth';
const USERS_STORAGE_KEY = 'aduanas_users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  const [user, setUser] = useState<User | null>(null);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  // Persistir la lista de usuarios si cambia
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Restaurar sesión desde localStorage al cargar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as User;
        // Verificar que el usuario siga activo
        const dbUser = users.find(u => u.id === parsed.id);
        if (dbUser && dbUser.activo) {
          // Mantener sincronizado con los cambios (por ejemplo si cambia de rol)
          setUser(dbUser);
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
  }, [users]);

  const login = (email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'Credenciales incorrectas. Intente nuevamente.' };
    }
    if (!found.activo) {
      return { success: false, error: 'Esta cuenta se encuentra deshabilitada.' };
    }
    const nowStr = 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedUser = { ...found, ultimoAcceso: nowStr };
    setUsers(prev => prev.map(u => u.id === found.id ? updatedUser : u));
    setUser(updatedUser);
    setSessionExpiredMessage('');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const clearSessionMessage = () => setSessionExpiredMessage('');

  const registrarUsuario = (nombre: string, email: string, password: string, rut: string, role: UserRole = 'viajero') => {
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'El correo electrónico ya se encuentra registrado.' };
    }
    if (users.some(u => u.rut === rut)) {
      return { success: false, error: 'El RUN ya se encuentra registrado.' };
    }

    const nuevo: User = {
      id: `USR-${Math.floor(Math.random() * 900) + 100}`,
      nombre,
      email,
      password,
      rut,
      role,
      activo: true,
      ultimoAcceso: 'Nunca',
    };

    setUsers(prev => [...prev, nuevo]);
    return { success: true };
  };

  const actualizarUsuario = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      login,
      logout,
      sessionExpiredMessage,
      clearSessionMessage,
      users,
      registrarUsuario,
      actualizarUsuario,
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
