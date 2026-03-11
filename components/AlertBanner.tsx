'use client';

import React from 'react';
import { Alert } from '@/lib/types';
import { RiskBadge } from './RiskBadge';
import { timeAgo, riskColor } from '@/lib/utils';
import { X, AlertOctagon, AlertTriangle, Info } from 'lucide-react';

interface AlertBannerProps {
  alert: Alert;
  onDismiss?: () => void;
  onClick?: () => void;
}

export function AlertBanner({ alert, onDismiss, onClick }: AlertBannerProps) {
  const Icon = alert.riskLevel === 'critical' ? AlertOctagon
    : alert.riskLevel === 'high' ? AlertTriangle : Info;
  const accentColor = riskColor(alert.riskLevel);
  const status = alert.isAcknowledged ? 'acknowledged' : 'active';

  return (
    <div
      className="relative flex items-start gap-4 rounded-xl border cursor-pointer hover:brightness-110 transition-all duration-150 fade-in-up"
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, hsla(220,22%,11%,0.95), hsla(220,22%,9%,0.95))`,
        borderColor: accentColor + '40',
        padding: '18px 20px',
        boxShadow: alert.riskLevel === 'critical' ? `0 0 24px ${accentColor}25` : 'none',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
        background: accentColor, borderRadius: '12px 0 0 12px',
      }} />

      <div style={{ color: accentColor, marginTop: '2px', flexShrink: 0 }}>
        <Icon size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span style={{ fontWeight: 600, fontSize: '14px', color: 'hsl(210,20%,94%)' }}>
            {alert.title}
          </span>
          <RiskBadge level={alert.riskLevel} size="sm" showIcon={false} />
          <span style={{ color: 'hsl(215,12%,45%)', fontSize: '11px', marginLeft: 'auto' }}>
            {timeAgo(alert.createdAt)}
          </span>
        </div>

        <p style={{ color: 'hsl(215,15%,60%)', fontSize: '13px', lineHeight: 1.6 }}>
          {alert.description}
        </p>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: accentColor, fontWeight: 600 }}>
            {alert.metric}: {alert.currentValue}
          </span>
          <span style={{ color: 'hsl(215,12%,42%)', fontSize: '12px' }}>
            Expected: {alert.expectedMin}–{alert.expectedMax}
          </span>
          <span style={{ color: 'hsl(215,12%,42%)', fontSize: '12px' }}>
            Risk: {alert.riskPercentage.toFixed(1)}%
          </span>
          <span style={{
            fontSize: '12px', fontWeight: 600,
            color: status === 'active' ? 'hsl(0,70%,60%)' : 'hsl(152,65%,45%)',
          }}>
            ● {status.toUpperCase()}
          </span>
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          style={{ color: 'hsl(215,12%,40%)', flexShrink: 0 }}
          className="hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
