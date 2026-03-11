'use client';

import React from 'react';
import { useLatestVitals } from '@/hooks/useLatestVitals';
import type { VitalsMetricKey } from '@/types/vitals';

const METRIC_CONFIG: Array<{
  key: VitalsMetricKey;
  label: string;
  unit: string;
  color: string;
  format: (v: number) => string;
}> = [
  { key: 'heart_rate',               label: 'Heart Rate',   unit: 'bpm',   color: 'hsl(0,80%,60%)',   format: (v) => Math.round(v).toString() },
  { key: 'spo2',                     label: 'SpO2',         unit: '%',     color: 'hsl(199,89%,60%)', format: (v) => Math.round(v).toString() },
  { key: 'stress_level',             label: 'Stress',       unit: '/100',  color: 'hsl(25,90%,60%)',  format: (v) => Math.round(v).toString() },
  { key: 'skin_temperature',         label: 'Skin Temp',    unit: '°C',    color: 'hsl(43,90%,60%)',  format: (v) => v.toFixed(1) },
  { key: 'movement_score',           label: 'Movement',     unit: 'score', color: 'hsl(270,70%,68%)', format: (v) => v.toFixed(2) },
  { key: 'sleep_duration',           label: 'Sleep',        unit: 'min',   color: 'hsl(152,69%,52%)', format: (v) => Math.round(v).toString() },
  { key: 'respiration',              label: 'Respiration',  unit: 'rpm',   color: 'hsl(180,70%,55%)', format: (v) => Math.round(v).toString() },
  { key: 'blood_pressure_systolic',  label: 'BP Systolic',  unit: 'mmHg',  color: 'hsl(340,75%,60%)', format: (v) => Math.round(v).toString() },
  { key: 'blood_pressure_diastolic', label: 'BP Diastolic', unit: 'mmHg',  color: 'hsl(300,65%,60%)', format: (v) => Math.round(v).toString() },
];

interface Props {
  userId: string;
}

export function LiveVitalsPanel({ userId }: Props) {
  const { data, error, loading } = useLatestVitals(userId);

  const statusColor = loading
    ? 'hsl(45,95%,55%)'
    : error
    ? 'hsl(0,70%,58%)'
    : 'hsl(152,69%,48%)';

  return (
    <div>
      {/* Status bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: statusColor,
              display: 'inline-block',
              boxShadow: `0 0 8px ${statusColor}`,
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'hsl(215,12%,50%)',
              letterSpacing: '0.06em',
            }}
          >
            LIVE · UPDATES EVERY 5 s
          </span>
        </div>
        {data && (
          <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)' }}>
            Last fetched: {new Date(data.fetched_at).toLocaleTimeString()}
          </span>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: '10px 14px',
            background: 'hsla(0,70%,55%,0.1)',
            border: '1px solid hsla(0,70%,55%,0.25)',
            borderRadius: '8px',
            color: 'hsl(0,70%,65%)',
            fontSize: '12px',
            marginBottom: '12px',
          }}
        >
          {error}
        </div>
      )}

      {/* Metrics grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
      >
        {METRIC_CONFIG.map(({ key, label, unit, color, format }) => {
          const point = data?.metrics?.[key];
          const hasData = point !== undefined;
          const displayValue = hasData ? format(point!.value) : 'N/A';

          return (
            <div
              key={key}
              style={{
                background: 'hsl(220,22%,10%)',
                border: `1px solid ${hasData ? color : 'hsl(220,18%,18%)'}22`,
                borderRadius: '10px',
                padding: '14px 16px',
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
                  background: hasData ? color : 'hsl(220,18%,22%)',
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'hsl(215,12%,40%)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                }}
              >
                {label}
              </div>
              <div
                style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}
              >
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: hasData ? color : 'hsl(215,12%,32%)',
                    fontFamily: 'JetBrains Mono, monospace',
                    lineHeight: 1,
                  }}
                >
                  {displayValue}
                </span>
                {hasData && (
                  <span style={{ fontSize: '11px', color: 'hsl(215,12%,45%)' }}>
                    {unit}
                  </span>
                )}
              </div>
              {hasData && point?.recorded_at && (
                <div
                  style={{
                    fontSize: '10px',
                    color: 'hsl(215,12%,32%)',
                    marginTop: '4px',
                  }}
                >
                  {new Date(point.recorded_at).toLocaleTimeString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
