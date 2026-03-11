'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/lib/store';
import { useRealtimeStatus } from '@/lib/use-realtime';
import { AlertDetailDrawer } from '@/components/AlertDetailDrawer';
import { RiskBadge } from '@/components/RiskBadge';
import { riskColor, timeAgo } from '@/lib/utils';
import { RiskLevel } from '@/lib/types';
import { acknowledgeAlertApi } from '@/lib/api';
import { AlertOctagon, AlertTriangle, Info, Filter, CheckCircle } from 'lucide-react';

type FilterRisk = 'all' | RiskLevel;
type FilterStatus = 'all' | 'active' | 'acknowledged';

export default function AlertsPage() {
  useRealtimeStatus(5000);

  const {
    currentStatus,
    optimisticAcknowledge,
    setSelectedAlert,
    selectedAlertId,
  } = useDashboardStore();

  const [riskFilter, setRiskFilter] = useState<FilterRisk>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const alerts = currentStatus?.alerts ?? [];

  const filtered = alerts.filter((a) => {
    const riskOk = riskFilter === 'all' || a.riskLevel === riskFilter;
    const statusOk =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !a.isAcknowledged) ||
      (statusFilter === 'acknowledged' && a.isAcknowledged);

    return riskOk && statusOk;
  });

  const selectedAlert = selectedAlertId
    ? alerts.find((a) => a.id === selectedAlertId)
    : null;

  const counts = {
    critical: alerts.filter((a) => a.riskLevel === 'critical').length,
    high: alerts.filter((a) => a.riskLevel === 'high').length,
    mild: alerts.filter((a) => a.riskLevel === 'mild').length,
    active: alerts.filter((a) => !a.isAcknowledged).length,
    acknowledged: alerts.filter((a) => a.isAcknowledged).length,
  };

  const summaryTiles = [
    {
      label: 'Critical',
      count: counts.critical,
      color: 'hsl(0,80%,60%)',
      border: 'hsl(0,80%,55%)',
    },
    {
      label: 'High',
      count: counts.high,
      color: 'hsl(25,90%,60%)',
      border: 'hsl(25,90%,55%)',
    },
    {
      label: 'Mild',
      count: counts.mild,
      color: 'hsl(43,90%,60%)',
      border: 'hsl(43,90%,55%)',
    },
    {
      label: 'Active',
      count: counts.active,
      color: 'hsl(0,70%,60%)',
      border: 'hsl(0,70%,55%)',
    },
    {
      label: 'Acknowledged',
      count: counts.acknowledged,
      color: 'hsl(152,65%,50%)',
      border: 'hsl(152,65%,45%)',
    },
  ];

  const renderRiskFilterButton = (value: FilterRisk) => {
    const isActive = riskFilter === value;
    const isAll = value === 'all';
    const color = isAll ? 'hsl(215,15%,75%)' : riskColor(value as RiskLevel);

    return (
      <button
        key={value}
        onClick={() => setRiskFilter(value)}
        className="rounded-xl transition-all hover:brightness-110"
        style={{
          minHeight: '40px',
          padding: '0 16px',
          fontSize: '13px',
          fontWeight: 600,
          background: isActive
            ? isAll
              ? 'hsl(220,22%,20%)'
              : `${color}20`
            : 'hsl(220,18%,12%)',
          color: isActive ? color : 'hsl(215,12%,52%)',
          border: `1px solid ${
            isActive
              ? isAll
                ? 'hsl(220,16%,28%)'
                : `${color}40`
              : 'hsl(220,16%,20%)'
          }`,
          boxShadow: isActive ? `0 0 0 1px ${isAll ? 'transparent' : `${color}18`}` : 'none',
        }}
      >
        {isAll ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}
      </button>
    );
  };

  const renderStatusFilterButton = (value: FilterStatus) => {
    const isActive = statusFilter === value;

    return (
      <button
        key={value}
        onClick={() => setStatusFilter(value)}
        className="rounded-xl transition-all hover:brightness-110"
        style={{
          minHeight: '40px',
          padding: '0 16px',
          fontSize: '13px',
          fontWeight: 600,
          background: isActive ? 'hsl(220,22%,20%)' : 'hsl(220,18%,12%)',
          color: isActive ? 'hsl(215,15%,78%)' : 'hsl(215,12%,52%)',
          border: `1px solid ${isActive ? 'hsl(220,16%,28%)' : 'hsl(220,16%,20%)'}`,
        }}
      >
        {value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}
      </button>
    );
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1200px' }}>
      <div className="page-header" style={{ marginBottom: '22px' }}>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: 'hsl(210,20%,96%)',
            letterSpacing: '-0.02em',
            marginBottom: '4px',
          }}
        >
          Alert Center
        </h1>
        <p style={{ fontSize: '13px', color: 'hsl(215,15%,44%)' }}>
          Manage active alerts and acknowledge events.
        </p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {summaryTiles.map(({ label, count, color, border }) => (
          <div
            key={label}
            className="card-elevated"
            style={{
              padding: '16px 18px',
              borderLeft: `3px solid ${border}`,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <span
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color,
                fontFamily: 'JetBrains Mono, monospace',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {count}
            </span>
            <span
              style={{
                fontSize: '12px',
                color: 'hsl(215,12%,50%)',
                fontWeight: 600,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="card mb-6"
        style={{
          padding: '16px 20px',
          borderColor: 'hsl(220,18%,18%)',
          marginTop: '16px',
          marginBottom: '16px',
        }}
      >
        <div
          className="flex items-center gap-x-3 gap-y-3 flex-wrap"
          style={{ rowGap: '12px' }}
        >
          <div
            className="flex items-center gap-1.5"
            style={{
              color: 'hsl(215,12%,45%)',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <Filter size={13} />
            <span>Risk Level</span>
          </div>

          {(['all', 'critical', 'high', 'mild', 'normal'] as FilterRisk[]).map(
            renderRiskFilterButton
          )}

          <div
            className="flex items-center gap-1.5 ml-3"
            style={{
              color: 'hsl(215,12%,45%)',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <span>Status</span>
          </div>

          {(['all', 'active', 'acknowledged'] as FilterStatus[]).map(
            renderStatusFilterButton
          )}
        </div>
      </div>

      {/* Alert Table */}
      <div className="card overflow-hidden">
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid hsl(220,18%,18%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'hsl(215,15%,55%)',
            }}
          >
            {filtered.length} alert{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div>
          {filtered.length === 0 && (
            <div
              className="text-center"
              style={{
                padding: '40px',
                color: 'hsl(215,12%,40%)',
                fontSize: '14px',
              }}
            >
              No alerts match current filters.
            </div>
          )}

          {filtered.map((alert) => {
            const accentColor = riskColor(alert.riskLevel);
            const Icon =
              alert.riskLevel === 'critical'
                ? AlertOctagon
                : alert.riskLevel === 'high'
                ? AlertTriangle
                : Info;

            const status = alert.isAcknowledged ? 'acknowledged' : 'active';

            return (
              <div
                key={alert.id}
                className="flex items-center gap-5 cursor-pointer hover:brightness-110 transition-all"
                onClick={() => setSelectedAlert(alert.id)}
                style={{
                  margin: '8px 10px',
                  padding: '18px 22px',
                  border: `1px solid ${
                    selectedAlertId === alert.id
                      ? `${accentColor}44`
                      : 'hsl(220,18%,17%)'
                  }`,
                  borderRadius: '12px',
                  borderLeft: `3px solid ${accentColor}`,
                  background:
                    selectedAlertId === alert.id
                      ? `${accentColor}08`
                      : 'hsl(220,22%,10%)',
                }}
              >
                <Icon size={16} style={{ color: accentColor, flexShrink: 0 }} />

                <div style={{ flex: '0 0 200px' }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'hsl(210,20%,92%)',
                    }}
                  >
                    {alert.title}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'hsl(215,12%,45%)',
                      marginTop: '2px',
                    }}
                  >
                    {alert.type}
                  </div>
                </div>

                <div style={{ flex: '0 0 120px' }}>
                  <RiskBadge level={alert.riskLevel} size="sm" showIcon={false} />
                </div>

                <div
                  style={{
                    flex: '0 0 150px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '13px',
                    color: accentColor,
                  }}
                >
                  {alert.metric}: {alert.currentValue}
                  <div
                    style={{
                      color: 'hsl(215,12%,40%)',
                      fontSize: '11px',
                      fontFamily: 'Inter, sans-serif',
                      marginTop: '2px',
                    }}
                  >
                    Expected: {alert.expectedMin}–{alert.expectedMax}
                  </div>
                </div>

                <div style={{ flex: '0 0 80px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color:
                        status === 'active'
                          ? 'hsl(0,70%,60%)'
                          : 'hsl(152,65%,45%)',
                    }}
                  >
                    {status.toUpperCase()}
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: '12px',
                    color: 'hsl(215,12%,40%)',
                  }}
                >
                  {timeAgo(alert.createdAt)}
                </div>

                {!alert.isAcknowledged && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      optimisticAcknowledge(alert.id);
                      await acknowledgeAlertApi(alert.id);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all hover:brightness-110"
                    style={{
                      background: 'hsla(152,69%,45%,0.12)',
                      border: '1px solid hsla(152,69%,45%,0.3)',
                      color: 'hsl(152,69%,52%)',
                      fontSize: '12px',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle size={12} /> ACK
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedAlert && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setSelectedAlert(null)}
          />
          <AlertDetailDrawer
            alert={selectedAlert}
            onClose={() => setSelectedAlert(null)}
          />
        </>
      )}
    </div>
  );
}