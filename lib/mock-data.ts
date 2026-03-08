import {
  Patient, VitalWithRisk, VitalTimePoint, Alert, Baseline, Device,
  Protocol, SleepSession, NightlySummary, CurrentStatus, AlertThresholdConfig,
  NotificationRule, RiskLevel, VitalRiskDetail
} from './types';

// ──────────────────────────────────────────────
// Risk Calculation Helpers
// ──────────────────────────────────────────────
export function calculateRiskDetail(
  currentValue: number,
  normalMin: number,
  normalMax: number,
  unit: string,
  label: string
): VitalRiskDetail {
  const normalMidpoint = (normalMin + normalMax) / 2;
  const deviation = currentValue - normalMidpoint;
  const riskPercentage = Math.abs(deviation / normalMidpoint) * 100;

  let riskLevel: RiskLevel = 'normal';
  let reason = '';

  if (currentValue < normalMin || currentValue > normalMax) {
    if (riskPercentage > 20) {
      riskLevel = 'critical';
      reason = currentValue > normalMax
        ? `${label} is critically elevated at ${currentValue} ${unit}, ${riskPercentage.toFixed(1)}% above baseline.`
        : `${label} is critically low at ${currentValue} ${unit}, ${riskPercentage.toFixed(1)}% below baseline.`;
    } else if (riskPercentage > 10) {
      riskLevel = 'high';
      reason = currentValue > normalMax
        ? `${label} is significantly elevated: ${deviation.toFixed(1)} ${unit} above normal range.`
        : `${label} is significantly below range: ${Math.abs(deviation).toFixed(1)} ${unit} under baseline.`;
    } else if (riskPercentage > 5) {
      riskLevel = 'mild';
      reason = `${label} is outside normal range (${riskPercentage.toFixed(1)}% deviation from baseline midpoint).`;
    } else {
      riskLevel = 'normal';
    }
  }

  return { currentValue, normalMin, normalMax, deviation, riskPercentage, riskLevel, unit, label, reason };
}

function pickWorstRisk(levels: RiskLevel[]): RiskLevel {
  if (levels.includes('critical')) return 'critical';
  if (levels.includes('high')) return 'high';
  if (levels.includes('mild')) return 'mild';
  return 'normal';
}

// ──────────────────────────────────────────────
// Baseline Table
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
// Mock Patients
// ──────────────────────────────────────────────
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p-001',
    name: 'Sarah Chen',
    dateOfBirth: '1987-04-15',
    age: 38,
    ageGroup: '30-39',
    sex: 'female',
    weight: 63,
    height: 165,
    conditions: ['Type 2 Diabetes', 'Mild Hypertension'],
    medications: ['Metformin 500mg', 'Lisinopril 5mg'],
    roomNumber: '4B-201',
    admittedAt: '2026-03-01T10:30:00Z',
    primaryDoctor: 'Dr. James Whitmore',
    emergencyContacts: [
      { name: 'David Chen', relationship: 'Spouse', phone: '+1-555-0142', email: 'dchen@email.com', priority: 1 },
      { name: 'Lisa Chen', relationship: 'Daughter', phone: '+1-555-0198', priority: 2 },
    ],
  },
  {
    id: 'p-002',
    name: 'Robert Okonkwo',
    dateOfBirth: '1952-11-22',
    age: 73,
    ageGroup: '70+',
    sex: 'male',
    weight: 85,
    height: 180,
    conditions: ['COPD', 'Atrial Fibrillation', 'Chronic Kidney Disease Stage 2'],
    medications: ['Warfarin 5mg', 'Furosemide 40mg', 'Salbutamol inhaler'],
    roomNumber: '2A-108',
    admittedAt: '2026-02-20T08:15:00Z',
    primaryDoctor: 'Dr. Priya Nair',
    emergencyContacts: [
      { name: 'Amara Okonkwo', relationship: 'Daughter', phone: '+1-555-0271', priority: 1 },
    ],
  },
];

// ──────────────────────────────────────────────
// Vital Generator
// ──────────────────────────────────────────────
function rand(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min;
  return decimals > 0 ? parseFloat(val.toFixed(decimals)) : Math.round(val);
}

