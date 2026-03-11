// ── Auth DTOs ────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  user_id: string;
  role: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}
