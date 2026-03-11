import { Alert, CurrentStatusResponse, NightlySummary, RiskLevel, SleepSummary } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://46.101.184.103:8080';
const API_PREFIX = `${API_BASE}/api/v1`;

import { getAccessToken } from './auth';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = getAccessToken() || process.env.NEXT_PUBLIC_API_TOKEN;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
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
  const res = await fetch(
    `${API_PREFIX}/users/${encodeURIComponent(userId)}/current-status`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`Failed to fetch status: ${res.status}`);
  const data = await res.json();
  return {
    unreadAlertCount: Number(data.unread_alert_count ?? 0),
    alerts: Array.isArray(data.alerts) ? data.alerts.map(mapAlert) : [],
    sleepSummary: data.sleep_summary ? mapSleepSummary(data.sleep_summary) : null,
  };
}

export async function fetchSleepSummary(userId: string, days: 7 | 30 = 7): Promise<SleepSummary> {
  const res = await fetch(
    `${API_PREFIX}/users/${encodeURIComponent(userId)}/sleep-summary?days=${days}`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`Failed to fetch sleep summary: ${res.status}`);
  const data = await res.json();
  return mapSleepSummary(data);
}

export async function acknowledgeAlertApi(alertId: string): Promise<void> {
  const res = await fetch(
    `${API_PREFIX}/alerts/${encodeURIComponent(alertId)}/acknowledge`,
    { method: 'PATCH', headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`Failed to acknowledge alert: ${res.status}`);
}
