// lib/api/auth.ts
// Direct auth calls — do NOT go through apiClient (no auth header needed).

import { API_PREFIX } from './client';
import type { TokenPair, LoginRequest, RefreshRequest } from '@/types/auth';

export async function login(body: LoginRequest): Promise<TokenPair> {
  const res = await fetch(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({})) as Record<string, unknown>;
  if (!res.ok) {
    const msg = (data?.message || data?.error) as string | undefined;
    throw new Error(msg || `Login failed: ${res.status}`);
  }

  return data as unknown as TokenPair;
}

export async function refreshTokens(body: RefreshRequest): Promise<TokenPair> {
  const res = await fetch(`${API_PREFIX}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  return res.json() as Promise<TokenPair>;
}