export function generateVitalsForPatient(patient: Patient, scenario: 'normal' | 'mild' | 'high' | 'critical' = 'normal'): VitalWithRisk {
  const baseline = getBaseline(patient.ageGroup, patient.sex);
  const now = new Date().toISOString();

  let hr: number, spo2: number, temp: number, stress: number;

  switch (scenario) {
    case 'critical':
      hr = rand(110, 135);
      spo2 = rand(82, 87);
      temp = parseFloat((rand(38.5, 39.5, 1)).toFixed(1));
      stress = rand(82, 95);
      break;
    case 'high':
      hr = rand(95, 110);
      spo2 = rand(88, 92);
      temp = parseFloat((rand(37.8, 38.4, 1)).toFixed(1));
      stress = rand(65, 80);
      break;
    case 'mild':
      hr = rand(82, 94);
      spo2 = rand(93, 94);
      temp = parseFloat((rand(37.4, 37.7, 1)).toFixed(1));
      stress = rand(42, 58);
      break;
    default:
      hr = rand(baseline.heartRateMin + 1, baseline.heartRateMax - 1);
      spo2 = rand(97, 99);
      temp = parseFloat((rand(36.3, 36.9, 1)).toFixed(1));
      stress = rand(15, 30);
  }

  const heartRateRisk = calculateRiskDetail(hr, baseline.heartRateMin, baseline.heartRateMax, 'bpm', 'Heart Rate');
  const spo2Risk = calculateRiskDetail(spo2, baseline.spo2Min, baseline.spo2Max, '%', 'SpO₂');
  const temperatureRisk = calculateRiskDetail(temp, baseline.temperatureMin, baseline.temperatureMax, '°C', 'Skin Temperature');
  const stressRisk = calculateRiskDetail(stress, baseline.stressMin, baseline.stressMax, '', 'Stress Level');

  const overallRisk = pickWorstRisk([heartRateRisk.riskLevel, spo2Risk.riskLevel, temperatureRisk.riskLevel, stressRisk.riskLevel]);
  const overallRiskPercentage = Math.max(
    heartRateRisk.riskPercentage,
    spo2Risk.riskPercentage,
    temperatureRisk.riskPercentage,
    stressRisk.riskPercentage
  );

  return {
    heartRate: hr, spo2, skinTemperature: temp, stressLevel: stress,
    timestamp: now,
    heartRateRisk, spo2Risk, temperatureRisk, stressRisk,
    overallRisk, overallRiskPercentage,
  };
}

// ──────────────────────────────────────────────
// Time Series Generator
// ──────────────────────────────────────────────
export function generateTimeSeriesPoints(
  baseline: Baseline,
  metric: 'heartRate' | 'spo2' | 'temperature' | 'stress',
  hours = 6,
  scenario: 'normal' | 'mild' | 'high' | 'critical' = 'normal'
): VitalTimePoint[] {
  const points: VitalTimePoint[] = [];
  const now = Date.now();
  const intervalMs = (hours * 60 * 60 * 1000) / 60;

  let min: number, max: number, bMin: number, bMax: number, unit: string;
  switch (metric) {
    case 'heartRate':
      bMin = baseline.heartRateMin; bMax = baseline.heartRateMax;
      min = scenario === 'normal' ? bMin : scenario === 'mild' ? bMax + 2 : bMax + 10;
      max = scenario === 'normal' ? bMax : scenario === 'mild' ? bMax + 8 : scenario === 'high' ? bMax + 18 : bMax + 35;
      unit = 'bpm'; break;
    case 'spo2':
      bMin = baseline.spo2Min; bMax = baseline.spo2Max;
      min = scenario === 'normal' ? bMin + 1 : scenario === 'mild' ? bMin - 2 : scenario === 'high' ? bMin - 7 : bMin - 14;
      max = scenario === 'normal' ? bMax : bMin + 1;
      unit = '%'; break;
    case 'temperature':
      bMin = baseline.temperatureMin; bMax = baseline.temperatureMax;
      min = scenario === 'normal' ? bMin + 0.1 : bMax + 0.2;
      max = scenario === 'normal' ? bMax - 0.1 : scenario === 'mild' ? bMax + 0.4 : bMax + 1.2;
      unit = '°C'; break;
    case 'stress':
      bMin = 0; bMax = baseline.stressMax;
      min = scenario === 'normal' ? 10 : scenario === 'mild' ? 40 : 65;
      max = scenario === 'normal' ? 35 : scenario === 'mild' ? 58 : scenario === 'high' ? 78 : 95;
      unit = ''; break;
  }

  for (let i = 60; i >= 0; i--) {
    const ts = new Date(now - i * intervalMs).toISOString();
    const val = parseFloat((Math.random() * (max - min) + min).toFixed(metric === 'temperature' ? 1 : 0));
    const riskDetail = calculateRiskDetail(val, bMin!, bMax!, unit!, metric);
    points.push({ timestamp: ts, value: val, riskLevel: riskDetail.riskLevel, baselineMin: bMin!, baselineMax: bMax! });
  }
  return points;
}

