'use client';

import React, { useState } from 'react';
import { MOCK_PROTOCOLS, MOCK_DEVICES } from '@/lib/mock-data';
import { ProtocolStatusCard } from '@/components/ProtocolStatusCard';
import { DeviceStatusCard } from '@/components/DeviceStatusCard';
import { useDashboardStore } from '@/lib/store';
import { timeAgo, formatDateTime } from '@/lib/utils';
import { ShieldCheck, Pill, AlertTriangle, CheckCircle, Clock, Zap, Lock } from 'lucide-react';

export default function ProtocolPage() {
  const { activePatientId } = useDashboardStore();
  const protocols = MOCK_PROTOCOLS.filter(p => p.patientId === activePatientId);
  const devices = MOCK_DEVICES.filter(d => d.patientId === activePatientId && (d.type === 'pill_dispenser' || d.type === 'smart_bed'));
  const dispenser = MOCK_DEVICES.find(d => d.patientId === activePatientId && d.type === 'pill_dispenser');

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,96%)', marginBottom: '4px' }}>Protocol & Dispenser</h1>
          <p style={{ fontSize: '13px', color: 'hsl(215,15%,50%)' }}>Doctor-configured protocol execution, device commands, and audit logs.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'hsla(43,90%,50%,0.1)', border: '1px solid hsla(43,90%,50%,0.25)' }}>
          <AlertTriangle size={14} style={{ color: 'hsl(43,90%,55%)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(43,90%,60%)' }}>
            All medication actions require doctor authorization
          </span>
        </div>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Protocols */}
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,55%)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Active Protocols ({protocols.length})
          </h2>
          <div className="flex flex-col gap-3">
            {protocols.map(protocol => (
              <ProtocolStatusCard key={protocol.id} protocol={protocol} />
            ))}
            {protocols.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'hsl(215,12%,40%)', fontSize: '13px' }}>
                No protocols configured for this patient.
              </div>
            )}
          </div>
        </div>

        {/* Devices */}
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,55%)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Connected Devices
          </h2>
          <div className="flex flex-col gap-3">
            {devices.map(device => (
              <DeviceStatusCard key={device.id} device={device} />
            ))}
          </div>
        </div>

        {/* Protocol Action History */}
        <div className="col-span-2">
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,55%)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Protocol Action History
          </h2>
          <div className="card overflow-hidden">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'hsl(220,22%,11%)' }}>
                  {['Time', 'Protocol', 'Triggered By', 'Status', 'Note', 'Device'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {protocols.flatMap(p =>
                  p.actionHistory.map(a => ({
                    ...a,
                    protocolName: p.name,
                    protocolType: p.type,
                  }))
                ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((action, i) => {
                  const statusConfig = {
                    pending: { color: 'hsl(43,90%,55%)', icon: Clock, label: 'Pending' },
                    approved: { color: 'hsl(199,70%,55%)', icon: CheckCircle, label: 'Approved' },
                    rejected: { color: 'hsl(0,70%,55%)', icon: AlertTriangle, label: 'Rejected' },
                    executed: { color: 'hsl(152,69%,45%)', icon: Zap, label: 'Executed' },
                    failed: { color: 'hsl(0,70%,55%)', icon: AlertTriangle, label: 'Failed' },
                  }[action.status];
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={action.id} style={{ borderTop: '1px solid hsl(220,18%,14%)', background: i % 2 === 0 ? 'transparent' : 'hsla(220,22%,10%,0.4)' }}>
                      <td style={{ padding: '10px 16px', fontSize: '11px', color: 'hsl(215,15%,55%)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {formatDateTime(action.timestamp)}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '12px', color: 'hsl(210,20%,85%)', fontWeight: 500 }}>
                        {action.protocolName}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '12px', color: 'hsl(215,15%,60%)' }}>
                        {action.triggeredBy}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <div className="flex items-center gap-1.5">
                          <StatusIcon size={12} style={{ color: statusConfig.color }} />
                          <span style={{ fontSize: '11px', fontWeight: 600, color: statusConfig.color }}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '11px', color: 'hsl(215,12%,45%)', maxWidth: '200px' }}>
                        {action.note || '—'}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '11px', color: 'hsl(215,12%,40%)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {action.dispatchedToDevice || '—'}
                      </td>
                    </tr>
                  );
                })}
                {protocols.every(p => p.actionHistory.length === 0) && (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'hsl(215,12%,40%)', fontSize: '13px' }}>
                      No protocol actions on record.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Command Log */}
        {dispenser && dispenser.commandHistory.length > 0 && (
          <div className="col-span-2">
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,55%)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Pill Dispenser Command Log
            </h2>
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid hsl(220,18%,16%)', background: 'hsl(220,22%,11%)' }}>
                <Lock size={12} style={{ color: 'hsl(270,60%,65%)' }} />
                <span style={{ fontSize: '11px', color: 'hsl(270,60%,65%)', fontWeight: 600 }}>
                  AUDIT LOG — All dispenser commands are logged for compliance review
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'hsl(220,22%,11%)' }}>
                    {['Timestamp', 'Command', 'Issued By', 'Status', 'Response', 'Latency'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dispenser.commandHistory.map((cmd, i) => (
                    <tr key={cmd.id} style={{ borderTop: '1px solid hsl(220,18%,14%)' }}>
                      <td style={{ padding: '10px 16px', fontSize: '11px', color: 'hsl(215,15%,55%)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {formatDateTime(cmd.timestamp)}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '12px', color: 'hsl(210,20%,85%)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {cmd.command}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '12px', color: 'hsl(215,15%,60%)' }}>
                        {cmd.issuedBy}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 700,
                          color: cmd.status === 'acked' ? 'hsl(152,69%,45%)' : cmd.status === 'failed' ? 'hsl(0,70%,55%)' : 'hsl(43,90%,55%)',
                        }}>
                          {cmd.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '11px', color: 'hsl(152,69%,45%)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {cmd.responsePayload || '—'}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '11px', color: 'hsl(215,12%,45%)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {cmd.latencyMs ? `${cmd.latencyMs}ms` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
