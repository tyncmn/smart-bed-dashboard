'use client';

import React, { useEffect } from 'react';
import { useDashboardStore } from '@/lib/store';
import { useRealtimeVitals } from '@/lib/use-realtime';
import { VitalCard } from '@/components/VitalCard';
import { RiskBadge } from '@/components/RiskBadge';
import { AlertBanner } from '@/components/AlertBanner';
import { SleepScoreCard } from '@/components/SleepScoreCard';
import { DeviceStatusCard } from '@/components/DeviceStatusCard';
import { RealtimeStatusStrip } from '@/components/RealtimeStatusStrip';
import { AlertDetailDrawer } from '@/components/AlertDetailDrawer';
import { LiveLineChart } from '@/components/LiveLineChart';
import { MOCK_PATIENTS, MOCK_SLEEP_SESSION } from '@/lib/mock-data';
import { Heart, Droplets, Thermometer, Brain, Activity, ChevronRight, User, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  useRealtimeVitals(3000);
  const { currentVitals, vitalHistory, alerts, activePatientId, devices, selectedAlertId, setSelectedAlert } = useDashboardStore();

  const patient = MOCK_PATIENTS.find(p => p.id === activePatientId) || MOCK_PATIENTS[0];
  const activeAlerts = alerts.filter(a =>
    a.patientId === activePatientId && (a.status === 'active' || a.status === 'escalated')
  );
  const patientDevices = devices.filter(d => d.patientId === activePatientId);
  const selectedAlert = selectedAlertId ? alerts.find(a => a.id === selectedAlertId) : null;

  if (!currentVitals) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'hsl(215,15%,50%)' }}>
        <Activity size={24} className="animate-spin mr-3" />
        Initializing monitor...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Status Strip */}
      <div className="mb-5">
        <RealtimeStatusStrip
          isMonitoring={true}
          lastUpdated={currentVitals.timestamp}
          overallRisk={currentVitals.overallRisk}
          activeAlertCount={activeAlerts.length}
          patientName={patient.name}
        />
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,96%)' }}>
            Overview Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: 'hsl(215,15%,50%)', marginTop: '2px' }}>
            {patient.name} · Room {patient.roomNumber} · {patient.primaryDoctor}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RiskBadge level={currentVitals.overallRisk} percentage={currentVitals.overallRiskPercentage} size="lg" />
          <Link href="/patient">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all" style={{ background: 'hsl(220,22%,16%)', border: '1px solid hsl(220,16%,24%)', color: 'hsl(215,15%,65%)', fontSize: '13px' }}>
              <User size={14} /> Patient Detail <ChevronRight size={12} />
            </button>
          </Link>
        </div>
      </div>

      {/* Active Alerts Banner */}
      {activeAlerts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} style={{ color: 'hsl(0,70%,55%)' }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,60%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Alerts ({activeAlerts.length})
            </h2>
            <Link href="/alerts" style={{ marginLeft: 'auto', fontSize: '12px', color: 'hsl(199,70%,55%)' }}>
              View all <ChevronRight size={11} style={{ display: 'inline' }} />
            </Link>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: activeAlerts.length > 1 ? '1fr 1fr' : '1fr' }}>
            {activeAlerts.slice(0, 2).map(alert => (
              <AlertBanner key={alert.id} alert={alert} onClick={() => setSelectedAlert(alert.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Vital Cards */}
      <div className="mb-6">
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(215,15%,50%)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Live Health Panel
        </h2>
        <div className="grid grid-cols-4 gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <VitalCard
            label="Heart Rate" value={currentVitals.heartRate} unit="bpm"
            icon={<Heart size={16} className="icon-heartbeat" />}
            accentColor="hsl(0,80%,60%)" riskDetail={currentVitals.heartRateRisk}
            trend={currentVitals.heartRate > currentVitals.heartRateRisk.normalMax ? 'up' : currentVitals.heartRate < currentVitals.heartRateRisk.normalMin ? 'down' : 'stable'}
            onClick={() => {}}
          />
          <VitalCard
            label="SpO₂" value={currentVitals.spo2} unit="%"
            icon={<Droplets size={16} />}
            accentColor="hsl(199,89%,55%)" riskDetail={currentVitals.spo2Risk}
            trend={currentVitals.spo2 < currentVitals.spo2Risk.normalMin ? 'down' : 'stable'}
            onClick={() => {}}
          />
          <VitalCard
            label="Temperature" value={currentVitals.skinTemperature} unit="°C"
            icon={<Thermometer size={16} />}
            accentColor="hsl(25,90%,55%)" riskDetail={currentVitals.temperatureRisk}
            trend={currentVitals.skinTemperature > currentVitals.temperatureRisk.normalMax ? 'up' : 'stable'}
            onClick={() => {}}
          />
          <VitalCard
            label="Stress Level" value={currentVitals.stressLevel} unit=""
            icon={<Brain size={16} />}
            accentColor="hsl(270,60%,60%)" riskDetail={currentVitals.stressRisk}
            trend={currentVitals.stressLevel > currentVitals.stressRisk.normalMax ? 'up' : 'stable'}
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Charts + Sleep + Devices */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr 320px' }}>

        {/* Charts column */}
        <div className="col-span-2 grid gap-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(215,15%,65%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Heart Rate Trend
              </h3>
              <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)' }}>Last 6 min</span>
            </div>
            <LiveLineChart
              data={vitalHistory.heartRate}
              color="hsl(0,80%,60%)"
              unit="bpm" label="heartRate"
              baselineMin={currentVitals.heartRateRisk.normalMin}
              baselineMax={currentVitals.heartRateRisk.normalMax}
              height={140}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(215,15%,65%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SpO₂</h3>
                <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)' }}>Last 6 min</span>
              </div>
              <LiveLineChart
                data={vitalHistory.spo2}
                color="hsl(199,89%,55%)"
                unit="%" label="spo2"
                baselineMin={currentVitals.spo2Risk.normalMin}
                baselineMax={currentVitals.spo2Risk.normalMax}
                height={130}
                domain={[80, 100]}
              />
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(215,15%,65%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stress Level</h3>
                <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)' }}>Last 6 min</span>
              </div>
              <LiveLineChart
                data={vitalHistory.stress}
                color="hsl(270,60%,60%)"
                unit="" label="stress"
                baselineMin={currentVitals.stressRisk.normalMin}
                baselineMax={currentVitals.stressRisk.normalMax}
                height={130}
                domain={[0, 100]}
              />
            </div>
          </div>
        </div>

        {/* Right column: sleep + devices */}
        <div className="flex flex-col gap-4">
          <SleepScoreCard
            score={68}
            durationMinutes={MOCK_SLEEP_SESSION.durationMinutes}
            deepSleepMinutes={MOCK_SLEEP_SESSION.deepSleepMinutes}
            remMinutes={MOCK_SLEEP_SESSION.remMinutes}
            interruptions={MOCK_SLEEP_SESSION.interruptions}
            disturbanceDetected={MOCK_SLEEP_SESSION.disturbanceDetected}
            sessionStart={MOCK_SLEEP_SESSION.startTime}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'hsl(215,15%,50%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Devices
              </h3>
              <Link href="/protocol" style={{ fontSize: '11px', color: 'hsl(199,70%,55%)' }}>
                Manage <ChevronRight size={10} style={{ display: 'inline' }} />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {patientDevices.map(device => (
                <DeviceStatusCard key={device.id} device={device} compact />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Drawer */}
      {selectedAlert && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setSelectedAlert(null)}
          />
          <AlertDetailDrawer alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
        </>
      )}
    </div>
  );
}
