'use client';

import { useState, useEffect, useRef } from 'react';
import { getLatestVitals } from '@/lib/api/vitals';
import type { LatestVitals } from '@/types/vitals';

const POLL_INTERVAL_MS = 5_000;

export function useLatestVitals(userId: string | null) {
  const [data, setData] = useState<LatestVitals | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function poll() {
      try {
        const result = await getLatestVitals(userId!);
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch vitals');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setLoading(true);
    poll();
    timerRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userId]);

  return { data, error, loading };
}
