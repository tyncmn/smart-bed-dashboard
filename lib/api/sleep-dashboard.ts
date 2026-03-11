// lib/api/sleep-dashboard.ts

import { apiClient } from './client';
import type { SleepDashboard } from '@/types/sleep-dashboard';

export async function getSleepDashboard(
  userId: string,
  days: number = 7,
): Promise<SleepDashboard> {
  const res = await apiClient(
    `/users/${encodeURIComponent(userId)}/sleep-dashboard?days=${days}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch sleep dashboard: ${res.status}`);
  return res.json() as Promise<SleepDashboard>;
}
