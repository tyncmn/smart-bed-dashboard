'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSleepDashboard } from '@/lib/api/sleep-dashboard';
import type { SleepDashboard } from '@/types/sleep-dashboard';

export function useSleepDashboard(userId: string | null, days: number = 7) {
  const [data, setData] = useState<SleepDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getSleepDashboard(userId, days);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [userId, days]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, error, loading, refresh: fetchDashboard };
}
