'use client';

import React from 'react';
import { scoreColor, formatTime } from '@/lib/utils';
import { Moon, Zap, Clock, BarChart3 } from 'lucide-react';

interface SleepScoreCardProps {
  score: number;
  durationMinutes: number;
  deepSleepMinutes: number;
  remMinutes: number;
  interruptions: number;
  disturbanceDetected: boolean;
  sessionStart: string;
}

export function SleepScoreCard({
  score, durationMinutes, deepSleepMinutes, remMinutes,
  interruptions, disturbanceDetected, sessionStart
}: SleepScoreCardProps) {
  const color = scoreColor(score);
  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const circumference = 2 * Math.PI * 40;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Moon size={16} style={{ color: 'hsl(220,70%,65%)' }} />
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'hsl(215,15%,60%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Sleep Score
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular score */}
        <div className="relative flex-shrink-0" style={{ width: 100, height: 100 }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(220,18%,18%)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={color} strokeWidth="8"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color, lineHeight: 1, fontFamily: 'JetBrains Mono, monospace' }}>
              {score}
            </span>
            <span style={{ fontSize: '10px', color: 'hsl(215,12%,45%)' }}>/ 100</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {[
            { label: 'Duration', value: `${hours}h ${mins}m`, icon: Clock, color: 'hsl(199,70%,55%)' },
            { label: 'Deep Sleep', value: `${Math.floor(deepSleepMinutes / 60)}h ${deepSleepMinutes % 60}m`, icon: BarChart3, color: 'hsl(220,70%,60%)' },
            { label: 'REM', value: `${Math.floor(remMinutes / 60)}h ${remMinutes % 60}m`, icon: Zap, color: 'hsl(270,60%,65%)' },
            { label: 'Interruptions', value: `${interruptions}`, icon: BarChart3, color: interruptions > 2 ? 'hsl(25,90%,55%)' : 'hsl(152,69%,45%)' },
          ].map(({ label, value, icon: Icon, color: c }) => (
            <div key={label}>
              <div style={{ fontSize: '10px', color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: c, fontFamily: 'JetBrains Mono, monospace' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {disturbanceDetected && (
        <div className="mt-3 px-3 py-2 rounded-lg" style={{
          background: 'hsla(25,90%,50%,0.1)', border: '1px solid hsla(25,90%,50%,0.25)'
        }}>
          <span style={{ fontSize: '11px', color: 'hsl(25,90%,60%)' }}>
            ⚠ Sleep disturbance detected during this session
          </span>
        </div>
      )}

      <div style={{ fontSize: '11px', color: 'hsl(215,12%,38%)', marginTop: '10px' }}>
        Session started {formatTime(sessionStart)}
      </div>
    </div>
  );
}
