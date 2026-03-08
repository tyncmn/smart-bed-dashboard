'use client';

import React from 'react';
import { SleepStageSegment, SleepStage } from '@/lib/types';
import { sleepStageColor } from '@/lib/utils';
import { formatTime } from '@/lib/utils';

interface SleepStageTimelineProps {
  stages: SleepStageSegment[];
  totalMinutes: number;
  height?: number;
}

const STAGE_LABELS: Record<SleepStage, string> = {
  awake: 'Awake', light: 'Light', deep: 'Deep', rem: 'REM'
};

export function SleepStageTimeline({ stages, totalMinutes, height = 64 }: SleepStageTimelineProps) {
  return (
    <div>
      {/* Stage bar */}
      <div
        className="flex rounded-lg overflow-hidden"
        style={{ height: `${height}px`, gap: '1px', background: 'hsl(220,18%,16%)' }}
      >
        {stages.map((seg, i) => {
          const pct = (seg.durationMinutes / totalMinutes) * 100;
          const color = sleepStageColor(seg.stage);
          return (
            <div
              key={i}
              title={`${STAGE_LABELS[seg.stage]} — ${seg.durationMinutes}min`}
              style={{
                width: `${pct}%`,
                background: color,
                opacity: 0.85,
                position: 'relative',
                minWidth: '2px',
                cursor: 'default',
                transition: 'opacity 0.15s',
              }}
              className="hover:opacity-100 transition-opacity"
            >
              {pct > 8 && (
                <span style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '10px', fontWeight: 700, color: 'rgba(0,0,0,0.7)',
                  whiteSpace: 'nowrap',
                }}>
                  {STAGE_LABELS[seg.stage]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        {(['deep', 'rem', 'light', 'awake'] as SleepStage[]).map(stage => {
          const totalMins = stages.filter(s => s.stage === stage).reduce((acc, s) => acc + s.durationMinutes, 0);
          if (totalMins === 0) return null;
          return (
            <div key={stage} className="flex items-center gap-1.5">
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: sleepStageColor(stage) }} />
              <span style={{ fontSize: '11px', color: 'hsl(215,15%,60%)' }}>
                {STAGE_LABELS[stage]} <span style={{ color: 'hsl(215,12%,45%)' }}>({totalMins}m)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
