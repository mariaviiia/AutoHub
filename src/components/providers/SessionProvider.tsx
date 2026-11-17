'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    // Check session on mount to restore user if already authenticated
    checkSession();
  }, [checkSession]);

  return <>{children}</>;
}
