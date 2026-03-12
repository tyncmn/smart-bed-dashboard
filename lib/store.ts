'use client';

import { create } from 'zustand';
import { CurrentStatusResponse, SleepSummary } from './types';
import type { LatestVitalsResponse, VitalsMetricKey } from './api';

export type VitalsHistoryPoint = {
  fetchedAt: string;
  timeLabel: string;
  heart_rate: number;
  spo2: number;
  stress_level: number;
  skin_temperature: number;
  movement_score: number;
  sleep_duration: number;
};

interface DashboardState {
  currentStatus: CurrentStatusResponse | null;
  sleepSummary: SleepSummary | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;

  // ── Vitals (persists across navigation) ─────────────────────
  vitals: LatestVitalsResponse | null;
  vitalsHistory: VitalsHistoryPoint[];
  setVitals: (latest: LatestVitalsResponse) => void;

  setCurrentStatus: (status: CurrentStatusResponse) => void;
  setSleepSummary: (summary: SleepSummary) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  optimisticAcknowledge: (alertId: string) => void;

  selectedAlertId: string | null;
  setSelectedAlert: (id: string | null) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  currentStatus: null,
  sleepSummary: null,
  isLoading: true,
  error: null,
  lastFetched: null,

  vitals: null,
  vitalsHistory: [],
  setVitals: (latest) =>
    set((state) => {
      // Skip duplicate poll responses
      const prev = state.vitalsHistory;
      if (prev.length > 0 && prev[prev.length - 1].fetchedAt === latest.fetchedAt) {
        return { vitals: latest };
      }
      const point: VitalsHistoryPoint = {
        fetchedAt: latest.fetchedAt,
        timeLabel: new Date(latest.fetchedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        heart_rate:       latest.metrics.heart_rate.value,
        spo2:             latest.metrics.spo2.value,
        stress_level:     latest.metrics.stress_level.value,
        skin_temperature: latest.metrics.skin_temperature.value,
        movement_score:   latest.metrics.movement_score.value,
        sleep_duration:   latest.metrics.sleep_duration.value,
      };
      return {
        vitals: latest,
        vitalsHistory: [...prev, point].slice(-36),
      };
    }),

  setCurrentStatus: (currentStatus) =>
    set({ currentStatus, lastFetched: new Date().toISOString(), isLoading: false, error: null }),

  setSleepSummary: (sleepSummary) => set({ sleepSummary }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),

  optimisticAcknowledge: (alertId) =>
    set((state) => {
      if (!state.currentStatus) return state;
      return {
        currentStatus: {
          ...state.currentStatus,
          unreadAlertCount: Math.max(0, state.currentStatus.unreadAlertCount - 1),
          alerts: state.currentStatus.alerts.map((a) =>
            a.id === alertId
              ? { ...a, isAcknowledged: true, acknowledgedAt: new Date().toISOString() }
              : a
          ),
        },
      };
    }),

  selectedAlertId: null,
  setSelectedAlert: (id) => set({ selectedAlertId: id }),
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