// ──────────────────────────────────────────────
// Mock Alerts
// ──────────────────────────────────────────────
export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a-001',
    patientId: 'p-002',
    type: 'critical_spo2',
    title: 'Critical SpO₂ Drop Detected',
    description: 'Oxygen saturation has dropped to 86%, exceeding critical threshold.',
    rootCauseExplanation: 'Patient Robert Okonkwo (73, Male, COPD) has a baseline SpO₂ of 92–98%. Current value 86% represents a deviation of -9% from the normal midpoint (95%), placing this at Critical risk (>20% threshold exceeded). Combined with known COPD diagnosis and Atrial Fibrillation, this pattern indicates possible acute hypoxic event. Immediate clinical review required.',
    metric: 'SpO₂',
    currentValue: 86,
    expectedMin: 92,
    expectedMax: 98,
    deviation: -9,
    riskPercentage: 24.2,
    riskLevel: 'critical',
    status: 'active',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    escalationHistory: [
      { timestamp: new Date(Date.now() - 8 * 60000).toISOString(), action: 'created', performedBy: 'AI Monitor', note: 'SpO₂ < 88% for 3 consecutive readings' },
    ],
  },
  {
    id: 'a-002',
    patientId: 'p-002',
    type: 'irregular_heartbeat',
    title: 'Irregular Heart Rate Pattern',
    description: 'Heart rate variability outside normal range. Pattern consistent with arrhythmia.',
    rootCauseExplanation: 'Heart rate recorded at 118 bpm vs expected 58–80 bpm (70+ Male baseline). Deviation: +28 bpm, Risk: 33%. Patient has documented Atrial Fibrillation — this elevation combined with irregular interval pattern may represent AFib episode. Protocol "AFib Monitor Protocol" has been triggered and is pending doctor approval.',
    metric: 'Heart Rate',
    currentValue: 118,
    expectedMin: 58,
    expectedMax: 80,
    deviation: 28,
    riskPercentage: 33.0,
    riskLevel: 'critical',
    status: 'escalated',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
    acknowledgedAt: new Date(Date.now() - 18 * 60000).toISOString(),
    acknowledgedBy: 'Nurse Kim',
    escalatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    escalatedTo: 'Dr. Priya Nair',
    escalationHistory: [
      { timestamp: new Date(Date.now() - 22 * 60000).toISOString(), action: 'created', performedBy: 'AI Monitor' },
      { timestamp: new Date(Date.now() - 18 * 60000).toISOString(), action: 'acknowledged', performedBy: 'Nurse Kim', note: 'Reviewing patient at bedside' },
      { timestamp: new Date(Date.now() - 15 * 60000).toISOString(), action: 'escalated', performedBy: 'Nurse Kim', note: 'Consulting attending physician' },
    ],
  },
  {
    id: 'a-003',
    patientId: 'p-001',
    type: 'sleep_disturbance',
    title: 'Sleep Disturbance Detected',
    description: 'Multiple micro-arousals and movement events detected in the past 45 minutes.',
    rootCauseExplanation: 'Patient Sarah Chen has experienced 7 micro-arousal events in the past 45 minutes. Combined stress level of 58 (baseline 0–35 for 30–39 Female, Risk 9.3% Mild) suggests stress-induced sleep fragmentation. Sleep efficiency has dropped below 70%.',
    metric: 'Sleep Quality',
    currentValue: 58,
    expectedMin: 0,
    expectedMax: 35,
    deviation: 23,
    riskPercentage: 9.3,
    riskLevel: 'mild',
    status: 'acknowledged',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    acknowledgedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    acknowledgedBy: 'Dr. James Whitmore',
    escalationHistory: [
      { timestamp: new Date(Date.now() - 45 * 60000).toISOString(), action: 'created', performedBy: 'AI Monitor' },
      { timestamp: new Date(Date.now() - 30 * 60000).toISOString(), action: 'acknowledged', performedBy: 'Dr. James Whitmore' },
    ],
  },
  {
    id: 'a-004',
    patientId: 'p-001',
    type: 'high_stress',
    title: 'Elevated Stress Level',
    description: 'Stress index elevated for 20+ minutes during sleep cycle.',
    rootCauseExplanation: 'Stress Level: 52. Expected range (Female 30–39): 0–35. Deviation: +17. Risk: 15.8% (High). Elevated during REM cycle, consistent with REM sleep behavior disorder pattern.',
    metric: 'Stress Level',
    currentValue: 52,
    expectedMin: 0,
    expectedMax: 35,
    deviation: 17,
    riskPercentage: 15.8,
    riskLevel: 'high',
    status: 'active',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    escalationHistory: [
      { timestamp: new Date(Date.now() - 12 * 60000).toISOString(), action: 'created', performedBy: 'AI Monitor', note: 'Stress > 40 for 20 consecutive minutes' },
    ],
  },
];

