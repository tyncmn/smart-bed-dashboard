'use client';

import React, { useEffect, useCallback } from 'react';
import { useDashboardStore } from './store';
import { generateVitalsForPatient, MOCK_PATIENTS } from './mock-data';

/**
 * Simulates WebSocket-based realtime vital streaming.
 * Updates vitals every 3 seconds for the active patient.
 */
export function useRealtimeVitals(intervalMs = 3000) {
  const { activePatientId, scenario, updateVitals, alerts } = useDashboardStore();

  const tick = useCallback(() => {
    const patient = MOCK_PATIENTS.find(p => p.id === activePatientId);
    if (!patient) return;
    const vitals = generateVitalsForPatient(patient, scenario);
    updateVitals(vitals);
  }, [activePatientId, scenario, updateVitals]);

  useEffect(() => {
    // Initial load
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [tick, intervalMs]);
}
