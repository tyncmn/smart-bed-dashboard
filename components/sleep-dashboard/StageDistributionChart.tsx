'use client';

import React from 'react';
import type { StageDistributionEntry } from '@/types/sleep-dashboard';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const STAGE_COLORS: Record<string, string> = {
  deep: 'hsl(220,70%,55%)',
  rem: 'hsl(270,70%,65%)',
  light: 'hsl(199,89%,55%)',
  awake: 'hsl(0,70%,55%)',
};

interface Props {
  distribution: StageDistributionEntry[];
}

export function StageDistributionChart({ distribution }: Props) {
  if (distribution.length === 0) {
    return (
      <div
        style={{
          height: 240,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'hsl(215,15%,44%)',
          fontSize: '13px',
        }}
      >
        Insufficient movement data.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={distribution}
          dataKey="percentage"
          nameKey="stage"
          cx="50%"
          cy="45%"
          outerRadius={80}
          innerRadius={42}
          paddingAngle={2}
        >
          {distribution.map((entry, index) => (
            <Cell
              key={index}
              fill={STAGE_COLORS[entry.stage] ?? 'hsl(215,12%,45%)'}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'hsl(220,22%,13%)',
            border: '1px solid hsl(220,18%,22%)',
            borderRadius: '8px',
            fontSize: 12,
          }}
          formatter={(value, name) => [
            `${value}%  (~${distribution.find((d) => d.stage === name)?.avg_minutes ?? 0} min)`,
            String(name).charAt(0).toUpperCase() + String(name).slice(1),
          ]}
        />
        <Legend
          formatter={(value) => (
            <span
              style={{
                fontSize: 11,
                color: 'hsl(215,12%,55%)',
                textTransform: 'capitalize',
              }}
            >
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
