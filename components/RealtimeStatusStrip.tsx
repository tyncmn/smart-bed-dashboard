'use client';

import React from 'react';
import { RiskLevel } from '@/lib/types';
import { riskColor, riskLabel, timeAgo } from '@/lib/utils';
import { Activity, Wifi, Bell } from 'lucide-react';

interface RealtimeStatusStripProps {
  isMonitoring: boolean;
  lastUpdated: string;
  overallRisk: RiskLevel;
  activeAlertCount: number;
  patientName: string;
}

export function RealtimeStatusStrip({
  isMonitoring, lastUpdated, overallRisk, activeAlertCount, patientName
}: RealtimeStatusStripProps) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-2 rounded-lg"
      style={{
        background: 'hsl(220,25%,9%)',
        border: '1px solid hsl(220,18%,18%)',
        flexWrap: 'wrap',
        gap: '8px 16px',
      }}
    >
      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <span className="live-dot" style={{ background: isMonitoring ? 'hsl(152,69%,45%)' : 'hsl(215,12%,40%)' }} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: isMonitoring ? 'hsl(152,69%,52%)' : 'hsl(215,12%,45%)' }}>
          {isMonitoring ? 'LIVE MONITORING' : 'PAUSED'}
        </span>
      </div>

      <div style={{ width: '1px', height: '12px', background: 'hsl(220,16%,22%)' }} />

      {/* Patient */}
      <div style={{ fontSize: '12px', color: 'hsl(215,15%,60%)' }}>
        {patientName}
      </div>

      <div style={{ width: '1px', height: '12px', background: 'hsl(220,16%,22%)' }} />

      {/* Risk */}
      <div className="flex items-center gap-1.5">
        <Activity size={12} style={{ color: riskColor(overallRisk) }} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: riskColor(overallRisk) }}>
          {riskLabel(overallRisk)}
        </span>
      </div>

      <div style={{ width: '1px', height: '12px', background: 'hsl(220,16%,22%)' }} />

      {/* Alerts */}
      {activeAlertCount > 0 && (
        <>
          <div className="flex items-center gap-1.5">
            <Bell size={12} style={{ color: 'hsl(0,70%,58%)' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(0,70%,58%)' }}>
              {activeAlertCount} Active Alert{activeAlertCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ width: '1px', height: '12px', background: 'hsl(220,16%,22%)' }} />
        </>
      )}

      {/* Last update */}
      <div className="flex items-center gap-1.5 ml-auto">
        <Wifi size={11} style={{ color: 'hsl(215,12%,40%)' }} />
        <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)' }}>
          Updated {timeAgo(lastUpdated)}
        </span>
      </div>
    </div>
  );
}
