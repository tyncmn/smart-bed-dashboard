'use client';

import React, { useState } from 'react';
import { useSleepDashboard } from '@/hooks/useSleepDashboard';
import { SleepSummaryCards }       from './SleepSummaryCards';
import { SleepQualityChart }        from './SleepQualityChart';
import { SleepDurationChart }       from './SleepDurationChart';
import { StageDistributionChart }   from './StageDistributionChart';
import { LiveVitalsPanel }          from './LiveVitalsPanel';
import { HealthAlertsTable }        from './HealthAlertsTable';
import { AIAnalysisPanel }          from './AIAnalysisPanel';
import { PredictionsPanel }         from './PredictionsPanel';
import { RefreshCw, Activity } from 'lucide-react';

const DAYS_OPTIONS = [7, 14, 30] as const;
type DaysOption = (typeof DAYS_OPTIONS)[number];

interface Props {
  userId: string;
}

// ── shared card wrapper ───────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: 'hsl(220,22%,10%)',
        border: '1px solid hsl(220,18%,16%)',
        borderRadius: '14px',
        padding: '24px',
      }}
    >
      <h2
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: 'hsl(215,12%,55%)',
          textTransform: 'uppercase',
          letterSpacing: '0.09em',
          margin: '0 0 18px',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function SleepAnalyticsDashboard({ userId }: Props) {
  const [days, setDays] = useState<DaysOption>(7);
  const { data, error, loading, refresh } = useSleepDashboard(userId, days);

  return (
    <div style={{ padding: '28px', maxWidth: '1400px' }}>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'hsl(210,20%,96%)',
              letterSpacing: '-0.02em',
              marginBottom: '4px',
            }}
          >
            Sleep Analytics Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: 'hsl(215,15%,44%)' }}>
            {data
              ? `${data.period.from.slice(0, 10)} → ${data.period.to.slice(0, 10)}`
              : 'Loading period…'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Days selector */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 700,
                  transition: 'all 0.15s',
                  background: days === d ? 'hsla(199,89%,48%,0.15)' : 'transparent',
                  color: days === d ? 'hsl(199,89%,62%)' : 'hsl(215,12%,45%)',
                  border: `1px solid ${days === d ? 'hsla(199,89%,48%,0.35)' : 'hsl(220,16%,20%)'}`,
                }}
              >
                {d}d
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={refresh}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              background: 'transparent',
              color: 'hsl(215,12%,50%)',
              border: '1px solid hsl(220,16%,20%)',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.15s',
            }}
          >
            <RefreshCw
              size={12}
              style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            background: 'hsla(0,70%,55%,0.1)',
            border: '1px solid hsla(0,70%,55%,0.25)',
            borderRadius: '10px',
            color: 'hsl(0,70%,65%)',
            fontSize: '13px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !data && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            color: 'hsl(215,15%,44%)',
            gap: '10px',
            fontSize: '13px',
          }}
        >
          <Activity size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
          Loading dashboard data…
        </div>
      )}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary KPI cards */}
          <SleepSummaryCards summary={data.summary} />

          {/* Live Vitals */}
          <Section title="Live Vitals">
            <LiveVitalsPanel userId={userId} />
          </Section>

          {/* Quality + Duration charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Section title="Sleep Quality Score — Nightly">
              <SleepQualityChart timeline={data.timeline} />
            </Section>
            <Section title="Sleep Duration — Nightly">
              <SleepDurationChart timeline={data.timeline} />
            </Section>
          </div>

          {/* Stage distribution */}
          <Section title="Sleep Stage Distribution">
            <StageDistributionChart distribution={data.stage_distribution} />
          </Section>

          {/* Predictions */}
          <Section title="Predictions & Forecast">
            <PredictionsPanel predictions={data.predictions} />
          </Section>

          {/* AI Analysis */}
          <Section title="AI Analysis">
            <AIAnalysisPanel analysis={data.ai_analysis} />
          </Section>

          {/* Health alerts table */}
          <Section title={`Health Alerts (${data.health_alerts.length})`}>
            <HealthAlertsTable alerts={data.health_alerts} />
          </Section>
        </div>
      )}
    </div>
  );
}
