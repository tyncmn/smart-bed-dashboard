'use client';

import React, { useState } from 'react';
import { BASELINES, ALERT_THRESHOLDS } from '@/lib/mock-data';
import { Baseline } from '@/lib/types';
import { Settings, Bell, Database, Edit3, Save, X } from 'lucide-react';

export default function AdminPage() {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [baselineData, setBaselineData] = useState<Baseline[]>(BASELINES);
  const [thresholds, setThresholds] = useState(ALERT_THRESHOLDS);

  const handleThresholdChange = (metric: string, field: string, val: number) => {
    setThresholds(prev => prev.map(t => t.metric === metric ? { ...t, [field]: val } : t));
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      <div className="flex items-center gap-3 mb-6">
        <Settings size={20} style={{ color: 'hsl(199,89%,55%)' }} />
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,96%)' }}>Admin Configuration</h1>
          <p style={{ fontSize: '13px', color: 'hsl(215,15%,50%)' }}>Manage baseline ranges, alert thresholds, and notification rules.</p>
        </div>
      </div>

      {/* Baseline Table */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Database size={14} style={{ color: 'hsl(43,90%,55%)' }} />
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'hsl(215,15%,70%)' }}>Baseline Range Table</h2>
          <span style={{ fontSize: '11px', color: 'hsl(215,12%,40%)', marginLeft: '8px' }}>By age group and sex</span>
        </div>
        <div className="card overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: 'hsl(220,22%,11%)' }}>
                {['Age Group', 'Sex', 'HR Min', 'HR Max', 'SpO₂ Min', 'SpO₂ Max', 'Temp Min', 'Temp Max', 'Stress Max', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {baselineData.map((b, i) => {
                const key = `${b.ageGroup}-${b.sex}`;
                const isEditing = editingRow === key;
                return (
                  <tr key={key} style={{ borderTop: '1px solid hsl(220,18%,14%)', background: i % 2 === 0 ? 'transparent' : 'hsla(220,22%,10%,0.3)' }}>
                    <td style={{ padding: '9px 14px', color: 'hsl(210,20%,85%)', fontWeight: 500 }}>{b.ageGroup}</td>
                    <td style={{ padding: '9px 14px', color: 'hsl(199,70%,60%)' }}>{b.sex.charAt(0).toUpperCase() + b.sex.slice(1)}</td>
                    {isEditing ? (
                      <>
                        {['heartRateMin','heartRateMax','spo2Min','spo2Max','temperatureMin','temperatureMax','stressMax'].map(field => (
                          <td key={field} style={{ padding: '6px 8px' }}>
                            <input
                              type="number"
                              value={(b as any)[field]}
                              onChange={e => {
                                const updated = baselineData.map(row =>
                                  `${row.ageGroup}-${row.sex}` === key
                                    ? { ...row, [field]: parseFloat(e.target.value) }
                                    : row
                                );
                                setBaselineData(updated);
                              }}
                              style={{
                                width: '62px', background: 'hsl(220,22%,16%)', border: '1px solid hsl(199,70%,45%)',
                                borderRadius: '5px', padding: '3px 6px', color: 'hsl(199,89%,60%)',
                                fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
                              }}
                            />
                          </td>
                        ))}
                        <td style={{ padding: '9px 14px' }}>
                          <button onClick={() => setEditingRow(null)} style={{ color: 'hsl(152,69%,45%)', marginRight: '8px' }}><Save size={14} /></button>
                          <button onClick={() => { setBaselineData(BASELINES); setEditingRow(null); }} style={{ color: 'hsl(215,12%,45%)' }}><X size={14} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        {[b.heartRateMin, b.heartRateMax, b.spo2Min, b.spo2Max, b.temperatureMin, b.temperatureMax, b.stressMax].map((val, vi) => (
                          <td key={vi} style={{ padding: '9px 14px', fontFamily: 'JetBrains Mono, monospace', color: 'hsl(215,15%,65%)' }}>{val}</td>
                        ))}
                        <td style={{ padding: '9px 14px' }}>
                          <button onClick={() => setEditingRow(key)} className="flex items-center gap-1 px-2 py-1 rounded" style={{
                            background: 'hsla(199,70%,50%,0.1)', border: '1px solid hsla(199,70%,50%,0.25)', color: 'hsl(199,70%,55%)', fontSize: '11px'
                          }}>
                            <Edit3 size={11} /> Edit
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Alert Thresholds */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={14} style={{ color: 'hsl(0,70%,55%)' }} />
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'hsl(215,15%,70%)' }}>Alert Threshold Configuration</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {thresholds.map(t => (
            <div key={t.metric} className="card p-5">
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'hsl(210,20%,92%)', marginBottom: '4px' }}>{t.metric}</div>
              <div style={{ fontSize: '11px', color: 'hsl(215,12%,45%)', marginBottom: '16px' }}>{t.description}</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Mild', field: 'mildThreshold', color: 'hsl(43,90%,55%)' },
                  { label: 'High', field: 'highThreshold', color: 'hsl(25,90%,55%)' },
                  { label: 'Critical', field: 'criticalThreshold', color: 'hsl(0,80%,55%)' },
                ].map(({ label, field, color }) => (
                  <div key={field}>
                    <div style={{ fontSize: '10px', color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={(t as any)[field]}
                        onChange={e => handleThresholdChange(t.metric, field, parseFloat(e.target.value))}
                        style={{
                          width: '56px', background: 'hsl(220,22%,14%)', border: `1px solid ${color}40`,
                          borderRadius: '6px', padding: '4px 8px', color,
                          fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
                        }}
                      />
                      <span style={{ fontSize: '11px', color: 'hsl(215,12%,45%)' }}>{t.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notification Rules */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={14} style={{ color: 'hsl(270,60%,65%)' }} />
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'hsl(215,15%,70%)' }}>Notification Rules</h2>
        </div>
        <div className="card overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'hsl(220,22%,11%)' }}>
                {['Rule', 'Trigger', 'Recipients', 'Channels', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'hsl(215,12%,40%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { rule: 'Critical Vital Alert', trigger: 'Risk Level = Critical', recipients: ['Dr. Attending', 'Head Nurse'], channels: ['pager', 'in_app'], active: true },
                { rule: 'High Risk Alert', trigger: 'Risk Level = High for 5 min', recipients: ['Nurse Station'], channels: ['in_app', 'sms'], active: true },
                { rule: 'Sleep Disturbance', trigger: 'Sleep disturbance detected', recipients: ['Night Nurse'], channels: ['in_app'], active: true },
                { rule: 'Device Offline', trigger: 'Device offline > 60s', recipients: ['IT Support', 'Nurse'], channels: ['email', 'in_app'], active: true },
              ].map((r, i) => (
                <tr key={r.rule} style={{ borderTop: '1px solid hsl(220,18%,14%)', background: i % 2 === 0 ? 'transparent' : 'hsla(220,22%,10%,0.3)' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, fontSize: '13px', color: 'hsl(210,20%,88%)' }}>{r.rule}</td>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: 'hsl(215,15%,55%)' }}>{r.trigger}</td>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: 'hsl(199,70%,60%)' }}>{r.recipients.join(', ')}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <div className="flex gap-1 flex-wrap">
                      {r.channels.map(ch => (
                        <span key={ch} style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '99px', textTransform: 'uppercase', background: 'hsla(199,70%,50%,0.1)', border: '1px solid hsla(199,70%,50%,0.25)', color: 'hsl(199,70%,55%)' }}>
                          {ch}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: r.active ? 'hsl(152,69%,45%)' : 'hsl(215,12%,40%)' }}>
                      {r.active ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
