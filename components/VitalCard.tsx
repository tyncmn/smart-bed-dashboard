'use client';

import React, { useState } from 'react';
import { VitalRiskDetail, RiskLevel } from '@/lib/types';
import { RiskBadge } from './RiskBadge';
import { cn, riskColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';

interface VitalCardProps {
  label: string;
  value: number | string;
  unit: string;
  icon: React.ReactNode;
  accentColor: string;
  riskDetail?: VitalRiskDetail;
  trend?: 'up' | 'down' | 'stable';
  isLive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function VitalCard({
  label, value, unit, icon, accentColor, riskDetail,
  trend = 'stable', isLive = true, onClick, className
}: VitalCardProps) {
  const [hovered, setHovered] = useState(false);
  const risk = riskDetail?.riskLevel || 'normal';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = risk !== 'normal' && trend === 'up' ? riskColor(risk) : risk !== 'normal' && trend === 'down' ? riskColor(risk) : 'hsl(215, 12%, 45%)';

  return (
    <div
      className={cn('card relative cursor-pointer group transition-all duration-200', className)}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderColor: hovered ? accentColor + '60' : undefined,
        boxShadow: hovered ? `0 0 24px ${accentColor}20` : undefined,
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div style={{ color: accentColor }}>
              {icon}
            </div>
            <span style={{ color: 'hsl(215, 15%, 65%)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isLive && <span className="live-dot" />}
            {riskDetail && risk !== 'normal' && (
              <RiskBadge level={risk} size="sm" showIcon={false} />
            )}
          </div>
        </div>

        {/* Value */}
        <div className="flex items-end gap-2 mb-3">
          <span style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            lineHeight: 1,
            color: risk !== 'normal' ? riskColor(risk) : 'hsl(210, 20%, 96%)',
            fontVariantNumeric: 'tabular-nums',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            {value}
          </span>
          <span style={{ color: 'hsl(215, 15%, 55%)', fontSize: '14px', marginBottom: '4px' }}>{unit}</span>
          <div className="flex items-center ml-auto" style={{ color: trendColor }}>
            <TrendIcon size={16} />
          </div>
        </div>

        {/* Baseline comparison */}
        {riskDetail && (
          <div style={{
            background: 'hsla(220, 22%, 8%, 0.6)',
            borderRadius: '6px',
            padding: '8px 10px',
            border: '1px solid hsl(220, 18%, 18%)',
          }}>
            <div className="flex justify-between items-center" style={{ fontSize: '11px' }}>
              <span style={{ color: 'hsl(215, 12%, 45%)' }}>Baseline</span>
              <span style={{ color: 'hsl(215, 15%, 60%)', fontFamily: 'JetBrains Mono, monospace' }}>
                {riskDetail.normalMin}–{riskDetail.normalMax} {riskDetail.unit}
              </span>
            </div>
            {riskDetail.deviation !== 0 && (
              <div className="flex justify-between items-center mt-1" style={{ fontSize: '11px' }}>
                <span style={{ color: 'hsl(215, 12%, 45%)' }}>Deviation</span>
                <span style={{
                  color: riskColor(risk),
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                }}>
                  {riskDetail.deviation > 0 ? '+' : ''}{riskDetail.deviation.toFixed(1)} ({riskDetail.riskPercentage.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
        )}

        {/* Click hint */}
        {onClick && (
          <div
            className="flex items-center gap-1 mt-3 transition-opacity"
            style={{ opacity: hovered ? 1 : 0, color: 'hsl(215, 12%, 45%)', fontSize: '11px' }}
          >
            <span>View trend</span>
            <ChevronRight size={12} />
          </div>
        )}
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '2px', borderRadius: '0 0 0.75rem 0.75rem',
          background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)`,
          opacity: risk !== 'normal' ? 1 : 0.4,
          transition: 'opacity 0.2s',
        }}
      />
    </div>
  );
}
