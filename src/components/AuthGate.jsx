'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LogoLoader from './LogoLoader';

/**
 * Higher-Order Component/Wrapper to protect routes.
 * Standardizes Auth redirection and loading states across the OS.
 */
export default function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to dashboard/auth
    if (!loading && !user) {
      // In CareerOS, the root page '/' handles its own Auth state
      // but other subpages should redirect back if session is lost.
      const currentPath = window.location.pathname;
      if (currentPath !== '/') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <LogoLoader size="lg" />
      </div>
    );
  }

  // Only render children if user is authenticated
  return user ? children : null;
}
