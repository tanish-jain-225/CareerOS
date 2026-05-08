'use client';

import { useAuth } from '@/context/AuthContext';
import Auth from '@/components/Auth';
import LogoLoader from '@/components/LogoLoader';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <LogoLoader size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] p-4">
        <Auth />
      </div>
    );
  }

  return children;
}
