'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/auth';
import { setTokens, setSession, removeTokens, getAccessToken, getUserId, getRole } from '@/lib/auth';
import type { LoginRequest } from '@/types/auth';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true);
      setError(null);
      try {
        const data = await login(credentials);
        setTokens(data.access_token, data.refresh_token);
        setSession(data.user_id, data.role);
        router.push(`/dashboard/${data.user_id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const handleLogout = useCallback(() => {
    removeTokens();
    router.push('/login');
  }, [router]);

  return {
    login: handleLogin,
    logout: handleLogout,
    loading,
    error,
    isAuthenticated: !!getAccessToken(),
    userId: getUserId(),
    role: getRole(),
  };
}
