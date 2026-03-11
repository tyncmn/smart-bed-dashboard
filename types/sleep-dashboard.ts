// ── Sleep Dashboard DTOs ──────────────────────────────────────

export type SleepStage = 'deep' | 'rem' | 'light' | 'awake';
export type RiskLevel = 'normal' | 'mild' | 'high' | 'critical';
export type AlertType =
  | 'abnormal_heart_rate'
  | 'low_oxygen'
  | 'elevated_temperature'
  | 'disturbed_sleep'
  | 'high_risk_health_event'
  | 'critical_health_event';
export type SleepState = 'deep' | 'light' | 'rem' | 'awake' | 'disturbed' | 'unknown';
export type OverallStatus = 'ok' | 'warning' | 'critical';
export type TrendDirection = 'improving' | 'declining' | 'stable';
export type AlertSeverity = 'info' | 'warning' | 'critical';

// ── Period ────────────────────────────────────────────────────

export interface SleepDashboardPeriod {
  days: number;
  from: string;
  to: string;
}

// ── Summary ───────────────────────────────────────────────────

export interface SleepDashboardSummary {
  user_id: string;
  avg_quality_score: number;
  avg_duration_mins: number;
  total_nights: number;
  disturbed_nights: number;
  period_days: number;
}

// ── Timeline ──────────────────────────────────────────────────

export interface SleepTimelineEntry {
  date: string;             // "YYYY-MM-DD"
  duration_mins: number;
  quality_score: number;
  is_disturbed: boolean;
  disturbance_count: number;
  avg_heart_rate: number | null;
  avg_spo2: number | null;
  avg_movement: number | null;
}

// ── Stage Distribution ────────────────────────────────────────

export interface StageDistributionEntry {
  stage: SleepStage;
  percentage: number;
  avg_minutes: number;
}

// ── Health Alerts ─────────────────────────────────────────────

export interface HealthAlert {
  id: string;
  user_id: string;
  alert_type: AlertType;
  risk_level: RiskLevel;
  message: string;
  metric_type: string | null;
  metric_value: number | null;
  is_acknowledged: boolean;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
}

// ── AI Analysis ───────────────────────────────────────────────

export interface AIAlertItem {
  severity: AlertSeverity;
  title: string;
  detail: string;
}

export interface MedicineSuggestion {
  name: string;
  purpose: string;
  note: string;
}

export interface AIAnalysis {
  sleep_state: SleepState;
  overall_status: OverallStatus;
  analysis: string;
  health_alerts: AIAlertItem[];
  emergency_actions: string[];
  medicine_suggestions: MedicineSuggestion[];
  lifestyle_suggestions: string[];
  disclaimer: string;
}

// ── Predictions ───────────────────────────────────────────────

export interface Predictions {
  next_night_quality: number;
  trend_direction: TrendDirection;
  predicted_risk_level: RiskLevel;
  quality_forecast: number[];   // 7 elements; index 0 = tomorrow
  health_risks: string[];
}

// ── Full Dashboard Response ───────────────────────────────────

export interface SleepDashboard {
  user_id: string;
  generated_at: string;
  period: SleepDashboardPeriod;
  summary: SleepDashboardSummary | null;
  timeline: SleepTimelineEntry[];
  stage_distribution: StageDistributionEntry[];
  health_alerts: HealthAlert[];
  ai_analysis: AIAnalysis | null;
  predictions: Predictions;
}
