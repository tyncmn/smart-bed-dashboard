'use client';

import React from 'react';
import type { Predictions } from '@/types/sleep-dashboard';
import { QualityForecastChart } from './QualityForecastChart';

function riskColor(risk: string): string {
  switch (risk) {
    case 'normal':   return 'hsl(152,69%,48%)';
    case 'mild':     return 'hsl(45,95%,55%)';
    case 'high':     return 'hsl(25,90%,55%)';
    case 'critical': return 'hsl(0,70%,58%)';
    default:         return 'hsl(215,12%,50%)';
  }
}

function qualityColor(score: number): string {
  if (score >= 80) return 'hsl(152,69%,48%)';
  if (score >= 60) return 'hsl(45,95%,55%)';
  if (score >= 40) return 'hsl(25,90%,55%)';
  return 'hsl(0,70%,58%)';
}

const TREND_DISPLAY: Record<string, { label: string; arrow: string; color: string }> = {
  improving: { label: 'Improving',  arrow: '↑', color: 'hsl(152,69%,48%)' },
  stable:    { label: 'Stable',     arrow: '→', color: 'hsl(215,12%,55%)' },
  declining: { label: 'Declining',  arrow: '↓', color: 'hsl(0,70%,58%)' },
};

interface Props {
  predictions: Predictions;
}

export function PredictionsPanel({ predictions }: Props) {
  const qColor  = qualityColor(predictions.next_night_quality);
  const rColor  = riskColor(predictions.predicted_risk_level);
  const trend   = TREND_DISPLAY[predictions.trend_direction] ?? TREND_DISPLAY.stable;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {/* Next Night Quality */}
        <div
          style={{
            background: 'hsl(220,22%,11%)',
            border: `1px solid ${qColor}28`,
            borderRadius: '10px',
            padding: '16px 18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: qColor, opacity: 0.55 }} />
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Next Night Quality
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: qColor, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
              {Math.round(predictions.next_night_quality)}
            </span>
            <span style={{ fontSize: '12px', color: 'hsl(215,12%,45%)' }}>/ 100</span>
          </div>
        </div>

        {/* Trend Direction */}
        <div
          style={{
            background: 'hsl(220,22%,11%)',
            border: `1px solid ${trend.color}28`,
            borderRadius: '10px',
            padding: '16px 18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: trend.color, opacity: 0.55 }} />
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Trend
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px', color: trend.color, lineHeight: 1 }}>{trend.arrow}</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: trend.color }}>{trend.label}</span>
          </div>
        </div>

        {/* Predicted Risk */}
        <div
          style={{
            background: 'hsl(220,22%,11%)',
            border: `1px solid ${rColor}28`,
            borderRadius: '10px',
            padding: '16px 18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: rColor, opacity: 0.55 }} />
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Predicted Risk
          </div>
          <span
            style={{
              display: 'inline-block',
              fontSize: '13px', fontWeight: 700,
              color: rColor,
              background: `${rColor}18`,
              border: `1px solid ${rColor}30`,
              padding: '4px 12px',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {predictions.predicted_risk_level}
          </span>
        </div>
      </div>

      {/* Forecast chart */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          7-Night Quality Forecast
        </div>
        <QualityForecastChart forecast={predictions.quality_forecast} />
      </div>

      {/* Health risks */}
      {predictions.health_risks.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Identified Health Risks
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {predictions.health_risks.map((risk, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 14px',
                  background: 'hsla(25,90%,55%,0.06)',
                  border: '1px solid hsla(25,90%,55%,0.18)',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: 'hsl(25,90%,60%)', fontSize: '13px', marginTop: '1px' }}>⚠</span>
                <span style={{ fontSize: '13px', color: 'hsl(215,12%,62%)' }}>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
