'use client';

import { useAuth } from '@/context/AuthContext';
import Auth from '@/components/auth/Auth';
import LogoLoader from '@/components/ui/LogoLoader';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-1 items-center justify-center">
        <LogoLoader size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[80vh] flex-1 flex-col items-center justify-center p-4">
        <Auth />
      </div>
    );
  }

  return children;
}
