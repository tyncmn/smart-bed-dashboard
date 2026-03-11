import { Alert, CurrentStatusResponse, NightlySummary, RiskLevel, SleepSummary } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://46.101.184.103:8080';
const API_PREFIX = `${API_BASE}/api/v1`;

import { getAccessToken, getRefreshToken, removeTokens, setTokens } from './auth';

function getHeaders(accessToken?: string): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = accessToken ?? getAccessToken() ?? process.env.NEXT_PUBLIC_API_TOKEN;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${API_PREFIX}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      const nextAccess = String(data.access_token ?? '');
      const nextRefresh = String(data.refresh_token ?? refreshToken);
      if (!nextAccess) return null;

      setTokens(nextAccess, nextRefresh);
      return nextAccess;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function apiFetch(path: string, init: RequestInit = {}, skipAuthRetry = false): Promise<Response> {
  const first = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init.headers ?? {}),
    },
  });

  if (first.status !== 401 || skipAuthRetry) return first;

  const nextAccess = await refreshAccessToken();
  if (!nextAccess) {
    removeTokens();
    return first;
  }

  return fetch(`${API_PREFIX}${path}`, {
    ...init,
    headers: {
      ...getHeaders(nextAccess),
      ...(init.headers ?? {}),
    },
  });
}

// ──── Mappers (snake_case API → camelCase frontend) ────

function mapAlert(raw: Record<string, unknown>): Alert {
  return {
    id: String(raw.id ?? ''),
    userId: String(raw.user_id ?? ''),
    type: String(raw.type ?? ''),
    title: String(raw.title ?? ''),
    description: String(raw.description ?? ''),
    metric: String(raw.metric ?? ''),
    currentValue: Number(raw.current_value ?? 0),
    expectedMin: Number(raw.expected_min ?? 0),
    expectedMax: Number(raw.expected_max ?? 0),
    deviation: Number(raw.deviation ?? 0),
    riskPercentage: Number(raw.risk_percentage ?? 0),
    riskLevel: (raw.risk_level as RiskLevel) ?? 'normal',
    isAcknowledged: Boolean(raw.is_acknowledged),
    acknowledgedBy: raw.acknowledged_by ? String(raw.acknowledged_by) : undefined,
    acknowledgedAt: raw.acknowledged_at ? String(raw.acknowledged_at) : undefined,
    createdAt: String(raw.created_at ?? new Date().toISOString()),
  };
}

function mapNightly(raw: Record<string, unknown>): NightlySummary {
  return {
    date: String(raw.date ?? ''),
    qualityScore: Number(raw.quality_score ?? 0),
    durationHours: Number(raw.duration_hours ?? 0),
    deepSleepPct: Number(raw.deep_sleep_pct ?? 0),
    remSleepPct: Number(raw.rem_sleep_pct ?? 0),
    interruptions: Number(raw.interruptions ?? 0),
    disturbanceDetected: Boolean(raw.disturbance_detected),
  };
}

function mapSleepSummary(raw: Record<string, unknown>): SleepSummary {
  return {
    averageQualityScore: Number(raw.average_quality_score ?? 0),
    averageDurationHours: Number(raw.average_duration_hours ?? 0),
    disturbedNights: Number(raw.disturbed_nights ?? 0),
    totalNights: Number(raw.total_nights ?? 0),
    nightly: Array.isArray(raw.nightly) ? raw.nightly.map(mapNightly) : [],
  };
}

// ──── API Calls ────

export async function fetchCurrentStatus(userId: string): Promise<CurrentStatusResponse> {
  const res = await apiFetch(`/users/${encodeURIComponent(userId)}/current-status`);
  if (!res.ok) throw new Error(`Failed to fetch status: ${res.status}`);
  const data = await res.json();
  return {
    unreadAlertCount: Number(data.unread_alert_count ?? 0),
    alerts: Array.isArray(data.alerts) ? data.alerts.map(mapAlert) : [],
    sleepSummary: data.sleep_summary ? mapSleepSummary(data.sleep_summary) : null,
  };
}

export async function fetchSleepSummary(userId: string, days: 7 | 30 = 7): Promise<SleepSummary> {
  const res = await apiFetch(`/users/${encodeURIComponent(userId)}/sleep-summary?days=${days}`);
  if (!res.ok) throw new Error(`Failed to fetch sleep summary: ${res.status}`);
  const data = await res.json();
  return mapSleepSummary(data);
}

export async function acknowledgeAlertApi(alertId: string): Promise<void> {
  const res = await apiFetch(`/alerts/${encodeURIComponent(alertId)}/acknowledge`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error(`Failed to acknowledge alert: ${res.status}`);
}

export type VitalsMetricKey =
  | 'heart_rate'
  | 'spo2'
  | 'stress_level'
  | 'skin_temperature'
  | 'movement_score'
  | 'sleep_duration';

export interface VitalsMetricPoint {
  value: number;
  recordedAt: string;
}

export interface LatestVitalsResponse {
  userId: string;
  fetchedAt: string;
  metrics: Record<VitalsMetricKey, VitalsMetricPoint>;
}

export async function fetchLatestVitals(userId: string): Promise<LatestVitalsResponse> {
  const res = await apiFetch(`/vitals/latest?user_id=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Failed to fetch latest vitals: ${res.status}`);

  const data = await res.json();
  const rawMetrics = (data.metrics ?? {}) as Record<string, { value?: unknown; recorded_at?: unknown }>;

  const mapMetric = (key: VitalsMetricKey): VitalsMetricPoint => ({
    value: Number(rawMetrics[key]?.value ?? 0),
    recordedAt: String(rawMetrics[key]?.recorded_at ?? data.fetched_at ?? new Date().toISOString()),
  });

  return {
    userId: String(data.user_id ?? userId),
    fetchedAt: String(data.fetched_at ?? new Date().toISOString()),
    metrics: {
      heart_rate: mapMetric('heart_rate'),
      spo2: mapMetric('spo2'),
      stress_level: mapMetric('stress_level'),
      skin_temperature: mapMetric('skin_temperature'),
      movement_score: mapMetric('movement_score'),
      sleep_duration: mapMetric('sleep_duration'),
    },
  };
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  role: string;
  email: string;
  isActive: boolean;
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Login failed: ${res.status}`);
  }
  return {
    accessToken: String(data.access_token ?? ''),
    refreshToken: String(data.refresh_token ?? ''),
    expiresAt: String(data.expires_at ?? ''),
    userId: String(data.user_id ?? data.user?.id ?? ''),
    role: String(data.role ?? data.user?.role ?? 'operator'),
    email: String(data.user?.email ?? email),
    isActive: Boolean(data.user?.is_active ?? true),
  };
}
