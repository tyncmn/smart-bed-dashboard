'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDashboardStore } from '@/lib/store';
import { useRealtimeStatus } from '@/lib/use-realtime';
import { AlertBanner } from '@/components/AlertBanner';
import { AlertDetailDrawer } from '@/components/AlertDetailDrawer';
import { timeAgo } from '@/lib/utils';
import { Activity, AlertTriangle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { fetchLatestVitals, LatestVitalsResponse, VitalsMetricKey } from '@/lib/api';
import { getUserId } from '@/lib/auth';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type HistoryPoint = {
  fetchedAt: string;
  timeLabel: string;
  heart_rate: number;
  spo2: number;
  stress_level: number;
  skin_temperature: number;
  movement_score: number;
  sleep_duration: number;
};

const METRIC_CONFIG: Array<{
  key: VitalsMetricKey;
  label: string;
  unit: string;
  color: string;
  format: (value: number) => string;
}> = [
  { key: 'heart_rate', label: 'Heart Rate', unit: 'bpm', color: 'hsl(0,80%,60%)', format: (v) => Math.round(v).toString() },
  { key: 'spo2', label: 'SpO2', unit: '%', color: 'hsl(199,89%,60%)', format: (v) => Math.round(v).toString() },
  { key: 'stress_level', label: 'Stress Level', unit: '/100', color: 'hsl(25,90%,60%)', format: (v) => Math.round(v).toString() },
  { key: 'skin_temperature', label: 'Skin Temperature', unit: 'deg C', color: 'hsl(43,90%,60%)', format: (v) => v.toFixed(1) },
  { key: 'movement_score', label: 'Movement Score', unit: 'score', color: 'hsl(270,70%,68%)', format: (v) => v.toFixed(2) },
  { key: 'sleep_duration', label: 'Sleep Duration', unit: 'min', color: 'hsl(152,69%,52%)', format: (v) => Math.round(v).toString() },
];

export default function OverviewPage() {
  useRealtimeStatus(5000);
  const { currentStatus, selectedAlertId, setSelectedAlert } = useDashboardStore();
  const [vitals, setVitals] = useState<LatestVitalsResponse | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [vitalsError, setVitalsError] = useState<string | null>(null);
  const [isVitalsLoading, setIsVitalsLoading] = useState(true);

  const activeAlerts = currentStatus?.alerts.filter(a => !a.isAcknowledged) ?? [];
  const selectedAlert = selectedAlertId ? currentStatus?.alerts.find(a => a.id === selectedAlertId) : null;

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      const userId = getUserId();
      if (!userId) {
        if (mounted) {
          setVitalsError('No user id found in session. Please login again.');
          setIsVitalsLoading(false);
        }
        return;
      }

      try {
        const latest = await fetchLatestVitals(userId);
        if (!mounted) return;

        setVitals(latest);
        setVitalsError(null);
        setIsVitalsLoading(false);
        setHistory((prev) => {
          if (prev[prev.length - 1]?.fetchedAt === latest.fetchedAt) return prev;

          const point: HistoryPoint = {
            fetchedAt: latest.fetchedAt,
            timeLabel: new Date(latest.fetchedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            heart_rate: latest.metrics.heart_rate.value,
            spo2: latest.metrics.spo2.value,
            stress_level: latest.metrics.stress_level.value,
            skin_temperature: latest.metrics.skin_temperature.value,
            movement_score: latest.metrics.movement_score.value,
            sleep_duration: latest.metrics.sleep_duration.value,
          };

          return [...prev, point].slice(-36);
        });
      } catch (err) {
        if (!mounted) return;
        setIsVitalsLoading(false);
        setVitalsError(err instanceof Error ? err.message : 'Failed to load latest vitals');
      }
    };

    poll();
    const timer = setInterval(poll, 5000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const hasHistory = history.length > 0;

  const latestMetricCards = useMemo(() => {
    if (!vitals) return [];
    return METRIC_CONFIG.map((metric) => ({
      ...metric,
      value: vitals.metrics[metric.key].value,
      recordedAt: vitals.metrics[metric.key].recordedAt,
    }));
  }, [vitals]);

  return (
    <div style={{ padding: '28px', maxWidth: '1400px',}}>
      {/* Page Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,96%)', letterSpacing: '-0.02em' }}>
              Live Health Panel
            </h1>
            {(vitals || isVitalsLoading) && (
              <span className="live-pill"><span className="live-dot" style={{ width: '6px', height: '6px' }} />LIVE</span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'hsl(215,15%,44%)', marginTop: '2px' }}>
            Streaming vitals snapshot every 5 seconds from /api/v1/vitals/latest.
          </p>
        </div>
        {vitals && (
          <div style={{ fontSize: '12px', color: 'hsl(215,12%,45%)' }}>
            Last update {timeAgo(vitals.fetchedAt)}
          </div>
        )}
      </div>

      {/* Vitals Error */}
      {vitalsError && (
        <div className="card mb-6" style={{ padding: '14px 16px', borderLeft: '3px solid hsl(0,70%,58%)' }}>
          <div style={{ fontSize: '13px', color: 'hsl(0,72%,70%)', fontWeight: 600 }}>{vitalsError}</div>
        </div>
      )}

      {/* Vitals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {latestMetricCards.map((metric) => (
          <div key={metric.key} className="card" style={{ padding: '16px 18px', borderLeft: `3px solid ${metric.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: 'hsl(215,12%,42%)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {metric.label}
              </span>
              <span style={{ fontSize: '11px', color: 'hsl(215,12%,45%)' }}>{metric.unit}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: metric.color, lineHeight: 1 }}>
                {metric.format(metric.value)}
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: 'hsl(215,12%,45%)' }}>
              Recorded {timeAgo(metric.recordedAt)}
            </div>
          </div>
        ))}

        {isVitalsLoading && latestMetricCards.length === 0 && (
          <div className="card" style={{ padding: '20px', gridColumn: '1 / -1', textAlign: 'center', color: 'hsl(215,12%,45%)' }}>
            <Activity size={18} className="animate-spin" style={{ display: 'inline-block', marginRight: '8px' }} />
            Loading latest vitals...
          </div>
        )}
      </div>

      {/* Vitals Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8"
            style={{ marginTop: '16px' }}>
        {METRIC_CONFIG.map((metric) => (
          <div key={`${metric.key}-chart`} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(215,15%,62%)' }}>{metric.label} Trend</span>
              <span style={{ fontSize: '11px', color: 'hsl(215,12%,45%)' }}>{metric.unit}</span>
            </div>
            <div style={{ width: '100%', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ left: -18, right: 6, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(220,18%,16%)" strokeDasharray="3 3" />
                  <XAxis dataKey="timeLabel" tick={{ fill: 'hsl(215,12%,45%)', fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={24} />
                  <YAxis tick={{ fill: 'hsl(215,12%,45%)', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220,25%,10%)', border: '1px solid hsl(220,18%,18%)', borderRadius: 8 }}
                    labelStyle={{ color: 'hsl(215,12%,65%)' }}
                    formatter={(value) => {
                      const numeric = Array.isArray(value)
                        ? Number(value[0] ?? 0)
                        : Number(value ?? 0);
                      return [metric.format(numeric), metric.label] as [string, string];
                    }}
                  />
                  <Line type="monotone" dataKey={metric.key} stroke={metric.color} strokeWidth={2.2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {!hasHistory && <div style={{ marginTop: '8px', fontSize: '11px', color: 'hsl(215,12%,45%)' }}>Waiting for samples...</div>}
          </div>
        ))}
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} style={{ color: 'hsl(0,70%,55%)' }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,60%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Alerts ({activeAlerts.length})
            </h2>
            <Link href="/alerts" style={{ marginLeft: 'auto', fontSize: '12px', color: 'hsl(199,70%,55%)' }}>
              View all <ChevronRight size={11} style={{ display: 'inline' }} />
            </Link>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: activeAlerts.length > 1 ? '1fr 1fr' : '1fr' }}>
            {activeAlerts.slice(0, 4).map(alert => (
              <AlertBanner key={alert.id} alert={alert} onClick={() => setSelectedAlert(alert.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Alert Drawer */}
      {selectedAlert && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setSelectedAlert(null)}
          />
          <AlertDetailDrawer alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
        </>
      )}
    </div>
  );
}
