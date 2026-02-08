import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { loginAdmin } from '../api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('bookwise_token');
  });

  useEffect(() => {
    const token = localStorage.getItem('bookwise_token');
    setIsAuthenticated(!!token);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { token } = await loginAdmin(username, password);
    localStorage.setItem('bookwise_token', token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('bookwise_token');
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
