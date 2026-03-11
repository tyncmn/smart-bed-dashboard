'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/lib/store';
import { useRealtimeStatus } from '@/lib/use-realtime';
import { AlertDetailDrawer } from '@/components/AlertDetailDrawer';
import { RiskBadge } from '@/components/RiskBadge';
import { riskColor, timeAgo } from '@/lib/utils';
import { RiskLevel } from '@/lib/types';
import { acknowledgeAlertApi } from '@/lib/api';
import { AlertOctagon, AlertTriangle, Info, Filter, CheckCircle } from 'lucide-react';

type FilterRisk = 'all' | RiskLevel;
type FilterStatus = 'all' | 'active' | 'acknowledged';

export default function AlertsPage() {
  useRealtimeStatus(5000);
  const { currentStatus, optimisticAcknowledge, setSelectedAlert, selectedAlertId } = useDashboardStore();
  const [riskFilter, setRiskFilter] = useState<FilterRisk>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const alerts = currentStatus?.alerts ?? [];

  const filtered = alerts.filter(a => {
    const riskOk = riskFilter === 'all' || a.riskLevel === riskFilter;
    const statusOk = statusFilter === 'all'
      || (statusFilter === 'active' && !a.isAcknowledged)
      || (statusFilter === 'acknowledged' && a.isAcknowledged);
    return riskOk && statusOk;
  });

  const selectedAlert = selectedAlertId ? alerts.find(a => a.id === selectedAlertId) : null;

  const counts = {
    critical: alerts.filter(a => a.riskLevel === 'critical').length,
    high: alerts.filter(a => a.riskLevel === 'high').length,
    mild: alerts.filter(a => a.riskLevel === 'mild').length,
    active: alerts.filter(a => !a.isAcknowledged).length,
    acknowledged: alerts.filter(a => a.isAcknowledged).length,
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,96%)', marginBottom: '4px' }}>Alert Center</h1>
      <p style={{ fontSize: '13px', color: 'hsl(215,15%,50%)', marginBottom: '24px' }}>Manage active alerts and acknowledge events.</p>

      {/* Summary tiles */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Critical', count: counts.critical, color: 'hsl(0,80%,55%)' },
          { label: 'High', count: counts.high, color: 'hsl(25,90%,55%)' },
          { label: 'Mild', count: counts.mild, color: 'hsl(43,90%,55%)' },
          { label: 'Active', count: counts.active, color: 'hsl(0,70%,55%)' },
          { label: 'Acknowledged', count: counts.acknowledged, color: 'hsl(152,65%,45%)' },
        ].map(({ label, count, color }) => (
          <div key={label} className="card-elevated text-center" style={{ padding: '14px 8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>{count}</div>
            <div style={{ fontSize: '11px', color: 'hsl(215,12%,45%)', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1" style={{ color: 'hsl(215,12%,45%)', fontSize: '12px' }}>
          <Filter size={12} /> Risk Level:
        </div>
        {(['all', 'critical', 'high', 'mild', 'normal'] as FilterRisk[]).map(f => (
          <button
            key={f}
            onClick={() => setRiskFilter(f)}
            className="px-3 py-1 rounded-lg transition-all"
            style={{
              fontSize: '12px', fontWeight: 600,
              background: riskFilter === f ? (f === 'all' ? 'hsl(220,22%,20%)' : `${riskColor(f as RiskLevel)}20`) : 'transparent',
              color: riskFilter === f ? (f === 'all' ? 'hsl(215,15%,75%)' : riskColor(f as RiskLevel)) : 'hsl(215,12%,45%)',
              border: `1px solid ${riskFilter === f ? (f === 'all' ? 'hsl(220,16%,28%)' : `${riskColor(f as RiskLevel)}40`) : 'hsl(220,16%,20%)'}`,
            }}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="flex items-center gap-1 ml-4" style={{ color: 'hsl(215,12%,45%)', fontSize: '12px' }}>
          Status:
        </div>
        {(['all', 'active', 'acknowledged'] as FilterStatus[]).map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className="px-3 py-1 rounded-lg transition-all"
            style={{
              fontSize: '12px', fontWeight: 600,
              background: statusFilter === f ? 'hsl(220,22%,20%)' : 'transparent',
              color: statusFilter === f ? 'hsl(215,15%,75%)' : 'hsl(215,12%,45%)',
              border: `1px solid ${statusFilter === f ? 'hsl(220,16%,28%)' : 'hsl(220,16%,20%)'}`,
            }}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert Table */}
      <div className="card overflow-hidden">
        <div style={{ padding: '12px 20px', borderBottom: '1px solid hsl(220,18%,18%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(215,15%,55%)' }}>
            {filtered.length} alert{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div>
          {filtered.length === 0 && (
            <div className="text-center" style={{ padding: '40px', color: 'hsl(215,12%,40%)', fontSize: '14px' }}>
              No alerts match current filters.
            </div>
          )}
          {filtered.map((alert, i) => {
            const accentColor = riskColor(alert.riskLevel);
            const Icon = alert.riskLevel === 'critical' ? AlertOctagon : alert.riskLevel === 'high' ? AlertTriangle : Info;
            const status = alert.isAcknowledged ? 'acknowledged' : 'active';
            return (
              <div
                key={alert.id}
                className="flex items-center gap-4 cursor-pointer hover:brightness-110 transition-all"
                onClick={() => setSelectedAlert(alert.id)}
                style={{
                  padding: '14px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid hsl(220,18%,15%)' : 'none',
                  borderLeft: `3px solid ${accentColor}`,
                  background: selectedAlertId === alert.id ? `${accentColor}08` : 'transparent',
                }}
              >
                <Icon size={16} style={{ color: accentColor, flexShrink: 0 }} />

                <div style={{ flex: '0 0 200px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(210,20%,92%)' }}>{alert.title}</div>
                  <div style={{ fontSize: '11px', color: 'hsl(215,12%,45%)' }}>{alert.type}</div>
                </div>

                <div style={{ flex: '0 0 120px' }}>
                  <RiskBadge level={alert.riskLevel} size="sm" showIcon={false} />
                </div>

                <div style={{ flex: '0 0 140px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: accentColor }}>
                  {alert.metric}: {alert.currentValue}
                  <div style={{ color: 'hsl(215,12%,40%)', fontSize: '10px', fontFamily: 'Inter, sans-serif', marginTop: '1px' }}>
                    Expected: {alert.expectedMin}–{alert.expectedMax}
                  </div>
                </div>

                <div style={{ flex: '0 0 80px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700,
                    color: status === 'active' ? 'hsl(0,70%,60%)' : 'hsl(152,65%,45%)',
                  }}>
                    {status.toUpperCase()}
                  </span>
                </div>

                <div style={{ flex: 1, textAlign: 'right', fontSize: '11px', color: 'hsl(215,12%,40%)' }}>
                  {timeAgo(alert.createdAt)}
                </div>

                {!alert.isAcknowledged && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      optimisticAcknowledge(alert.id);
                      await acknowledgeAlertApi(alert.id);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
                    style={{ background: 'hsla(152,69%,45%,0.12)', border: '1px solid hsla(152,69%,45%,0.3)', color: 'hsl(152,69%,52%)', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}
                  >
                    <CheckCircle size={11} /> ACK
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedAlert && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedAlert(null)} />
          <AlertDetailDrawer alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
        </>
      )}
    </div>
  );
}
