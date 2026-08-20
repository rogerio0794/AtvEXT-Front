import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, getToken, setToken, removeToken } from '../lib/api';

export interface AuthUser {
  id: string;
  name: string;
  apelido?: string;
  email: string;
  role: 'student' | 'teacher';
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  streak: number;
  totalQuizzes: number;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

interface RegisterData {
  name: string;
  apelido?: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

interface ApiUser {
  id: number;
  name: string;
  apelido?: string | null;
  email: string;
  role: string;
  avatar?: string | null;
  level?: number;
  xp?: number;
  coins?: number;
  streak?: number;
}

function mapUser(u: ApiUser): AuthUser {
  const level = u.level ?? 1;
  return {
    id: String(u.id),
    name: u.name,
    apelido: u.apelido ?? undefined,
    email: u.email,
    role: u.role === 'teacher' ? 'teacher' : 'student',
    avatar: u.avatar || (u.role === 'teacher' ? '👨‍🏫' : '🎓'),
    level,
    xp: u.xp ?? 0,
    xpToNextLevel: level * 250,
    coins: u.coins ?? 0,
    streak: u.streak ?? 0,
    totalQuizzes: 0,
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaura sessão pelo token ao abrir o app
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    api.get<{ user: ApiUser }>('/api/auth/me')
      .then(({ user: u }) => setUser(mapUser(u)))
      .catch(() => removeToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    try {
      const data = await api.post<{ user: ApiUser; token: string }>('/api/auth/login', { email, password });
      setToken(data.token);
      setUser(mapUser(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  async function register(data: RegisterData) {
    try {
      const res = await api.post<{ user: ApiUser; token: string }>('/api/auth/register', {
        name: data.name,
        apelido: data.apelido || undefined,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      setToken(res.token);
      setUser(mapUser(res.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  function logout() {
    setUser(null);
    removeToken();
  }

  function updateUser(data: Partial<AuthUser>) {
    if (!user) return;
    setUser({ ...user, ...data });
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
