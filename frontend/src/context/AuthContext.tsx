'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from 'jwt-decode'; // 👈 Import JwtPayload
import { User } from '../types/user.types';

// 1. Define what is inside YOUR token
interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // 2. Decode with strict typing
          const decoded = jwtDecode<CustomJwtPayload>(token);
          const currentTime = Date.now() / 1000;
          
          // 3. decoded.exp is now safely recognized as number | undefined
          if (decoded.exp && decoded.exp < currentTime) {
            logout();
          } else {
            setUser({
              id: decoded.id,
              role: decoded.role,
              // In a real app, you'd fetch the full profile here.
              // For now, we restore the minimal session.
              name: "Commander", 
              email: "User", 
            });
          }
        }
      } catch (error) {
        // If token is malformed, jwtDecode throws an error
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};