'use client';

import React from 'react';
import { Alert } from '@/lib/types';
import { RiskBadge } from './RiskBadge';
import { riskColor, timeAgo, formatDateTime } from '@/lib/utils';
import { X, AlertOctagon, AlertTriangle, Info, CheckCircle, ArrowUpCircle, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useDashboardStore } from '@/lib/store';

interface AlertDetailDrawerProps {
  alert: Alert;
  onClose: () => void;
}

export function AlertDetailDrawer({ alert, onClose }: AlertDetailDrawerProps) {
  const { acknowledgeAlert, escalateAlert, assignAlert } = useDashboardStore();
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const accentColor = riskColor(alert.riskLevel);

  const Icon = alert.riskLevel === 'critical' ? AlertOctagon
    : alert.riskLevel === 'high' ? AlertTriangle : Info;

  function handleAck() {
    acknowledgeAlert(alert.id, 'Current User');
  }
  function handleEscalate() {
    escalateAlert(alert.id, 'Dr. Attending', 'Current User');
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

        {/* Metric Stats */}
        <section className="mb-5">
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
            Measurement Details
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current', value: `${alert.currentValue}`, unit: '', color: accentColor },
              { label: 'Expected Range', value: `${alert.expectedMin}–${alert.expectedMax}`, unit: '', color: 'hsl(215,15%,65%)' },
              { label: 'Deviation', value: `${alert.deviation > 0 ? '+' : ''}${alert.deviation}`, unit: '', color: accentColor },
              { label: 'Risk %', value: `${alert.riskPercentage.toFixed(1)}%`, unit: '', color: accentColor },
            ].map(({ label, value, unit, color }) => (
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

        {/* Root Cause */}
        <section className="mb-5">
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
            Root Cause Explanation
          </h3>
          <div className="rounded-xl" style={{
            background: `${accentColor}08`,
            border: `1px solid ${accentColor}25`,
            padding: '14px',
          }}>
            <p style={{ fontSize: '13px', color: 'hsl(215,15%,70%)', lineHeight: 1.7 }}>
              {alert.rootCauseExplanation}
            </p>
          </div>
        </section>

        {/* Actions */}
        {(alert.status === 'active' || alert.status === 'escalated') && (
          <section className="mb-5">
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
              Actions
            </h3>
            <div className="flex gap-2 flex-wrap">
              {alert.status === 'active' && (
                <button
                  onClick={handleAck}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:brightness-110"
                  style={{ background: 'hsla(152,69%,45%,0.15)', border: '1px solid hsla(152,69%,45%,0.35)', color: 'hsl(152,69%,55%)', fontSize: '13px', fontWeight: 600 }}
                >
                  <CheckCircle size={14} /> Acknowledge
                </button>
              )}
              <button
                onClick={handleEscalate}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:brightness-110"
                style={{ background: 'hsla(25,90%,55%,0.12)', border: '1px solid hsla(25,90%,55%,0.3)', color: 'hsl(25,90%,62%)', fontSize: '13px', fontWeight: 600 }}
              >
                <ArrowUpCircle size={14} /> Escalate
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:brightness-110"
                style={{ background: 'hsla(220,18%,20%,0.6)', border: '1px solid hsl(220,16%,25%)', color: 'hsl(215,15%,60%)', fontSize: '13px', fontWeight: 600 }}
              >
                <UserPlus size={14} /> Assign
              </button>
            </div>
          </section>
        )}

        {/* Escalation History */}
        <section>
          <button
            className="flex items-center gap-2 w-full text-left mb-3"
            onClick={() => setHistoryExpanded(!historyExpanded)}
          >
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Escalation History ({alert.escalationHistory.length})
            </h3>
            {historyExpanded ? <ChevronUp size={12} style={{ color: 'hsl(215,12%,40%)' }} /> : <ChevronDown size={12} style={{ color: 'hsl(215,12%,40%)' }} />}
          </button>
          {historyExpanded && (
            <div className="space-y-2">
              {alert.escalationHistory.map((evt, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(199,70%,50%)', marginTop: '6px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'hsl(215,15%,65%)' }}>
                      <strong style={{ color: 'hsl(210,20%,88%)' }}>{evt.performedBy}</strong> — {evt.action}
                    </div>
                    {evt.note && <div style={{ fontSize: '11px', color: 'hsl(215,12%,45%)', marginTop: '1px' }}>{evt.note}</div>}
                    <div style={{ fontSize: '10px', color: 'hsl(215,12%,35%)', marginTop: '1px' }}>{formatDateTime(evt.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
