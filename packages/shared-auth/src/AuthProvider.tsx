import { useEffect } from 'react';
import { useAuthStore } from './authStore';
import { subscribeEvent } from '@mfd/shared-utils';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const refreshSession = useAuthStore((s) => s.refreshSession);
  const logout = useAuthStore((s) => s.logout);
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (!session?.tokens.expiresAt) return;

    const msUntilExpiry = session.tokens.expiresAt - Date.now();
    const refreshIn = Math.max(msUntilExpiry - 60_000, 0);

    const timer = setTimeout(() => {
      refreshSession();
    }, refreshIn);

    return () => clearTimeout(timer);
  }, [session, refreshSession]);

  useEffect(() => {
    return subscribeEvent('auth:session-expired', () => {
      logout();
    });
  }, [logout]);

  return <>{children}</>;
}
