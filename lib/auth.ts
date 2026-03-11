// lib/auth.ts
// Handles local storage access for authentication tokens.

export function setTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('smartbed_access_token', accessToken);
    localStorage.setItem('smartbed_refresh_token', refreshToken);
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('smartbed_access_token');
  }
  return null;
}

export function removeTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('smartbed_access_token');
    localStorage.removeItem('smartbed_refresh_token');
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
