// lib/api/client.ts
// Base fetch wrapper: attaches Authorization header, checks expiry,
// and auto-refreshes the token on 401.

import { getAccessToken, getRefreshToken, setTokens, removeTokens } from '@/lib/auth';
import type { TokenPair } from '@/types/auth';

// Relative path — requests are proxied by Next.js rewrites to the real backend.
// This avoids mixed-content errors on Vercel (HTTPS → HTTP).
export const API_PREFIX = '/api/v1';

// ── JWT expiry check ──────────────────────────────────────────

function decodeJWTPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64url → base64 → decode
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJWTPayload(token);
  if (!payload) return false;
  const exp = payload.exp as number | undefined;
  if (!exp) return false;
  return Date.now() / 1000 >= exp - 30; // 30-second buffer
}

// ── Singleton refresh promise (prevents parallel refresh races) ─

let refreshPromise: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_PREFIX}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as Partial<TokenPair>;
    const access = data.access_token ?? '';
    const refresh = data.refresh_token ?? refreshToken;
    if (!access) return null;

    setTokens(access, refresh);
    return access;
  } catch {
    return null;
  }
}

function scheduleRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function redirectToLogin(): never {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
  throw new Error('Session expired. Redirecting to login.');
}

// ── Core fetch wrapper ────────────────────────────────────────

export async function apiClient(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  let token = getAccessToken();

  // Proactively refresh if the access token is expired before even sending
  if (token && isTokenExpired(token)) {
    token = await scheduleRefresh();
    if (!token) {
      removeTokens();
      redirectToLogin();
    }
  }

  const buildHeaders = (t: string | null): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...(init.headers ?? {}),
  });

  const res = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    headers: buildHeaders(token),
  });

  // Reactive refresh on 401 (handles server-side token invalidation)
  if (res.status === 401) {
    const newToken = await scheduleRefresh();
    if (!newToken) {
      removeTokens();
      redirectToLogin();
    }
    return fetch(`${API_PREFIX}${path}`, {
      ...init,
      headers: buildHeaders(newToken),
    });
  }

  return res;
}
