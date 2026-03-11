// ── Vitals DTOs ──────────────────────────────────────────────

export type VitalsMetricKey =
  | 'heart_rate'
  | 'spo2'
  | 'stress_level'
  | 'sleep_duration'
  | 'skin_temperature'
  | 'movement_score'
  | 'respiration'
  | 'blood_pressure_systolic'
  | 'blood_pressure_diastolic';

export interface VitalPoint {
  value: number;
  recorded_at: string;
}

export interface LatestVitals {
  user_id: string;
  fetched_at: string;
  /** Only keys that have data will be present */
  metrics: Partial<Record<VitalsMetricKey, VitalPoint>>;
}
