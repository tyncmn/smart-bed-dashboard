'use client';

import React from 'react';
import type { SleepDashboardSummary } from '@/types/sleep-dashboard';
import { Moon, Clock, Layers, AlertTriangle } from 'lucide-react';

function qualityColor(score: number): string {
  if (score >= 80) return 'hsl(152,69%,48%)';
  if (score >= 60) return 'hsl(45,95%,55%)';
  if (score >= 40) return 'hsl(25,90%,55%)';
  return 'hsl(0,70%,58%)';
}

interface Props {
  summary: SleepDashboardSummary | null;
}

export function SleepSummaryCards({ summary }: Props) {
  if (!summary) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: 'hsl(215,15%,44%)',
          fontSize: '14px',
          background: 'hsl(220,22%,11%)',
          borderRadius: '12px',
          border: '1px solid hsl(220,18%,18%)',
        }}
      >
        No sleep sessions recorded yet.
      </div>
    );
  }

  const qColor = qualityColor(summary.avg_quality_score);
  const disturbedRatio = summary.total_nights > 0
    ? summary.disturbed_nights / summary.total_nights
    : 0;

  const cards = [
    {
      label: 'Avg Quality Score',
      value: `${Math.round(summary.avg_quality_score)}`,
      suffix: '/ 100',
      color: qColor,
      icon: Moon,
    },
    {
      label: 'Avg Duration',
      value: `${Math.round(summary.avg_duration_mins)}`,
      suffix: 'min / night',
      color: 'hsl(199,89%,60%)',
      icon: Clock,
    },
    {
      label: 'Total Nights',
      value: `${summary.total_nights}`,
      suffix: `over ${summary.period_days} days`,
      color: 'hsl(270,70%,68%)',
      icon: Layers,
    },
    {
      label: 'Disturbed Nights',
      value: `${summary.disturbed_nights}`,
      suffix: `of ${summary.total_nights}`,
      color: disturbedRatio > 0.33 ? 'hsl(0,70%,58%)' : 'hsl(152,69%,48%)',
      icon: AlertTriangle,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}
    >
      {cards.map(({ label, value, suffix, color, icon: Icon }) => (
        <div
          key={label}
          style={{
            background: 'hsl(220,22%,11%)',
            border: `1px solid ${color}30`,
            borderRadius: '12px',
            padding: '20px 22px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* accent top bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: color,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <Icon size={14} style={{ color }} />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'hsl(215,12%,45%)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span
              style={{
                fontSize: '30px',
                fontWeight: 700,
                color,
                fontFamily: 'JetBrains Mono, monospace',
                lineHeight: 1,
              }}
            >
              {value}
            </span>
            <span style={{ fontSize: '12px', color: 'hsl(215,12%,45%)' }}>
              {suffix}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
