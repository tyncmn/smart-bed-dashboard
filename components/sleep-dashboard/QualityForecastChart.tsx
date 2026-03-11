'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface Props {
  /** 7-element array; index 0 = tomorrow */
  forecast: number[];
}

export function QualityForecastChart({ forecast }: Props) {
  const data = forecast.map((score, i) => ({
    day: i === 0 ? 'Tomorrow' : `Day +${i + 1}`,
    score,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(199,89%,48%)" stopOpacity={0.28} />
            <stop offset="95%" stopColor="hsl(199,89%,48%)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,18%,16%)" />
        <XAxis
          dataKey="day"
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
          formatter={(value) => [`${value}`, 'Predicted Quality']}
        />
        <ReferenceLine y={80} stroke="hsl(152,69%,40%)" strokeDasharray="4 4" strokeOpacity={0.35} />
        <ReferenceLine y={60} stroke="hsl(45,95%,45%)" strokeDasharray="4 4" strokeOpacity={0.35} />
        <Area
          type="monotone"
          dataKey="score"
          stroke="hsl(199,89%,55%)"
          strokeWidth={2}
          fill="url(#forecastGrad)"
          dot={{ r: 3, fill: 'hsl(199,89%,55%)', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
