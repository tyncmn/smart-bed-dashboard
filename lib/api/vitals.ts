// lib/api/vitals.ts

import { apiClient } from './client';
import type { LatestVitals } from '@/types/vitals';

export async function getLatestVitals(userId: string): Promise<LatestVitals> {
  const res = await apiClient(`/vitals/latest?user_id=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Failed to fetch vitals: ${res.status}`);
  return res.json() as Promise<LatestVitals>;
}
