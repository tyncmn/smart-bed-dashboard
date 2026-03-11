'use client';

import React from 'react';
import type { AIAnalysis } from '@/types/sleep-dashboard';

function statusColor(status: string): string {
  switch (status) {
    case 'ok':       return 'hsl(152,69%,48%)';
    case 'warning':  return 'hsl(45,95%,55%)';
    case 'critical': return 'hsl(0,70%,58%)';
    default:         return 'hsl(215,12%,50%)';
  }
}

function severityColor(severity: string): string {
  switch (severity) {
    case 'info':     return 'hsl(199,89%,55%)';
    case 'warning':  return 'hsl(45,95%,55%)';
    case 'critical': return 'hsl(0,70%,58%)';
    default:         return 'hsl(215,12%,50%)';
  }
}

interface Props {
  analysis: AIAnalysis | null;
}

export function AIAnalysisPanel({ analysis }: Props) {
  if (!analysis) {
    return (
      <div
        style={{
          padding: '20px 24px',
          background: 'hsl(220,22%,10%)',
          border: '1px dashed hsl(220,18%,22%)',
          borderRadius: '12px',
          color: 'hsl(215,15%,44%)',
          fontSize: '13px',
          textAlign: 'center',
        }}
      >
        AI analysis not configured — enable <code style={{ fontSize: '12px', color: 'hsl(199,89%,50%)' }}>OPENAI_API_KEY</code> on the server.
      </div>
    );
  }

  const sc = statusColor(analysis.overall_status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: '11px', fontWeight: 700,
            color: sc,
            background: `${sc}18`,
            border: `1px solid ${sc}35`,
            padding: '3px 10px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {analysis.overall_status}
        </span>
        <span
          style={{
            fontSize: '11px', fontWeight: 600,
            color: 'hsl(270,70%,68%)',
            background: 'hsla(270,70%,68%,0.1)',
            padding: '3px 10px',
            borderRadius: '6px',
            textTransform: 'capitalize',
          }}
        >
          Sleep State: {analysis.sleep_state}
        </span>
      </div>

      {/* Analysis */}
      <p
        style={{
          fontSize: '13px',
          lineHeight: '1.7',
          color: 'hsl(215,12%,65%)',
          margin: 0,
          padding: '14px 16px',
          background: 'hsl(220,22%,11%)',
          borderRadius: '8px',
          border: '1px solid hsl(220,18%,16%)',
        }}
      >
        {analysis.analysis}
      </p>

      {/* AI health alerts */}
      {analysis.health_alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Alerts</div>
          {analysis.health_alerts.map((a, i) => {
            const c = severityColor(a.severity);
            return (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  background: `${c}0d`,
                  border: `1px solid ${c}28`,
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '10px', fontWeight: 700,
                      color: c,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {a.severity}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(210,20%,80%)' }}>{a.title}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'hsl(215,12%,55%)' }}>{a.detail}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Emergency actions */}
      {analysis.emergency_actions.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            background: 'hsla(0,70%,55%,0.08)',
            border: '1px solid hsla(0,70%,55%,0.25)',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(0,70%,64%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Emergency Actions
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            {analysis.emergency_actions.map((action, i) => (
              <li key={i} style={{ fontSize: '12px', color: 'hsl(0,60%,72%)', marginBottom: '4px' }}>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Medicine suggestions */}
      {analysis.medicine_suggestions.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Medicine Suggestions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {analysis.medicine_suggestions.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  background: 'hsl(220,22%,11%)',
                  border: '1px solid hsl(220,18%,18%)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(199,89%,60%)', marginBottom: '2px' }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: 'hsl(215,12%,55%)' }}>{m.purpose}</div>
                {m.note && <div style={{ fontSize: '11px', color: 'hsl(215,12%,40%)', marginTop: '2px' }}>{m.note}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle suggestions */}
      {analysis.lifestyle_suggestions.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Lifestyle Suggestions
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            {analysis.lifestyle_suggestions.map((s, i) => (
              <li key={i} style={{ fontSize: '12px', color: 'hsl(215,12%,55%)', marginBottom: '4px' }}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <p
        style={{
          fontSize: '11px',
          color: 'hsl(215,12%,35%)',
          margin: 0,
          padding: '10px 14px',
          background: 'hsl(220,22%,9%)',
          borderRadius: '6px',
          border: '1px solid hsl(220,18%,14%)',
          lineHeight: '1.6',
        }}
      >
        {analysis.disclaimer}
      </p>
    </div>
  );
}
