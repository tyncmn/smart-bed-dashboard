'use client';

import React from 'react';
import { MOCK_PATIENTS, MOCK_SLEEP_SESSION, MOCK_NIGHTLY_SUMMARIES, getBaseline } from '@/lib/mock-data';
import { useDashboardStore } from '@/lib/store';
import { useRealtimeVitals } from '@/lib/use-realtime';
import { RiskBadge } from '@/components/RiskBadge';
import { formatDate } from '@/lib/utils';
import { User, Phone, Mail, Activity, Pill, CalendarDays, Stethoscope, Weight, Ruler, AlertCircle } from 'lucide-react';

export default function PatientPage() {
  useRealtimeVitals();
  const { activePatientId, currentVitals } = useDashboardStore();
  const patient = MOCK_PATIENTS.find(p => p.id === activePatientId) || MOCK_PATIENTS[0];
  const baseline = getBaseline(patient.ageGroup, patient.sex);

  return (
    <div style={{ padding: '24px', maxWidth: '1100px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,96%)', marginBottom: '6px' }}>Patient Detail</h1>
      <p style={{ fontSize: '13px', color: 'hsl(215,15%,50%)', marginBottom: '24px' }}>Demographic summary, baseline, emergency contacts, and protocol overview.</p>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Demographics */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'linear-gradient(135deg, hsl(199,89%,48%,0.2), hsl(220,70%,55%,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={24} style={{ color: 'hsl(199,89%,62%)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '18px', color: 'hsl(210,20%,96%)' }}>{patient.name}</div>
              <div style={{ fontSize: '12px', color: 'hsl(215,12%,48%)' }}>ID: {patient.id} · Room {patient.roomNumber}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Date of Birth', value: formatDate(patient.dateOfBirth), icon: CalendarDays },
              { label: 'Age', value: `${patient.age} years (${patient.ageGroup})`, icon: User },
              { label: 'Sex', value: patient.sex.charAt(0).toUpperCase() + patient.sex.slice(1), icon: User },
              { label: 'Weight', value: `${patient.weight} kg`, icon: Weight },
              { label: 'Height', value: `${patient.height} cm`, icon: Ruler },
              { label: 'Doctor', value: patient.primaryDoctor, icon: Stethoscope },
              { label: 'Admitted', value: formatDate(patient.admittedAt), icon: CalendarDays },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon size={12} style={{ color: 'hsl(215,12%,40%)', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10px', color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  <div style={{ fontSize: '13px', color: 'hsl(210,20%,85%)', fontWeight: 500 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions & Medications */}
        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={14} style={{ color: 'hsl(25,90%,55%)' }} />
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(215,15%,65%)' }}>Medical Conditions</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.conditions.map(c => (
                <span key={c} style={{
                  padding: '3px 10px', borderRadius: '6px', fontSize: '12px',
                  background: 'hsla(25,90%,50%,0.1)', border: '1px solid hsla(25,90%,50%,0.25)', color: 'hsl(25,90%,65%)'
                }}>{c}</span>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Pill size={14} style={{ color: 'hsl(270,60%,65%)' }} />
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(215,15%,65%)' }}>Current Medications</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.medications.map(m => (
                <span key={m} style={{
                  padding: '3px 10px', borderRadius: '6px', fontSize: '12px',
                  background: 'hsla(270,60%,55%,0.1)', border: '1px solid hsla(270,60%,55%,0.25)', color: 'hsl(270,60%,70%)'
                }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Baseline Comparison */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: 'hsl(199,89%,55%)' }} />
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(215,15%,65%)' }}>Baseline vs Current</h3>
            <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)', marginLeft: '4px' }}>Age {patient.ageGroup} · {patient.sex}</span>
          </div>
          {currentVitals && (
            <div className="flex flex-col gap-3">
              {[
                {
                  label: 'Heart Rate', current: `${currentVitals.heartRate} bpm`,
                  baseline: `${baseline.heartRateMin}–${baseline.heartRateMax} bpm`, risk: currentVitals.heartRateRisk.riskLevel,
                  pct: currentVitals.heartRateRisk.riskPercentage, dev: currentVitals.heartRateRisk.deviation,
                },
                {
                  label: 'SpO₂', current: `${currentVitals.spo2}%`,
                  baseline: `${baseline.spo2Min}–${baseline.spo2Max}%`, risk: currentVitals.spo2Risk.riskLevel,
                  pct: currentVitals.spo2Risk.riskPercentage, dev: currentVitals.spo2Risk.deviation,
                },
                {
                  label: 'Temperature', current: `${currentVitals.skinTemperature}°C`,
                  baseline: `${baseline.temperatureMin}–${baseline.temperatureMax}°C`, risk: currentVitals.temperatureRisk.riskLevel,
                  pct: currentVitals.temperatureRisk.riskPercentage, dev: currentVitals.temperatureRisk.deviation,
                },
                {
                  label: 'Stress Level', current: `${currentVitals.stressLevel}`,
                  baseline: `${baseline.stressMin}–${baseline.stressMax}`, risk: currentVitals.stressRisk.riskLevel,
                  pct: currentVitals.stressRisk.riskPercentage, dev: currentVitals.stressRisk.deviation,
                },
              ].map(({ label, current, baseline: b, risk, pct, dev }) => (
                <div key={label} className="flex items-center gap-4" style={{ padding: '10px', borderRadius: '8px', background: 'hsla(220,22%,11%,0.7)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: 'hsl(215,12%,40%)', marginBottom: '2px' }}>{label}</div>
                    <div className="flex items-baseline gap-2">
                      <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: risk !== 'normal' ? undefined : 'hsl(210,20%,92%)' }}>
                        {current}
                      </span>
                      <span style={{ fontSize: '11px', color: 'hsl(215,12%,45%)' }}>Baseline: {b}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <RiskBadge level={risk} size="sm" showIcon={false} />
                    {dev !== 0 && (
                      <span style={{ fontSize: '10px', color: 'hsl(215,12%,38%)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {dev > 0 ? '+' : ''}{dev.toFixed(1)} ({pct.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Phone size={14} style={{ color: 'hsl(152,69%,45%)' }} />
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(215,15%,65%)' }}>Emergency Contacts</h3>
          </div>
          <div className="flex flex-col gap-3">
            {patient.emergencyContacts.map((contact, i) => (
              <div key={i} className="card-elevated" style={{ padding: '12px' }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'hsl(210,20%,90%)' }}>{contact.name}</span>
                  <span style={{
                    padding: '1px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 600,
                    background: 'hsla(199,70%,50%,0.12)', border: '1px solid hsla(199,70%,50%,0.25)', color: 'hsl(199,70%,60%)'
                  }}>
                    Priority {contact.priority}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'hsl(215,12%,48%)', marginBottom: '8px' }}>{contact.relationship}</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2" style={{ fontSize: '12px', color: 'hsl(215,15%,60%)' }}>
                    <Phone size={11} /> {contact.phone}
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2" style={{ fontSize: '12px', color: 'hsl(215,15%,60%)' }}>
                      <Mail size={11} /> {contact.email}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
