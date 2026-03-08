'use client';
import { create } from 'zustand';
import { Alert, VitalWithRisk, Device, DeviceStatus } from './types';
import { MOCK_ALERTS, MOCK_DEVICES, buildCurrentStatus, generateVitalsForPatient, MOCK_PATIENTS } from './mock-data';

interface DashboardState {
  // Active patient
  activePatientId: string;
  scenario: 'normal' | 'mild' | 'high' | 'critical';
  setActivePatient: (id: string) => void;
  setScenario: (s: 'normal' | 'mild' | 'high' | 'critical') => void;

  // Live vitals
  currentVitals: VitalWithRisk | null;
  vitalHistory: Record<string, { timestamp: string; value: number; riskLevel: string }[]>;
  updateVitals: (vitals: VitalWithRisk) => void;

  // Alerts
  alerts: Alert[];
  acknowledgeAlert: (alertId: string, by: string) => void;
  escalateAlert: (alertId: string, to: string, by: string) => void;
  assignAlert: (alertId: string, to: string) => void;

  // Devices
  devices: Device[];
  updateDeviceStatus: (deviceId: string, status: DeviceStatus) => void;

  // UI state
  selectedAlertId: string | null;
  setSelectedAlert: (id: string | null) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  activePatientId: 'p-001',
  scenario: 'mild',
  setActivePatient: (id) => set({ activePatientId: id }),
  setScenario: (scenario) => set({ scenario }),

  currentVitals: null,
  vitalHistory: { heartRate: [], spo2: [], temperature: [], stress: [] },
  updateVitals: (vitals) => {
    set((state) => {
      const maxLen = 120;
      const push = (arr: { timestamp: string; value: number; riskLevel: string }[], val: number, risk: string) => {
        const next = [...arr, { timestamp: vitals.timestamp, value: val, riskLevel: risk }];
        return next.slice(-maxLen);
      };
      return {
        currentVitals: vitals,
        vitalHistory: {
          heartRate: push(state.vitalHistory.heartRate, vitals.heartRate, vitals.heartRateRisk.riskLevel),
          spo2: push(state.vitalHistory.spo2, vitals.spo2, vitals.spo2Risk.riskLevel),
          temperature: push(state.vitalHistory.temperature, vitals.skinTemperature, vitals.temperatureRisk.riskLevel),
          stress: push(state.vitalHistory.stress, vitals.stressLevel, vitals.stressRisk.riskLevel),
        },
      };
    });
  },

  alerts: MOCK_ALERTS,
  acknowledgeAlert: (alertId, by) => set(state => ({
    alerts: state.alerts.map(a => a.id === alertId ? {
      ...a, status: 'acknowledged' as const,
      acknowledgedAt: new Date().toISOString(), acknowledgedBy: by,
      escalationHistory: [...a.escalationHistory, { timestamp: new Date().toISOString(), action: 'acknowledged' as const, performedBy: by }]
    } : a)
  })),
  escalateAlert: (alertId, to, by) => set(state => ({
    alerts: state.alerts.map(a => a.id === alertId ? {
      ...a, status: 'escalated' as const,
      escalatedAt: new Date().toISOString(), escalatedTo: to,
      escalationHistory: [...a.escalationHistory, { timestamp: new Date().toISOString(), action: 'escalated' as const, performedBy: by, note: `Escalated to ${to}` }]
    } : a)
  })),
  assignAlert: (alertId, to) => set(state => ({
    alerts: state.alerts.map(a => a.id === alertId ? {
      ...a, assignedTo: to,
      escalationHistory: [...a.escalationHistory, { timestamp: new Date().toISOString(), action: 'assigned' as const, performedBy: 'System', note: `Assigned to ${to}` }]
    } : a)
  })),

  devices: MOCK_DEVICES,
  updateDeviceStatus: (deviceId, status) => set(state => ({
    devices: state.devices.map(d => d.id === deviceId ? { ...d, status } : d)
  })),

  selectedAlertId: null,
  setSelectedAlert: (id) => set({ selectedAlertId: id }),
  isSidebarOpen: true,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
