'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated and has completed onboarding, redirect to planet page
    if (isAuthenticated && hasCompletedOnboarding) {
      router.push('/planet');
    }
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  // Show the landing page only if user hasn't completed onboarding
  if (isAuthenticated && hasCompletedOnboarding) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

