// ============================================================
// Domain Types — Smart Bed Health Monitoring System
// ============================================================

export type RiskLevel = "normal" | "mild" | "high" | "critical";
export type Sex = "male" | "female" | "other";
export type AgeGroup = "18-29" | "30-39" | "40-49" | "50-59" | "60-69" | "70+";
export type SleepStage = "awake" | "light" | "deep" | "rem";
export type AlertStatus = "active" | "acknowledged" | "escalated" | "resolved";
export type DeviceStatus = "online" | "offline" | "error" | "low_battery";
export type ProtocolType =
  | "notify_only"
  | "approval_required"
  | "auto_dispense";
export type ProtocolActionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "executed"
  | "failed";

// ──────────────────────────────────────────────
// Patient / User
// ──────────────────────────────────────────────
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  ageGroup: AgeGroup;
  sex: Sex;
  weight: number; // kg
  height: number; // cm
  conditions: string[];
  medications: string[];
  roomNumber: string;
  admittedAt: string;
  primaryDoctor: string;
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: number;
}

// ──────────────────────────────────────────────
// Vitals / Metrics
// ──────────────────────────────────────────────
export interface VitalReading {
  heartRate: number; // bpm
  spo2: number; // %
  skinTemperature: number; // °C
  stressLevel: number; // 0-100
  respirationRate?: number; // breaths/min
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  timestamp: string;
}

export interface VitalWithRisk extends VitalReading {
  heartRateRisk: VitalRiskDetail;
  spo2Risk: VitalRiskDetail;
  temperatureRisk: VitalRiskDetail;
  stressRisk: VitalRiskDetail;
  overallRisk: RiskLevel;
  overallRiskPercentage: number;
}

export interface VitalRiskDetail {
  currentValue: number;
  normalMin: number;
  normalMax: number;
  deviation: number;
  riskPercentage: number;
  riskLevel: RiskLevel;
  unit: string;
  label: string;
  reason?: string;
}

export interface VitalTimePoint {
  timestamp: string;
  value: number;
  riskLevel: RiskLevel;
  baselineMin: number;
  baselineMax: number;
}

// ──────────────────────────────────────────────
// Sleep
// ──────────────────────────────────────────────
export interface SleepSession {
  id: string;
  patientId: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  stages: SleepStageSegment[];
  qualityScore: number; // 0-100
  interruptions: number;
  deepSleepMinutes: number;
  remMinutes: number;
  lightSleepMinutes: number;
  awakeMinutes: number;
  disturbanceDetected: boolean;
  movementEvents: MovementEvent[];
}

export interface SleepStageSegment {
  stage: SleepStage;
  startTime: string;
  durationMinutes: number;
}

export interface MovementEvent {
  timestamp: string;
  intensity: number; // 0-10
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
// Alerts
// ──────────────────────────────────────────────
export interface Alert {
  id: string;
  patientId: string;
  type: AlertType;
  title: string;
  description: string;
  rootCauseExplanation: string;
  metric: string;
  currentValue: number;
  expectedMin: number;
  expectedMax: number;
  deviation: number;
  riskPercentage: number;
  riskLevel: RiskLevel;
  status: AlertStatus;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  escalatedAt?: string;
  escalatedTo?: string;
  resolvedAt?: string;
  assignedTo?: string;
  escalationHistory: EscalationEvent[];
}

export type AlertType =
  | "low_oxygen"
  | "irregular_heartbeat"
  | "sleep_disturbance"
  | "high_heart_rate"
  | "low_heart_rate"
  | "high_temperature"
  | "low_temperature"
  | "high_stress"
  | "critical_spo2"
  | "device_offline";

export interface EscalationEvent {
  timestamp: string;
  action: "created" | "acknowledged" | "escalated" | "assigned" | "resolved";
  performedBy: string;
  note?: string;
}

// ──────────────────────────────────────────────
// Baseline
// ──────────────────────────────────────────────
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
  respirationMin?: number;
  respirationMax?: number;
}

// ──────────────────────────────────────────────
// Device
// ──────────────────────────────────────────────
export interface Device {
  id: string;
  name: string;
  type: "smart_bed" | "pill_dispenser" | "apple_watch" | "gateway";
  status: DeviceStatus;
  patientId: string;
  batteryLevel?: number;
  firmwareVersion: string;
  lastSeen: string;
  ipAddress?: string;
  location: string;
  commandHistory: DeviceCommand[];
}

export interface DeviceCommand {
  id: string;
  timestamp: string;
  command: string;
  issuedBy: string;
  status: "sent" | "acked" | "failed" | "timeout";
  responsePayload?: string;
  latencyMs?: number;
}

// ──────────────────────────────────────────────
// Protocol
// ──────────────────────────────────────────────
export interface Protocol {
  id: string;
  patientId: string;
  name: string;
  description: string;
  type: ProtocolType;
  triggerCondition: string;
  action: string;
  doctorName: string;
  approvedAt?: string;
  isActive: boolean;
  lastTriggeredAt?: string;
  actionHistory: ProtocolAction[];
}

export interface ProtocolAction {
  id: string;
  timestamp: string;
  triggeredBy: string;
  status: ProtocolActionStatus;
  approvedBy?: string;
  note?: string;
  dispatchedToDevice?: string;
}

// ──────────────────────────────────────────────
// Current Status (dashboard summary)
// ──────────────────────────────────────────────
export interface CurrentStatus {
  patientId: string;
  patient: Patient;
  latestVitals: VitalWithRisk;
  currentSleepSession?: SleepSession;
  activeAlerts: Alert[];
  overallRisk: RiskLevel;
  overallRiskScore: number;
  deviceStatuses: Device[];
  sleepScore: number;
  isMonitoring: boolean;
  lastUpdated: string;
}

// ──────────────────────────────────────────────
// WebSocket Events
// ──────────────────────────────────────────────
export type RealtimeEvent =
  | { type: "vital.updated"; payload: VitalWithRisk }
  | { type: "alert.created"; payload: Alert }
  | {
      type: "alert.acknowledged";
      payload: { alertId: string; by: string; at: string };
    }
  | {
      type: "device.status.changed";
      payload: { deviceId: string; status: DeviceStatus };
    }
  | {
      type: "protocol.triggered";
      payload: { protocolId: string; action: ProtocolAction };
    };

// ──────────────────────────────────────────────
// Admin Config
// ──────────────────────────────────────────────
export interface AlertThresholdConfig {
  metric: string;
  mildThreshold: number;
  highThreshold: number;
  criticalThreshold: number;
  unit: string;
  description: string;
}

export interface NotificationRule {
  id: string;
  name: string;
  triggerCondition: string;
  recipients: string[];
  channels: ("email" | "sms" | "pager" | "in_app")[];
  isActive: boolean;
}