// ──────────────────────────────────────────────
// Mock Devices
// ──────────────────────────────────────────────
export const MOCK_DEVICES: Device[] = [
  {
    id: 'd-001', name: 'Smart Bed — Room 2A-108', type: 'smart_bed',
    status: 'online', patientId: 'p-002', firmwareVersion: '3.4.1',
    lastSeen: new Date(Date.now() - 30000).toISOString(),
    ipAddress: '192.168.10.21', location: 'Ward 2A, Room 108',
    commandHistory: [
      { id: 'c-001', timestamp: new Date(Date.now() - 4 * 60000).toISOString(), command: 'ELEVATION_ADJUST 15deg', issuedBy: 'Nurse Kim', status: 'acked', latencyMs: 220 },
      { id: 'c-002', timestamp: new Date(Date.now() - 25 * 60000).toISOString(), command: 'VITAL_SYNC_REQUEST', issuedBy: 'System', status: 'acked', latencyMs: 140 },
    ],
  },
  {
    id: 'd-002', name: 'Pill Dispenser — Room 2A-108', type: 'pill_dispenser',
    status: 'online', patientId: 'p-002', batteryLevel: 84, firmwareVersion: '2.1.0',
    lastSeen: new Date(Date.now() - 45000).toISOString(),
    ipAddress: '192.168.10.22', location: 'Ward 2A, Room 108',
    commandHistory: [
      { id: 'c-003', timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(), command: 'DISPENSE_DOSE warfarin-5mg', issuedBy: 'Protocol Engine', status: 'acked', latencyMs: 310, responsePayload: 'DOSE_CONFIRMED' },
    ],
  },
  {
    id: 'd-003', name: 'Apple Watch — Sarah Chen', type: 'apple_watch',
    status: 'online', patientId: 'p-001', batteryLevel: 72, firmwareVersion: 'watchOS 11.2',
    lastSeen: new Date(Date.now() - 15000).toISOString(),
    location: 'Room 4B-201',
    commandHistory: [],
  },
  {
    id: 'd-004', name: 'Smart Bed — Room 4B-201', type: 'smart_bed',
    status: 'online', patientId: 'p-001', firmwareVersion: '3.4.1',
    lastSeen: new Date(Date.now() - 12000).toISOString(),
    ipAddress: '192.168.10.41', location: 'Ward 4B, Room 201',
    commandHistory: [],
  },
  {
    id: 'd-005', name: 'Pill Dispenser — Room 4B-201', type: 'pill_dispenser',
    status: 'low_battery', patientId: 'p-001', batteryLevel: 11, firmwareVersion: '2.1.0',
    lastSeen: new Date(Date.now() - 120000).toISOString(),
    ipAddress: '192.168.10.42', location: 'Ward 4B, Room 201',
    commandHistory: [],
  },
];

