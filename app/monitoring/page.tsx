'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/lib/store';
import { useRealtimeVitals } from '@/lib/use-realtime';
import { VitalCard } from '@/components/VitalCard';
import { LiveLineChart } from '@/components/LiveLineChart';
import { SleepStageTimeline } from '@/components/SleepStageTimeline';
import { RealtimeStatusStrip } from '@/components/RealtimeStatusStrip';
import { MOCK_PATIENTS, MOCK_SLEEP_SESSION } from '@/lib/mock-data';
import { Heart, Droplets, Thermometer, Brain, Activity, Move } from 'lucide-react';

export default function MonitoringPage() {
  useRealtimeVitals(2000);
  const { currentVitals, vitalHistory, activePatientId, alerts } = useDashboardStore();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const patient = MOCK_PATIENTS.find(p => p.id === activePatientId) || MOCK_PATIENTS[0];
  const activeAlerts = alerts.filter(a => a.patientId === activePatientId && (a.status === 'active' || a.status === 'escalated'));

  if (!currentVitals) {
    return <div className="flex items-center justify-center h-full" style={{ color: 'hsl(215,15%,50%)' }}><Activity className="animate-spin mr-2" /> Connecting...</div>;
  }

  const METRICS = [
    { key: 'heartRate', label: 'Heart Rate', value: currentVitals.heartRate, unit: 'bpm', icon: Heart, color: 'hsl(0,80%,60%)', risk: currentVitals.heartRateRisk, history: vitalHistory.heartRate },
    { key: 'spo2', label: 'SpO₂', value: currentVitals.spo2, unit: '%', icon: Droplets, color: 'hsl(199,89%,55%)', risk: currentVitals.spo2Risk, history: vitalHistory.spo2, domain: [80, 100] as [number,number] },
    { key: 'temperature', label: 'Temperature', value: currentVitals.skinTemperature, unit: '°C', icon: Thermometer, color: 'hsl(25,90%,55%)', risk: currentVitals.temperatureRisk, history: vitalHistory.temperature },
    { key: 'stress', label: 'Stress Level', value: currentVitals.stressLevel, unit: '', icon: Brain, color: 'hsl(270,60%,60%)', risk: currentVitals.stressRisk, history: vitalHistory.stress, domain: [0, 100] as [number,number] },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      <div className="mb-5">
        <RealtimeStatusStrip
          isMonitoring={true}
          lastUpdated={currentVitals.timestamp}
          overallRisk={currentVitals.overallRisk}
          activeAlertCount={activeAlerts.length}
          patientName={patient.name}
        />
      </div>

      <div className="mb-6">
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,96%)', marginBottom: '4px' }}>Live Monitoring</h1>
        <p style={{ fontSize: '13px', color: 'hsl(215,15%,50%)' }}>Realtime vitals with 2-second refresh. Click a metric for expanded view. Updating every {2}s.</p>
      </div>

      {/* Vital Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {METRICS.map(({ key, label, value, unit, icon: Icon, color, risk }) => (
          <VitalCard
            key={key}
            label={label} value={value} unit={unit}
            icon={<Icon size={16} className={key === 'heartRate' ? 'icon-heartbeat' : ''} />}
            accentColor={color} riskDetail={risk} isLive
            onClick={() => setSelectedMetric(selectedMetric === key ? null : key)}
            className={selectedMetric === key ? 'ring-1' : ''}
          />
        ))}
      </div>

      {/* Expanded chart for selected metric */}
      {selectedMetric && (() => {
        const m = METRICS.find(m => m.key === selectedMetric)!;
        return (
          <div className="card p-6 mb-6 fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <m.icon size={18} style={{ color: m.color }} />
                <h3 style={{ fontWeight: 700, fontSize: '16px', color: 'hsl(210,20%,96%)' }}>{m.label} — Expanded View</h3>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: m.color }}>
                {m.value} <span style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(215,15%,55%)' }}>{m.unit}</span>
              </div>
            </div>
            <LiveLineChart
              data={m.history}
              color={m.color}
              unit={m.unit}
              label={m.key}
              baselineMin={m.risk.normalMin}
              baselineMax={m.risk.normalMax}
              height={220}
              domain={(m as any).domain}
            />
            {m.risk.reason && (
              <div className="mt-3 px-4 py-3 rounded-lg" style={{ background: `${m.color}10`, border: `1px solid ${m.color}25` }}>
                <p style={{ fontSize: '12px', color: 'hsl(215,15%,65%)', lineHeight: 1.6 }}>{m.risk.reason}</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* All 4 mini charts */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        {METRICS.map(({ key, label, color, history, risk, domain }) => (
          <div key={key} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(215,15%,60%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label} Timeline</h3>
              <span style={{ fontSize: '10px', color: 'hsl(215,12%,38%)' }}>Baseline: {risk.normalMin}–{risk.normalMax}</span>
            </div>
            <LiveLineChart data={history} color={color} unit="" label={key}
              baselineMin={risk.normalMin} baselineMax={risk.normalMax} height={120}
              domain={domain as any}
            />
          </div>
        ))}
      </div>

      {/* Sleep stage timeline */}
      <div className="card p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Move size={14} style={{ color: 'hsl(220,70%,60%)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(215,15%,65%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sleep Stage Stream
          </h3>
          <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)', marginLeft: '8px' }}>
            {MOCK_SLEEP_SESSION.interruptions} interruptions · {MOCK_SLEEP_SESSION.disturbanceDetected ? 'Disturbance detected' : 'No disturbance'}
          </span>
        </div>
        <SleepStageTimeline
          stages={MOCK_SLEEP_SESSION.stages}
          totalMinutes={MOCK_SLEEP_SESSION.durationMinutes}
          height={70}
        />

        {/* Movement events */}
        <div className="mt-4">
          <div style={{ fontSize: '11px', color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Movement Events
          </div>
          <div className="flex gap-2 flex-wrap">
            {MOCK_SLEEP_SESSION.movementEvents.map((evt, i) => (
              <div key={i} className="flex flex-col items-center px-3 py-2 rounded-lg" style={{
                background: `hsla(25,90%,50%,${0.05 + (evt.intensity / 10) * 0.2})`,
                border: `1px solid hsla(25,90%,50%,${0.15 + (evt.intensity / 10) * 0.3})`,
              }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'hsl(25,90%,62%)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {evt.intensity}/10
                </span>
                <span style={{ fontSize: '10px', color: 'hsl(215,12%,42%)' }}>
                  {new Date(evt.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
