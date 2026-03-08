'use client';

import React from 'react';
import { Device } from '@/lib/types';
import { deviceStatusColor, formatDateTime, timeAgo } from '@/lib/utils';
import { Wifi, WifiOff, Battery, BatteryLow, BedDouble, Pill, Watch, Router } from 'lucide-react';

interface DeviceStatusCardProps {
  device: Device;
  compact?: boolean;
}

const DEVICE_ICONS = {
  smart_bed: BedDouble,
  pill_dispenser: Pill,
  apple_watch: Watch,
  gateway: Router,
};

const STATUS_LABELS = {
  online: 'Online',
  offline: 'Offline',
  error: 'Error',
  low_battery: 'Low Battery',
};

export function DeviceStatusCard({ device, compact = false }: DeviceStatusCardProps) {
  const statusColor = deviceStatusColor(device.status);
  const Icon = DEVICE_ICONS[device.type];
  const isOnline = device.status === 'online' || device.status === 'low_battery';

  return (
    <div
      className="card-elevated"
      style={{ padding: compact ? '12px' : '16px' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: compact ? 36 : 44,
              height: compact ? 36 : 44,
              borderRadius: '10px',
              background: `${statusColor}15`,
              border: `1px solid ${statusColor}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={compact ? 16 : 20} style={{ color: statusColor }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: compact ? '12px' : '13px', color: 'hsl(210,20%,92%)' }}>
              {device.name}
            </div>
            <div style={{ color: 'hsl(215,12%,45%)', fontSize: '11px', marginTop: '2px' }}>
              {device.location}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            {isOnline
              ? <Wifi size={12} style={{ color: statusColor }} />
              : <WifiOff size={12} style={{ color: statusColor }} />
            }
            <span style={{ fontSize: '11px', fontWeight: 600, color: statusColor }}>
              {STATUS_LABELS[device.status]}
            </span>
          </div>
          {device.batteryLevel !== undefined && (
            <div className="flex items-center gap-1">
              {device.batteryLevel < 20 ? <BatteryLow size={12} style={{ color: 'hsl(43,95%,55%)' }} /> : <Battery size={12} style={{ color: 'hsl(215,12%,45%)' }} />}
              <span style={{ fontSize: '11px', color: device.batteryLevel < 20 ? 'hsl(43,95%,55%)' : 'hsl(215,12%,45%)' }}>
                {device.batteryLevel}%
              </span>
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid hsl(220,18%,18%)' }}>
          <div className="flex justify-between" style={{ fontSize: '11px' }}>
            <span style={{ color: 'hsl(215,12%,40%)' }}>Last seen</span>
            <span style={{ color: 'hsl(215,15%,55%)' }}>{timeAgo(device.lastSeen)}</span>
          </div>
          <div className="flex justify-between mt-1" style={{ fontSize: '11px' }}>
            <span style={{ color: 'hsl(215,12%,40%)' }}>Firmware</span>
            <span style={{ color: 'hsl(215,15%,55%)', fontFamily: 'JetBrains Mono, monospace' }}>{device.firmwareVersion}</span>
          </div>
          {device.commandHistory.length > 0 && (
            <div className="mt-2 pt-2" style={{ borderTop: '1px solid hsl(220,18%,15%)' }}>
              <div style={{ fontSize: '10px', color: 'hsl(215,12%,38%)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Last Command
              </div>
              <div style={{ fontSize: '11px', color: 'hsl(215,15%,55%)', fontFamily: 'JetBrains Mono, monospace' }}>
                {device.commandHistory[0].command}
              </div>
              <div style={{ fontSize: '10px', color: device.commandHistory[0].status === 'acked' ? 'hsl(152,69%,45%)' : 'hsl(0,70%,55%)' }}>
                {device.commandHistory[0].status.toUpperCase()} · {timeAgo(device.commandHistory[0].timestamp)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
