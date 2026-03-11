'use client';

import { create } from 'zustand';
import { CurrentStatusResponse, SleepSummary } from './types';

interface DashboardState {
  currentStatus: CurrentStatusResponse | null;
  sleepSummary: SleepSummary | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;

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
