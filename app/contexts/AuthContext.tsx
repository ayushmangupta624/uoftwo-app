'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check actual Supabase authentication state
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Fetch user profile to get additional data
          const response = await fetch('/api/profile');
          if (response.ok) {
            const data = await response.json();
            const profile = data.profile;
            
            if (profile) {
              setUser({
                id: authUser.id,
                name: profile.fname || '',
                email: authUser.email || '',
                scheduleSubmitted: !!profile.schedule,
                questionnaireCompleted: !!(profile.hobbies && profile.hobbies.length > 0),
              });
            } else {
              setUser({
                id: authUser.id,
                name: '',
                email: authUser.email || '',
                scheduleSubmitted: false,
                questionnaireCompleted: false,
              });
            }
          } else {
            setUser({
              id: authUser.id,
              name: '',
              email: authUser.email || '',
              scheduleSubmitted: false,
              questionnaireCompleted: false,
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
    
    // Listen for auth state changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // User logged in, fetch profile
        try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const data = await response.json();
            const profile = data.profile;
            
            if (profile) {
              setUser({
                id: session.user.id,
                name: profile.fname || '',
                email: session.user.email || '',
                scheduleSubmitted: !!profile.schedule,
                questionnaireCompleted: !!(profile.hobbies && profile.hobbies.length > 0),
              });
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    // This is handled by Supabase auth directly in the login form
    // The auth state listener will update the user state automatically
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
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

