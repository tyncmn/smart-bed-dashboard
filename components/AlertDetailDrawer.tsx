'use client';

import React from 'react';
import { Alert } from '@/lib/types';
import { RiskBadge } from './RiskBadge';
import { riskColor, formatDateTime } from '@/lib/utils';
import { X, AlertOctagon, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useDashboardStore } from '@/lib/store';
import { acknowledgeAlertApi } from '@/lib/api';

interface AlertDetailDrawerProps {
  alert: Alert;
  onClose: () => void;
}

export function AlertDetailDrawer({ alert, onClose }: AlertDetailDrawerProps) {
  const { optimisticAcknowledge } = useDashboardStore();
  const accentColor = riskColor(alert.riskLevel);

  const Icon = alert.riskLevel === 'critical' ? AlertOctagon
    : alert.riskLevel === 'high' ? AlertTriangle : Info;

  async function handleAck() {
    optimisticAcknowledge(alert.id);
    await acknowledgeAlertApi(alert.id);
  }

  return (
    <div
      className="fixed top-0 right-0 h-full z-50 slide-in-right"
      style={{
        width: '420px',
        background: 'hsl(220,25%,9%)',
        borderLeft: '1px solid hsl(220,16%,22%)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid hsl(220,16%,18%)',
        background: `linear-gradient(180deg, ${accentColor}10, transparent)`,
      }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Icon size={20} style={{ color: accentColor, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'hsl(210,20%,96%)' }}>
                {alert.title}
              </div>
              <div style={{ fontSize: '11px', color: 'hsl(215,12%,45%)', marginTop: '2px' }}>
                {formatDateTime(alert.createdAt)} · Alert #{alert.id}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'hsl(215,12%,45%)' }} className="hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="mt-3">
          <RiskBadge level={alert.riskLevel} percentage={alert.riskPercentage} size="md" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '20px' }}>

        {/* Description */}
        <section className="mb-5">
          <div className="rounded-xl" style={{
            background: `${accentColor}08`,
            border: `1px solid ${accentColor}25`,
            padding: '14px',
          }}>
            <p style={{ fontSize: '13px', color: 'hsl(215,15%,70%)', lineHeight: 1.7 }}>
              {alert.description}
            </p>
          </div>
        </section>

        {/* Metric Stats */}
        <section className="mb-5">
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
            Measurement Details
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current', value: `${alert.currentValue}`, color: accentColor },
              { label: 'Expected Range', value: `${alert.expectedMin}–${alert.expectedMax}`, color: 'hsl(215,15%,65%)' },
              { label: 'Deviation', value: `${alert.deviation > 0 ? '+' : ''}${alert.deviation}`, color: accentColor },
              { label: 'Risk %', value: `${alert.riskPercentage.toFixed(1)}%`, color: accentColor },
            ].map(({ label, value, color }) => (
              <div key={label} className="card-elevated" style={{ padding: '12px' }}>
                <div style={{ fontSize: '10px', color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                  {label}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Status */}
        <section className="mb-5">
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
            Status
          </h3>
          <div className="flex items-center gap-3">
            <span style={{
              fontSize: '13px', fontWeight: 600,
              color: alert.isAcknowledged ? 'hsl(152,65%,45%)' : 'hsl(0,70%,60%)',
            }}>
              ● {alert.isAcknowledged ? 'ACKNOWLEDGED' : 'ACTIVE'}
            </span>
            {alert.isAcknowledged && alert.acknowledgedBy && (
              <span style={{ fontSize: '12px', color: 'hsl(215,12%,45%)' }}>
                by {alert.acknowledgedBy} · {alert.acknowledgedAt ? formatDateTime(alert.acknowledgedAt) : ''}
              </span>
            )}
          </div>
        </section>

        {/* Actions */}
        {!alert.isAcknowledged && (
          <section className="mb-5">
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
              Actions
            </h3>
            <button
              onClick={handleAck}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:brightness-110"
              style={{ background: 'hsla(152,69%,45%,0.15)', border: '1px solid hsla(152,69%,45%,0.35)', color: 'hsl(152,69%,55%)', fontSize: '13px', fontWeight: 600 }}
            >
              <CheckCircle size={14} /> Acknowledge
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
