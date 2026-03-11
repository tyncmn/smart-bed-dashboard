'use client';

import React from 'react';
import type { SleepTimelineEntry } from '@/types/sleep-dashboard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface Props {
  timeline: SleepTimelineEntry[];
}

export function SleepDurationChart({ timeline }: Props) {
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
    date: t.date.slice(5),
    duration: t.duration_mins,
    disturbed: t.is_disturbed,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,18%,16%)" />
        <XAxis
          dataKey="date"
          tick={{ fill: 'hsl(215,12%,45%)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
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
          formatter={(value) => [`${value} min`, 'Duration']}
        />
        <Bar dataKey="duration" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.disturbed ? 'hsl(25,90%,55%)' : 'hsl(199,89%,48%)'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
