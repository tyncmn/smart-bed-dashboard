'use client';

import React from 'react';
import { useDashboardStore } from '@/lib/store';
import { useRealtimeStatus } from '@/lib/use-realtime';
import { AlertBanner } from '@/components/AlertBanner';
import { AlertDetailDrawer } from '@/components/AlertDetailDrawer';
import { RiskBadge } from '@/components/RiskBadge';
import { riskColor, timeAgo } from '@/lib/utils';
import { Activity, Bell, CheckCircle } from 'lucide-react';
import { acknowledgeAlertApi } from '@/lib/api';

export default function MonitoringPage() {
  useRealtimeStatus(5000);
  const { currentStatus, isLoading, error, selectedAlertId, setSelectedAlert, optimisticAcknowledge } = useDashboardStore();

  const alerts = currentStatus?.alerts ?? [];
  const activeAlerts = alerts.filter(a => !a.isAcknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.isAcknowledged);
  const selectedAlert = selectedAlertId ? alerts.find(a => a.id === selectedAlertId) : null;

  if (isLoading && !currentStatus) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'hsl(215,15%,50%)' }}>
        <Activity className="animate-spin mr-2" size={20} /> Connecting...
      </div>
    );
  }

  return (
    <div style={{ padding: '28px', maxWidth: '1200px' }}>
      {/* Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,96%)', letterSpacing: '-0.02em' }}>Live Monitoring</h1>
            <span className="live-pill"><span className="live-dot" style={{ width: '6px', height: '6px' }} />LIVE</span>
          </div>
          <p style={{ fontSize: '13px', color: 'hsl(215,15%,44%)' }}>
            Real-time alert feed updating every 5 seconds.
            {error && <span style={{ color: 'hsl(25,90%,55%)', marginLeft: '8px' }}>⚠ {error}</span>}
          </p>
        </div>
        {currentStatus && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '10px',
            background: activeAlerts.length > 0 ? 'hsla(0,70%,50%,0.08)' : 'hsla(152,69%,45%,0.08)',
            border: `1px solid ${activeAlerts.length > 0 ? 'hsla(0,70%,50%,0.22)' : 'hsla(152,69%,45%,0.22)'}`,
          }}>
            <Bell size={14} style={{ color: activeAlerts.length > 0 ? 'hsl(0,70%,58%)' : 'hsl(152,69%,45%)' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: activeAlerts.length > 0 ? 'hsl(0,70%,58%)' : 'hsl(152,69%,45%)', fontFamily: 'JetBrains Mono, monospace' }}>
              {activeAlerts.length}
            </span>
            <span style={{ fontSize: '11px', color: 'hsl(215,12%,45%)', marginLeft: '2px' }}>active</span>
          </div>
        )}
      </div>

      {/* Active Alerts */}
      <section className="mb-8">
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,55%)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          Active ({activeAlerts.length})
        </h2>
        {activeAlerts.length === 0 ? (
          <div className="card p-8 text-center">
            <div style={{ fontSize: '14px', color: 'hsl(152,69%,50%)', fontWeight: 600 }}>No active alerts</div>
            <div style={{ fontSize: '12px', color: 'hsl(215,12%,40%)', marginTop: '4px' }}>All metrics within normal range</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <AlertBanner alert={alert} onClick={() => setSelectedAlert(alert.id)} />
                </div>
                <button
                  onClick={async () => {
                    optimisticAcknowledge(alert.id);
                    await acknowledgeAlertApi(alert.id);
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all hover:brightness-110 flex-shrink-0"
                  style={{ background: 'hsla(152,69%,45%,0.12)', border: '1px solid hsla(152,69%,45%,0.3)', color: 'hsl(152,69%,52%)', fontSize: '11px', fontWeight: 600 }}
                >
                  <CheckCircle size={12} /> ACK
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <section>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,55%)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Acknowledged ({acknowledgedAlerts.length})
          </h2>
          <div className="flex flex-col gap-4" style={{ opacity: 0.65 }}>
            {acknowledgedAlerts.map(alert => (
              <AlertBanner key={alert.id} alert={alert} onClick={() => setSelectedAlert(alert.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Alert Drawer */}
      {selectedAlert && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedAlert(null)} />
          <AlertDetailDrawer alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
        </>
      )}
    </div>
  );
}
