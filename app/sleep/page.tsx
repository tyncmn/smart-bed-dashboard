'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/lib/store';
import { useSleepSummary } from '@/lib/use-realtime';
import { scoreColor, sleepStageColor } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Moon, TrendingUp, AlertTriangle, BarChart3, Activity } from 'lucide-react';

export default function SleepPage() {
  const [days, setDays] = useState<7 | 30>(7);
  useSleepSummary(days);
  const { sleepSummary, currentStatus } = useDashboardStore();

  const sleep = sleepSummary ?? currentStatus?.sleepSummary;

  if (!sleep) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'hsl(215,15%,50%)' }}>
        <Activity size={20} className="animate-spin mr-2" /> Loading sleep data...
      </div>
    );
  }

  const summaries = sleep.nightly;

  return (
    <div style={{ padding: '28px', maxWidth: '1200px' }}>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,96%)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Sleep Analytics</h1>
          <p style={{ fontSize: '13px', color: 'hsl(215,15%,44%)' }}>Nightly quality scores, stage distribution, and disturbance trends.</p>
        </div>
        <div className="flex gap-2">
          {([7, 30] as const).map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              style={{
                padding: '6px 16px', borderRadius: '8px', cursor: 'pointer',
                fontSize: '12px', fontWeight: 700, transition: 'all 0.15s',
                background: days === d ? 'hsla(199,89%,48%,0.15)' : 'transparent',
                color: days === d ? 'hsl(199,89%,62%)' : 'hsl(215,12%,45%)',
                border: `1px solid ${days === d ? 'hsla(199,89%,48%,0.35)' : 'hsl(220,16%,20%)'}`,
              }}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: `${days}-Day Avg Score`, value: `${Math.round(sleep.averageQualityScore)}`, suffix: '/ 100', color: scoreColor(sleep.averageQualityScore), border: scoreColor(sleep.averageQualityScore), icon: Moon },
          { label: 'Avg Duration', value: sleep.averageDurationHours.toFixed(1), suffix: 'h / night', color: 'hsl(199,70%,55%)', border: 'hsl(199,70%,55%)', icon: BarChart3 },
          { label: 'Disturbed Nights', value: `${sleep.disturbedNights}`, suffix: `of ${sleep.totalNights}`, color: sleep.disturbedNights > 2 ? 'hsl(25,90%,55%)' : 'hsl(152,69%,45%)', border: sleep.disturbedNights > 2 ? 'hsl(25,90%,55%)' : 'hsl(152,69%,45%)', icon: AlertTriangle },
          { label: 'Quality Trend', value: summaries.length >= 2 ? (summaries[summaries.length - 1].qualityScore > summaries[0].qualityScore ? '↑' : '↓') : '—', suffix: 'vs first night', color: summaries.length >= 2 ? (summaries[summaries.length - 1].qualityScore > summaries[0].qualityScore ? 'hsl(152,69%,48%)' : 'hsl(0,70%,58%)') : 'hsl(215,12%,50%)', border: 'hsl(199,70%,55%)', icon: TrendingUp },
        ].map(({ label, value, suffix, color, border, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: '16px 18px', borderLeft: `3px solid ${border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
              <Icon size={12} style={{ color: 'hsl(215,12%,42%)', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: 'hsl(215,12%,42%)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color, lineHeight: 1 }}>{value}</span>
              {suffix && <span style={{ fontSize: '12px', fontWeight: 400, color: 'hsl(215,15%,42%)' }}>{suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Quality trend chart */}
      {summaries.length > 0 && (
        <div className="card p-5 mb-6">
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(215,15%,65%)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Sleep Quality Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={summaries} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,18%,18%)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'hsl(215,12%,40%)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fill: 'hsl(215,12%,40%)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: 'hsl(220,22%,12%)', border: '1px solid hsl(220,16%,25%)', borderRadius: '8px', color: 'hsl(210,20%,96%)', fontSize: '12px' }}
                formatter={(value) => (typeof value === 'number' ? [`${value}/100`, 'Quality Score'] : [String(value ?? ''), 'Quality Score'])}
              />
              <Bar dataKey="qualityScore" radius={[4, 4, 0, 0]}>
                {summaries.map((s, i) => (
                  <Cell key={i} fill={scoreColor(s.qualityScore)} fillOpacity={s.disturbanceDetected ? 0.6 : 0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-3 mt-2" style={{ fontSize: '11px', color: 'hsl(215,12%,40%)' }}>
            <span>● Full bar = no disturbance</span>
            <span>◐ Faded bar = disturbance detected</span>
          </div>
        </div>
      )}

      {/* Nightly Summary Table */}
      {summaries.length > 0 && (
        <div className="card overflow-hidden">
          <div style={{ padding: '12px 20px', borderBottom: '1px solid hsl(220,18%,18%)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'hsl(215,15%,55%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Nightly Summary Table
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'hsl(220,22%,11%)' }}>
                {['Date', 'Quality Score', 'Duration', 'Deep %', 'REM %', 'Interruptions', 'Disturbance'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaries.map((s, i) => (
                <tr key={s.date} style={{ borderTop: '1px solid hsl(220,18%,14%)', background: i % 2 === 0 ? 'transparent' : 'hsla(220,22%,10%,0.4)' }}>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: 'hsl(215,15%,65%)', fontFamily: 'JetBrains Mono, monospace' }}>{s.date}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: scoreColor(s.qualityScore), fontFamily: 'JetBrains Mono, monospace' }}>{s.qualityScore}</span>
                    <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)' }}>/100</span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: 'hsl(199,70%,60%)', fontFamily: 'JetBrains Mono, monospace' }}>{s.durationHours}h</td>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: sleepStageColor('deep'), fontFamily: 'JetBrains Mono, monospace' }}>{s.deepSleepPct}%</td>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: sleepStageColor('rem'), fontFamily: 'JetBrains Mono, monospace' }}>{s.remSleepPct}%</td>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: s.interruptions > 2 ? 'hsl(25,90%,55%)' : 'hsl(215,15%,60%)', fontFamily: 'JetBrains Mono, monospace' }}>{s.interruptions}</td>
                  <td style={{ padding: '10px 16px' }}>
                    {s.disturbanceDetected
                      ? <span style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(25,90%,58%)', background: 'hsla(25,90%,50%,0.12)', padding: '2px 8px', borderRadius: '99px', border: '1px solid hsla(25,90%,50%,0.25)' }}>Detected</span>
                      : <span style={{ fontSize: '11px', color: 'hsl(152,65%,45%)' }}>Clear</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
