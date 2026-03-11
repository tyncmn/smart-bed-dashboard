'use client';

import { useEffect, useRef } from 'react';
import { useDashboardStore } from './store';
import { fetchCurrentStatus, fetchSleepSummary } from './api';

const USER_ID = process.env.NEXT_PUBLIC_USER_ID || '';

export function useRealtimeStatus(intervalMs = 5000) {
  const { setCurrentStatus, setError, setLoading } = useDashboardStore();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function poll() {
      try {
        const status = await fetchCurrentStatus(USER_ID);
        if (mountedRef.current) setCurrentStatus(status);
      } catch (err) {
        if (mountedRef.current) setError(err instanceof Error ? err.message : 'Connection failed');
      }
    }

    setLoading(true);
    poll();
    const id = setInterval(poll, intervalMs);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [intervalMs, setCurrentStatus, setError, setLoading]);
}

export function useSleepSummary(days: 7 | 30 = 7) {
  const { setSleepSummary } = useDashboardStore();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function load() {
      try {
        const summary = await fetchSleepSummary(USER_ID, days);
        if (mountedRef.current) setSleepSummary(summary);
      } catch {
        // Sleep summary is non-critical
      }
    }

    load();
    const id = setInterval(load, 30000);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [days, setSleepSummary]);
}
