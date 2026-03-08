'use client';

import React from 'react';
import { RiskLevel } from '@/lib/types';
import { riskLabel, cn } from '@/lib/utils';
import { ShieldAlert, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  percentage?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const RISK_CONFIG = {
  critical: {
    icon: ShieldAlert,
    bgStyle: { backgroundColor: 'hsla(0,84%,55%,0.15)', borderColor: 'hsla(0,84%,55%,0.4)', color: 'hsl(0,84%,68%)' },
    pulse: true,
  },
  high: {
    icon: AlertTriangle,
    bgStyle: { backgroundColor: 'hsla(25,95%,55%,0.12)', borderColor: 'hsla(25,95%,55%,0.35)', color: 'hsl(25,95%,65%)' },
    pulse: false,
  },
  mild: {
    icon: AlertTriangle,
    bgStyle: { backgroundColor: 'hsla(43,95%,55%,0.12)', borderColor: 'hsla(43,95%,55%,0.3)', color: 'hsl(43,95%,62%)' },
    pulse: false,
  },
  normal: {
    icon: CheckCircle,
    bgStyle: { backgroundColor: 'hsla(152,69%,45%,0.1)', borderColor: 'hsla(152,69%,45%,0.3)', color: 'hsl(152,69%,52%)' },
    pulse: false,
  },
};

export function RiskBadge({ level, percentage, size = 'md', showIcon = true, className }: RiskBadgeProps) {
  const config = RISK_CONFIG[level];
  const Icon = config.icon;

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '11px', gap: '4px', iconSize: 12 },
    md: { padding: '4px 12px', fontSize: '12px', gap: '5px', iconSize: 14 },
    lg: { padding: '6px 16px', fontSize: '14px', gap: '6px', iconSize: 16 },
  }[size];

  return (
    <span
      className={cn('inline-flex items-center rounded-full border font-semibold tracking-wide', className)}
      style={{
        ...config.bgStyle,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        gap: sizeStyles.gap,
        letterSpacing: '0.03em',
      }}
    >
      {showIcon && <Icon size={sizeStyles.iconSize} />}
      {riskLabel(level)}
      {percentage !== undefined && (
        <span style={{ opacity: 0.8, marginLeft: '2px' }}>({percentage.toFixed(1)}%)</span>
      )}
    </span>
  );
}
