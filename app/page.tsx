'use client';

import React from 'react';
import { useDashboardStore } from '@/lib/store';
import { useRealtimeStatus, useSleepSummary } from '@/lib/use-realtime';
import { AlertBanner } from '@/components/AlertBanner';
import { AlertDetailDrawer } from '@/components/AlertDetailDrawer';
import { scoreColor, timeAgo } from '@/lib/utils';
import { Activity, AlertTriangle, ChevronRight, Moon, BarChart3, TrendingUp, Bell } from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  useRealtimeStatus(5000);
  useSleepSummary(7);
  const { currentStatus, sleepSummary, isLoading, error, selectedAlertId, setSelectedAlert } = useDashboardStore();

  const activeAlerts = currentStatus?.alerts.filter(a => !a.isAcknowledged) ?? [];
  const sleep = currentStatus?.sleepSummary ?? sleepSummary;
  const selectedAlert = selectedAlertId ? currentStatus?.alerts.find(a => a.id === selectedAlertId) : null;

  if (isLoading && !currentStatus) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'hsl(215,15%,50%)' }}>
        <Activity size={24} className="animate-spin mr-3" />
        Connecting to server...
      </div>
    );
  }

  if (error && !currentStatus) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: 'hsl(0,70%,60%)' }}>
        <AlertTriangle size={28} />
        <span style={{ fontSize: '14px' }}>{error}</span>
        <span style={{ fontSize: '12px', color: 'hsl(215,12%,45%)' }}>Retrying automatically...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,96%)' }}>
            Overview Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: 'hsl(215,15%,50%)', marginTop: '2px' }}>
            Smart Bed Health Monitoring · MVP
          </p>
        </div>
        {currentStatus && (
          <div className="flex items-center gap-2">
            <span className="live-dot" style={{ background: 'hsl(152,69%,45%)' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(152,69%,52%)' }}>LIVE</span>
          </div>
        )}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={14} style={{ color: 'hsl(0,70%,55%)' }} />
            <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unread Alerts</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: (currentStatus?.unreadAlertCount ?? 0) > 0 ? 'hsl(0,80%,60%)' : 'hsl(152,69%,45%)' }}>
            {currentStatus?.unreadAlertCount ?? 0}
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: 'hsl(25,90%,55%)' }} />
            <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Alerts</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: activeAlerts.length > 0 ? 'hsl(25,90%,55%)' : 'hsl(152,69%,45%)' }}>
            {activeAlerts.length}
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Moon size={14} style={{ color: 'hsl(220,70%,65%)' }} />
            <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sleep Score (Avg)</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: scoreColor(sleep?.averageQualityScore ?? 0) }}>
            {sleep ? Math.round(sleep.averageQualityScore) : '—'}
            <span style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(215,15%,50%)' }}>/100</span>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={14} style={{ color: 'hsl(199,70%,55%)' }} />
            <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Duration</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'hsl(199,70%,55%)' }}>
            {sleep ? sleep.averageDurationHours.toFixed(1) : '—'}
            <span style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(215,15%,50%)' }}>h</span>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} style={{ color: 'hsl(0,70%,55%)' }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,60%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Alerts ({activeAlerts.length})
            </h2>
            <Link href="/alerts" style={{ marginLeft: 'auto', fontSize: '12px', color: 'hsl(199,70%,55%)' }}>
              View all <ChevronRight size={11} style={{ display: 'inline' }} />
            </Link>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: activeAlerts.length > 1 ? '1fr 1fr' : '1fr' }}>
            {activeAlerts.slice(0, 4).map(alert => (
              <AlertBanner key={alert.id} alert={alert} onClick={() => setSelectedAlert(alert.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Sleep Summary Preview */}
      {sleep && sleep.nightly.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Moon size={14} style={{ color: 'hsl(220,70%,60%)' }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,60%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recent Sleep ({sleep.totalNights} nights)
            </h2>
            <Link href="/sleep" style={{ marginLeft: 'auto', fontSize: '12px', color: 'hsl(199,70%,55%)' }}>
              Full analytics <ChevronRight size={11} style={{ display: 'inline' }} />
            </Link>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(sleep.nightly.length, 7)}, 1fr)` }}>
            {sleep.nightly.slice(-7).map(n => (
              <div key={n.date} className="card-elevated text-center" style={{ padding: '14px 8px' }}>
                <div style={{ fontSize: '10px', color: 'hsl(215,12%,40%)', marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
                  {n.date.slice(5)}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: scoreColor(n.qualityScore) }}>
                  {n.qualityScore}
                </div>
                <div style={{ fontSize: '10px', color: 'hsl(215,12%,45%)', marginTop: '4px' }}>
                  {n.durationHours.toFixed(1)}h
                </div>
                {n.disturbanceDetected && (
                  <div style={{ fontSize: '9px', color: 'hsl(25,90%,58%)', marginTop: '2px', fontWeight: 600 }}>
                    DISTURBED
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No alerts state */}
      {activeAlerts.length === 0 && (
        <div className="card p-8 text-center mb-6">
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>&#10003;</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'hsl(152,69%,50%)' }}>All Clear</div>
          <div style={{ fontSize: '13px', color: 'hsl(215,12%,45%)', marginTop: '4px' }}>No active alerts at this time.</div>
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
