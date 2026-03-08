'use client';

import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Area, AreaChart
} from 'recharts';
import { VitalTimePoint } from '@/lib/types';
import { riskColor, formatTime } from '@/lib/utils';

interface LiveLineChartProps {
  data: { timestamp: string; value: number; riskLevel: string; baselineMin?: number; baselineMax?: number }[];
  color: string;
  unit: string;
  label: string;
  baselineMin?: number;
  baselineMax?: number;
  height?: number;
  showGrid?: boolean;
  showArea?: boolean;
  domain?: [number | 'auto', number | 'auto'];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload?: { riskLevel?: string } }[];
  label?: string | number;
  unit: string;
  baselineMin?: number;
  baselineMax?: number;
}

function CustomTooltip({ active, payload, label, unit, baselineMin, baselineMax }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value as number;
  const risk = payload[0].payload?.riskLevel || 'normal';

  return (
    <div style={{
      background: 'hsl(220,22%,12%)',
      border: '1px solid hsl(220,16%,25%)',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '12px',
      minWidth: '160px',
    }}>
      <div style={{ color: 'hsl(215,15%,55%)', marginBottom: '6px' }}>
        {label != null ? (typeof label === 'string' ? label : formatTime(String(label))) : null}
      </div>
      <div style={{ color: riskColor(risk as 'normal' | 'mild' | 'high' | 'critical'), fontWeight: 700, fontSize: '16px', fontFamily: 'JetBrains Mono, monospace' }}>
        {val} <span style={{ fontSize: '12px', fontWeight: 400 }}>{unit}</span>
      </div>
      {baselineMin !== undefined && baselineMax !== undefined && (
        <div style={{ color: 'hsl(215,12%,45%)', marginTop: '4px' }}>
          Baseline: {baselineMin}–{baselineMax} {unit}
        </div>
      )}
      {risk !== 'normal' && (
        <div style={{ color: riskColor(risk as 'normal' | 'mild' | 'high' | 'critical'), marginTop: '2px', fontWeight: 600 }}>
          ⚠ {risk.toUpperCase()}
        </div>
      )}
    </div>
  );
}

export function LiveLineChart({
  data, color, unit, label, baselineMin, baselineMax,
  height = 180, showGrid = true, showArea = true, domain
}: LiveLineChartProps) {
  const formatted = data.map(d => ({
    ...d,
    time: formatTime(d.timestamp),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(220,18%,18%)"
            vertical={false}
          />
        )}
        <XAxis
          dataKey="time"
          tick={{ fill: 'hsl(215,12%,40%)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={Math.floor(data.length / 6)}
        />
        <YAxis
          tick={{ fill: 'hsl(215,12%,40%)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          domain={domain || ['auto', 'auto']}
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip
          content={<CustomTooltip unit={unit} baselineMin={baselineMin} baselineMax={baselineMax} />}
        />
        {baselineMin !== undefined && (
          <ReferenceLine
            y={baselineMin}
            stroke={`${color}40`}
            strokeDasharray="4 4"
            label={{ value: 'Min', position: 'right', fill: `${color}60`, fontSize: 9 }}
          />
        )}
        {baselineMax !== undefined && (
          <ReferenceLine
            y={baselineMax}
            stroke={`${color}40`}
            strokeDasharray="4 4"
            label={{ value: 'Max', position: 'right', fill: `${color}60`, fontSize: 9 }}
          />
        )}
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        {showArea && (
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${label})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: 'hsl(220,22%,12%)', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        )}
        {!showArea && (
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
            isAnimationActive={false}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
