'use client';

import React from 'react';
import type { SleepTimelineEntry } from '@/types/sleep-dashboard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface Props {
  timeline: SleepTimelineEntry[];
}

export function SleepQualityChart({ timeline }: Props) {
  if (timeline.length === 0) {
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
        No data available for this period.
      </div>
    );
  }

  const data = timeline.map((t) => ({
    date: t.date.slice(5),  // MM-DD
    score: t.quality_score,
    disturbed: t.is_disturbed,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,18%,16%)" />
        <XAxis
          dataKey="date"
          tick={{ fill: 'hsl(215,12%,45%)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: 'hsl(215,12%,45%)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(220,22%,13%)',
            border: '1px solid hsl(220,18%,22%)',
            borderRadius: '8px',
            fontSize: 12,
          }}
          labelStyle={{ color: 'hsl(210,20%,80%)' }}
          formatter={(value) => [`${value}`, 'Quality Score']}
        />
        {/* thresholds */}
        <ReferenceLine y={80} stroke="hsl(152,69%,40%)" strokeDasharray="4 4" strokeOpacity={0.4} />
        <ReferenceLine y={60} stroke="hsl(45,95%,45%)" strokeDasharray="4 4" strokeOpacity={0.4} />
        <ReferenceLine y={40} stroke="hsl(25,90%,45%)" strokeDasharray="4 4" strokeOpacity={0.4} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="hsl(199,89%,55%)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'hsl(199,89%,55%)', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