// ──────────────────────────────────────────────
// Mock Protocols
// ──────────────────────────────────────────────
export const MOCK_PROTOCOLS: Protocol[] = [
  {
    id: 'pr-001', patientId: 'p-002', name: 'AFib Monitor Protocol',
    description: 'Activated when irregular HR pattern is detected in patient with known AFib diagnosis.',
    type: 'approval_required', triggerCondition: 'HR > 100 bpm AND irregular interval pattern',
    action: 'Notify attending physician and prepare IV medication order',
    doctorName: 'Dr. Priya Nair', approvedAt: '2026-02-20T09:00:00Z', isActive: true,
    lastTriggeredAt: new Date(Date.now() - 22 * 60000).toISOString(),
    actionHistory: [
      { id: 'pa-001', timestamp: new Date(Date.now() - 22 * 60000).toISOString(), triggeredBy: 'AI Monitor', status: 'pending', note: 'Awaiting Dr. Nair approval' },
    ],
  },
  {
    id: 'pr-002', patientId: 'p-002', name: 'Hypoxia Response Protocol',
    description: 'Critical SpO₂ alert protocol with oxygen supplementation notification.',
    type: 'notify_only', triggerCondition: 'SpO₂ < 90%',
    action: 'Page nursing station, initiate O₂ supplementation checklist',
    doctorName: 'Dr. Priya Nair', approvedAt: '2026-02-20T09:00:00Z', isActive: true,
    lastTriggeredAt: new Date(Date.now() - 8 * 60000).toISOString(),
    actionHistory: [
      { id: 'pa-002', timestamp: new Date(Date.now() - 8 * 60000).toISOString(), triggeredBy: 'AI Monitor', status: 'executed', note: 'Nursing station notified. O₂ checklist dispatched.' },
    ],
  },
  {
    id: 'pr-003', patientId: 'p-001', name: 'Nighttime Glucose Protocol',
    description: 'Automated alerts when sleep-time metrics suggest possible hypoglycemic event.',
    type: 'notify_only', triggerCondition: 'Sleep disturbance + elevated HR + low temperature',
    action: 'Alert nursing team to check blood glucose',
    doctorName: 'Dr. James Whitmore', approvedAt: '2026-03-01T11:00:00Z', isActive: true,
    actionHistory: [],
  },
];

// ──────────────────────────────────────────────
// Sleep Data
// ──────────────────────────────────────────────
export const MOCK_SLEEP_SESSION: SleepSession = {
  id: 'sl-001', patientId: 'p-001',
  startTime: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
  durationMinutes: 390, qualityScore: 68,
  stages: [
    { stage: 'light', startTime: new Date(Date.now() - 6.5 * 3600000).toISOString(), durationMinutes: 25 },
    { stage: 'deep', startTime: new Date(Date.now() - 6 * 3600000).toISOString(), durationMinutes: 55 },
    { stage: 'rem', startTime: new Date(Date.now() - 5.1 * 3600000).toISOString(), durationMinutes: 45 },
    { stage: 'light', startTime: new Date(Date.now() - 4.4 * 3600000).toISOString(), durationMinutes: 30 },
    { stage: 'awake', startTime: new Date(Date.now() - 4 * 3600000).toISOString(), durationMinutes: 8 },
    { stage: 'deep', startTime: new Date(Date.now() - 3.8 * 3600000).toISOString(), durationMinutes: 50 },
    { stage: 'rem', startTime: new Date(Date.now() - 3 * 3600000).toISOString(), durationMinutes: 60 },
    { stage: 'light', startTime: new Date(Date.now() - 2 * 3600000).toISOString(), durationMinutes: 40 },
    { stage: 'awake', startTime: new Date(Date.now() - 1.3 * 3600000).toISOString(), durationMinutes: 12 },
    { stage: 'light', startTime: new Date(Date.now() - 1 * 3600000).toISOString(), durationMinutes: 65 },
  ],
  interruptions: 3, deepSleepMinutes: 105, remMinutes: 105, lightSleepMinutes: 160, awakeMinutes: 20,
  disturbanceDetected: true,
  movementEvents: [
    { timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), intensity: 7 },
    { timestamp: new Date(Date.now() - 3.5 * 3600000).toISOString(), intensity: 4 },
    { timestamp: new Date(Date.now() - 1.3 * 3600000).toISOString(), intensity: 8 },
  ],
};

