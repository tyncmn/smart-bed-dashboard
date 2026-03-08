'use client';

import React from 'react';
import { Protocol } from '@/lib/types';
import { timeAgo, formatDateTime } from '@/lib/utils';
import { CheckCircle, Clock, AlertTriangle, ShieldCheck, Send } from 'lucide-react';

interface ProtocolStatusCardProps {
  protocol: Protocol;
  compact?: boolean;
}

const PROTOCOL_TYPE_LABELS = {
  notify_only: 'Notify Only',
  approval_required: 'Approval Required',
  auto_dispense: 'Auto-Dispense',
};

const PROTOCOL_TYPE_COLORS = {
  notify_only: 'hsl(199,70%,55%)',
  approval_required: 'hsl(43,90%,55%)',
  auto_dispense: 'hsl(270,60%,65%)',
};

const ACTION_STATUS_CONFIG = {
  pending: { color: 'hsl(43,90%,55%)', icon: Clock, label: 'Pending Approval' },
  approved: { color: 'hsl(199,70%,55%)', icon: CheckCircle, label: 'Approved' },
  rejected: { color: 'hsl(0,70%,55%)', icon: AlertTriangle, label: 'Rejected' },
  executed: { color: 'hsl(152,69%,45%)', icon: Send, label: 'Executed' },
  failed: { color: 'hsl(0,70%,55%)', icon: AlertTriangle, label: 'Failed' },
};

export function ProtocolStatusCard({ protocol, compact = false }: ProtocolStatusCardProps) {
  const typeColor = PROTOCOL_TYPE_COLORS[protocol.type];
  const latestAction = protocol.actionHistory[protocol.actionHistory.length - 1];
  const actionConfig = latestAction ? ACTION_STATUS_CONFIG[latestAction.status] : null;

  return (
    <div className="card-elevated" style={{ padding: '16px' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} style={{ color: typeColor }} />
            <span style={{ fontWeight: 600, fontSize: '13px', color: 'hsl(210,20%,92%)' }}>
              {protocol.name}
            </span>
          </div>
          <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '99px',
            fontSize: '10px',
            fontWeight: 600,
            background: `${typeColor}15`,
            color: typeColor,
            border: `1px solid ${typeColor}30`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {PROTOCOL_TYPE_LABELS[protocol.type]}
          </span>
        </div>

        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: protocol.isActive ? 'hsl(152,69%,45%)' : 'hsl(215,12%,40%)',
          marginTop: '4px',
        }} />
      </div>

      {!compact && (
        <p style={{ fontSize: '12px', color: 'hsl(215,15%,55%)', lineHeight: 1.5, marginBottom: '12px' }}>
          <strong style={{ color: 'hsl(215,15%,65%)' }}>Trigger:</strong> {protocol.triggerCondition}
        </p>
      )}

      <p style={{ fontSize: '12px', color: 'hsl(215,15%,55%)', lineHeight: 1.5 }}>
        <strong style={{ color: 'hsl(215,15%,65%)' }}>Action:</strong> {protocol.action}
      </p>

      <div className="mt-3 pt-3" style={{ borderTop: '1px solid hsl(220,18%,16%)' }}>
        <div className="flex justify-between items-center" style={{ fontSize: '11px' }}>
          <span style={{ color: 'hsl(215,12%,40%)' }}>Authorized by</span>
          <span style={{ color: 'hsl(215,15%,60%)' }}>{protocol.doctorName}</span>
        </div>
        {protocol.lastTriggeredAt && (
          <div className="flex justify-between items-center mt-1" style={{ fontSize: '11px' }}>
            <span style={{ color: 'hsl(215,12%,40%)' }}>Last triggered</span>
            <span style={{ color: 'hsl(215,15%,60%)' }}>{timeAgo(protocol.lastTriggeredAt)}</span>
          </div>
        )}
        {actionConfig && latestAction && (
          <div className="flex items-center gap-2 mt-2">
            <actionConfig.icon size={12} style={{ color: actionConfig.color }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: actionConfig.color }}>
              {actionConfig.label}
            </span>
            {latestAction.note && (
              <span style={{ fontSize: '11px', color: 'hsl(215,12%,45%)' }}>— {latestAction.note}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
