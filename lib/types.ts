// ============================================================
// Domain Types — Smart Bed MVP Dashboard
// ============================================================

export type RiskLevel = "normal" | "mild" | "high" | "critical";

// ──────────────────────────────────────────────
// Alert
// ──────────────────────────────────────────────
export interface Alert {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  metric: string;
  currentValue: number;
  expectedMin: number;
  expectedMax: number;
  deviation: number;
  riskPercentage: number;
  riskLevel: RiskLevel;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

// ──────────────────────────────────────────────
// Sleep
// ──────────────────────────────────────────────
export interface SleepSummary {
  averageQualityScore: number;
  averageDurationHours: number;
  disturbedNights: number;
  totalNights: number;
  nightly: NightlySummary[];
}

export interface NightlySummary {
  date: string;
  qualityScore: number;
  durationHours: number;
  deepSleepPct: number;
  remSleepPct: number;
  interruptions: number;
  disturbanceDetected: boolean;
}

// ──────────────────────────────────────────────
// Current Status (API response)
// ──────────────────────────────────────────────
export interface CurrentStatusResponse {
  unreadAlertCount: number;
  alerts: Alert[];
  sleepSummary: SleepSummary | null;
}

// ──────────────────────────────────────────────
// Baseline (admin config)
// ──────────────────────────────────────────────
export type AgeGroup = "18-29" | "30-39" | "40-49" | "50-59" | "60-69" | "70+";
export type Sex = "male" | "female" | "other";

export interface Baseline {
  ageGroup: AgeGroup;
  sex: Sex;
  heartRateMin: number;
  heartRateMax: number;
  spo2Min: number;
  spo2Max: number;
  temperatureMin: number;
  temperatureMax: number;
  stressMin: number;
  stressMax: number;
}

export interface AlertThresholdConfig {
  metric: string;
  mildThreshold: number;
  highThreshold: number;
  criticalThreshold: number;
  unit: string;
  description: string;
}
