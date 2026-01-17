'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  scheduleSubmitted: boolean;
  questionnaireCompleted: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // For demo purposes, we'll use a mock user that's logged in and completed everything
  // In production, this would check actual authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking localStorage for authenticated user
    const storedUser = localStorage.getItem('uoftwo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // For demo: Create a mock authenticated user with completed onboarding
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: 'demo@uoft.ca',
        scheduleSubmitted: true,
        questionnaireCompleted: true,
      };
      setUser(mockUser);
      localStorage.setItem('uoftwo_user', JSON.stringify(mockUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call your API
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email,
      scheduleSubmitted: true,
      questionnaireCompleted: true,
    };
    setUser(mockUser);
    localStorage.setItem('uoftwo_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('uoftwo_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('uoftwo_user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = user !== null;
  const hasCompletedOnboarding = 
    user?.scheduleSubmitted === true && 
    user?.questionnaireCompleted === true;

  // Don't render children until we've checked authentication
  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        hasCompletedOnboarding,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

