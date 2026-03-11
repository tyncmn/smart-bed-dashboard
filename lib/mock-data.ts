import { Baseline, AlertThresholdConfig } from './types';

// ──────────────────────────────────────────────
// Baseline Table (admin config reference)
// ──────────────────────────────────────────────
export const BASELINES: Baseline[] = [
  { ageGroup: '18-29', sex: 'male', heartRateMin: 60, heartRateMax: 75, spo2Min: 95, spo2Max: 100, temperatureMin: 36.1, temperatureMax: 37.2, stressMin: 0, stressMax: 30 },
  { ageGroup: '18-29', sex: 'female', heartRateMin: 65, heartRateMax: 75, spo2Min: 95, spo2Max: 100, temperatureMin: 36.1, temperatureMax: 37.3, stressMin: 0, stressMax: 30 },
  { ageGroup: '30-39', sex: 'male', heartRateMin: 60, heartRateMax: 76, spo2Min: 95, spo2Max: 100, temperatureMin: 36.1, temperatureMax: 37.2, stressMin: 0, stressMax: 35 },
  { ageGroup: '30-39', sex: 'female', heartRateMin: 63, heartRateMax: 77, spo2Min: 95, spo2Max: 100, temperatureMin: 36.1, temperatureMax: 37.3, stressMin: 0, stressMax: 35 },
  { ageGroup: '40-49', sex: 'male', heartRateMin: 62, heartRateMax: 78, spo2Min: 94, spo2Max: 100, temperatureMin: 36.0, temperatureMax: 37.2, stressMin: 0, stressMax: 38 },
  { ageGroup: '40-49', sex: 'female', heartRateMin: 65, heartRateMax: 79, spo2Min: 94, spo2Max: 100, temperatureMin: 36.0, temperatureMax: 37.3, stressMin: 0, stressMax: 38 },
  { ageGroup: '50-59', sex: 'male', heartRateMin: 63, heartRateMax: 80, spo2Min: 94, spo2Max: 99, temperatureMin: 36.0, temperatureMax: 37.1, stressMin: 0, stressMax: 40 },
  { ageGroup: '50-59', sex: 'female', heartRateMin: 65, heartRateMax: 82, spo2Min: 94, spo2Max: 99, temperatureMin: 36.0, temperatureMax: 37.2, stressMin: 0, stressMax: 40 },
  { ageGroup: '60-69', sex: 'male', heartRateMin: 60, heartRateMax: 80, spo2Min: 93, spo2Max: 99, temperatureMin: 35.9, temperatureMax: 37.0, stressMin: 0, stressMax: 42 },
  { ageGroup: '60-69', sex: 'female', heartRateMin: 63, heartRateMax: 82, spo2Min: 93, spo2Max: 99, temperatureMin: 35.9, temperatureMax: 37.1, stressMin: 0, stressMax: 42 },
  { ageGroup: '70+', sex: 'male', heartRateMin: 58, heartRateMax: 80, spo2Min: 92, spo2Max: 98, temperatureMin: 35.8, temperatureMax: 36.9, stressMin: 0, stressMax: 45 },
  { ageGroup: '70+', sex: 'female', heartRateMin: 62, heartRateMax: 82, spo2Min: 92, spo2Max: 98, temperatureMin: 35.8, temperatureMax: 37.0, stressMin: 0, stressMax: 45 },
];

export function getBaseline(ageGroup: string, sex: string): Baseline {
  return BASELINES.find(b => b.ageGroup === ageGroup && b.sex === sex) || BASELINES[1];
}

// ──────────────────────────────────────────────
// Alert Threshold Config (admin reference)
// ──────────────────────────────────────────────
export const ALERT_THRESHOLDS: AlertThresholdConfig[] = [
  { metric: 'Heart Rate', mildThreshold: 5, highThreshold: 10, criticalThreshold: 20, unit: '%', description: 'Percentage deviation from age/sex baseline midpoint' },
  { metric: 'SpO₂', mildThreshold: 5, highThreshold: 10, criticalThreshold: 20, unit: '%', description: 'Percentage deviation from age/sex baseline midpoint' },
  { metric: 'Skin Temperature', mildThreshold: 5, highThreshold: 10, criticalThreshold: 20, unit: '%', description: 'Percentage deviation from baseline' },
  { metric: 'Stress Level', mildThreshold: 5, highThreshold: 10, criticalThreshold: 20, unit: '%', description: 'Percentage deviation from age/sex baseline' },
];
