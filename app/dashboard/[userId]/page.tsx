import React from 'react';
import { SleepAnalyticsDashboard } from '@/components/sleep-dashboard/SleepAnalyticsDashboard';

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function DashboardPage({ params }: Props) {
  const { userId } = await params;
  return <SleepAnalyticsDashboard userId={userId} />;
}