export const MOCK_NIGHTLY_SUMMARIES: NightlySummary[] = [
  { date: '2026-03-01', qualityScore: 75, durationHours: 7.2, deepSleepPct: 28, remSleepPct: 24, interruptions: 1, disturbanceDetected: false },
  { date: '2026-03-02', qualityScore: 82, durationHours: 7.8, deepSleepPct: 31, remSleepPct: 27, interruptions: 0, disturbanceDetected: false },
  { date: '2026-03-03', qualityScore: 58, durationHours: 6.1, deepSleepPct: 19, remSleepPct: 22, interruptions: 4, disturbanceDetected: true },
  { date: '2026-03-04', qualityScore: 71, durationHours: 6.9, deepSleepPct: 25, remSleepPct: 25, interruptions: 2, disturbanceDetected: false },
  { date: '2026-03-05', qualityScore: 65, durationHours: 6.5, deepSleepPct: 22, remSleepPct: 23, interruptions: 3, disturbanceDetected: true },
  { date: '2026-03-06', qualityScore: 79, durationHours: 7.5, deepSleepPct: 29, remSleepPct: 26, interruptions: 1, disturbanceDetected: false },
  { date: '2026-03-07', qualityScore: 68, durationHours: 6.5, deepSleepPct: 26, remSleepPct: 26, interruptions: 3, disturbanceDetected: true },
];

// ──────────────────────────────────────────────
// Alert Threshold Config
// ──────────────────────────────────────────────
export const ALERT_THRESHOLDS: AlertThresholdConfig[] = [
  { metric: 'Heart Rate', mildThreshold: 5, highThreshold: 10, criticalThreshold: 20, unit: '%', description: 'Percentage deviation from age/sex baseline midpoint' },
  { metric: 'SpO₂', mildThreshold: 5, highThreshold: 10, criticalThreshold: 20, unit: '%', description: 'Percentage deviation from age/sex baseline midpoint' },
  { metric: 'Skin Temperature', mildThreshold: 5, highThreshold: 10, criticalThreshold: 20, unit: '%', description: 'Percentage deviation from baseline' },
  { metric: 'Stress Level', mildThreshold: 5, highThreshold: 10, criticalThreshold: 20, unit: '%', description: 'Percentage deviation from age/sex baseline' },
];

// ──────────────────────────────────────────────
// Build current status for a patient
// ──────────────────────────────────────────────
export function buildCurrentStatus(patientId: string, scenario: 'normal' | 'mild' | 'high' | 'critical' = 'normal'): CurrentStatus {
  const patient = MOCK_PATIENTS.find(p => p.id === patientId) || MOCK_PATIENTS[0];
  const latestVitals = generateVitalsForPatient(patient, scenario);
  const activeAlerts = MOCK_ALERTS.filter(a => a.patientId === patientId && (a.status === 'active' || a.status === 'escalated'));

  return {
    patientId: patient.id,
    patient,
    latestVitals,
    currentSleepSession: patientId === 'p-001' ? MOCK_SLEEP_SESSION : undefined,
    activeAlerts,
    overallRisk: latestVitals.overallRisk,
    overallRiskScore: latestVitals.overallRiskPercentage,
    deviceStatuses: MOCK_DEVICES.filter(d => d.patientId === patientId),
    sleepScore: 68,
    isMonitoring: true,
    lastUpdated: new Date().toISOString(),
  };
}
