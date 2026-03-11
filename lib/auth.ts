// lib/auth.ts
// Handles local storage access for authentication tokens and session data.

const KEYS = {
  ACCESS:  'smartbed_access_token',
  REFRESH: 'smartbed_refresh_token',
  USER_ID: 'smartbed_user_id',
  ROLE:    'smartbed_role',
} as const;

export function setTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.ACCESS, accessToken);
    localStorage.setItem(KEYS.REFRESH, refreshToken);
  }
}

export function setSession(userId: string, role: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.USER_ID, userId);
    localStorage.setItem(KEYS.ROLE, role);
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem(KEYS.ACCESS);
  return null;
}

export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem(KEYS.REFRESH);
  return null;
}

export function getUserId(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem(KEYS.USER_ID);
  return null;
}

export function getRole(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem(KEYS.ROLE);
  return null;
}

export function removeTokens() {
  if (typeof window !== 'undefined') {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
