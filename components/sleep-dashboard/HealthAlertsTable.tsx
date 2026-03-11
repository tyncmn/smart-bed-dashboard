'use client';

import React from 'react';
import type { HealthAlert } from '@/types/sleep-dashboard';

function riskColor(risk: string): string {
  switch (risk) {
    case 'normal':   return 'hsl(152,69%,48%)';
    case 'mild':     return 'hsl(45,95%,55%)';
    case 'high':     return 'hsl(25,90%,55%)';
    case 'critical': return 'hsl(0,70%,58%)';
    default:         return 'hsl(215,12%,50%)';
  }
}

interface Props {
  alerts: HealthAlert[];
}

export function HealthAlertsTable({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: 'hsl(215,15%,44%)',
          fontSize: '13px',
        }}
      >
        No alerts recorded.
      </div>
    );
  }

  const TH: React.CSSProperties = {
    padding: '10px 12px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: 700,
    color: 'hsl(215,12%,40%)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1px solid hsl(220,18%,18%)',
    whiteSpace: 'nowrap',
  };

  const TD: React.CSSProperties = {
    padding: '10px 12px',
    borderBottom: '1px solid hsl(220,18%,13%)',
    fontSize: '13px',
    verticalAlign: 'middle',
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={TH}>Type</th>
            <th style={TH}>Risk</th>
            <th style={TH}>Message</th>
            <th style={TH}>Metric</th>
            <th style={TH}>Value</th>
            <th style={TH}>Status</th>
            <th style={TH}>Time</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => {
            const color = riskColor(alert.risk_level);
            return (
              <tr key={alert.id}>
                <td style={{ ...TD, color: 'hsl(210,20%,75%)' }}>
                  {alert.alert_type.replace(/_/g, ' ')}
                </td>
                <td style={TD}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color,
                      background: `${color}18`,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {alert.risk_level}
                  </span>
                </td>
                <td
                  style={{
                    ...TD,
                    color: 'hsl(215,12%,58%)',
                    maxWidth: '280px',
                  }}
                >
                  {alert.message}
                </td>
                <td
                  style={{
                    ...TD,
                    color: 'hsl(215,12%,50%)',
                    fontSize: '12px',
                  }}
                >
                  {alert.metric_type ?? '—'}
                </td>
                <td
                  style={{
                    ...TD,
                    color: 'hsl(215,12%,55%)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                  }}
                >
                  {alert.metric_value !== null ? alert.metric_value : '—'}
                </td>
                <td style={TD}>
                  {alert.is_acknowledged ? (
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'hsl(152,69%,48%)',
                        background: 'hsla(152,69%,48%,0.1)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Acknowledged
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'hsl(45,95%,55%)',
                        background: 'hsla(45,95%,55%,0.1)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Pending
                    </span>
                  )}
                </td>
                <td
                  style={{
                    ...TD,
                    color: 'hsl(215,12%,40%)',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {new Date(alert.created_at).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
