'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Activity, Bell, Moon, ShieldCheck, Settings,
  Users, ChevronLeft, ChevronRight, Menu, BedDouble, Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/lib/store';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/patient', label: 'Patient Detail', icon: Users },
  { href: '/monitoring', label: 'Live Monitoring', icon: Activity },
  { href: '/alerts', label: 'Alert Center', icon: Bell },
  { href: '/sleep', label: 'Sleep Analytics', icon: Moon },
  { href: '/protocol', label: 'Protocol & Dispenser', icon: ShieldCheck },
  { href: '/admin', label: 'Admin Config', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, alerts } = useDashboardStore();
  const activeAlerts = alerts.filter(a => a.status === 'active' || a.status === 'escalated');

  return (
    <aside
      className="flex flex-col h-full relative transition-all duration-300"
      style={{
        width: isSidebarOpen ? '220px' : '60px',
        background: 'hsl(220,25%,8%)',
        borderRight: '1px solid hsl(220,18%,16%)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid hsl(220,18%,14%)' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '8px',
          background: 'linear-gradient(135deg, hsl(199,89%,48%), hsl(220,70%,55%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <BedDouble size={16} style={{ color: 'white' }} />
        </div>
        {isSidebarOpen && (
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'hsl(210,20%,96%)' }}>SmartBed</div>
            <div style={{ fontSize: '10px', color: 'hsl(215,12%,45%)', letterSpacing: '0.06em' }}>HEALTH MONITOR</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const isBell = href === '/alerts';
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 mx-2 mb-1 rounded-lg relative transition-all duration-150"
              style={{
                padding: isSidebarOpen ? '9px 12px' : '9px 14px',
                background: isActive ? 'hsla(199,89%,48%,0.15)' : 'transparent',
                color: isActive ? 'hsl(199,89%,62%)' : 'hsl(215,15%,55%)',
                borderLeft: isActive ? '2px solid hsl(199,89%,48%)' : '2px solid transparent',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {isSidebarOpen && (
                <span style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
              )}
              {isBell && activeAlerts.length > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'hsl(0,80%,55%)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '99px',
                  padding: '1px 6px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}>
                  {activeAlerts.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Patient selector */}
      {isSidebarOpen && (
        <PatientSelector />
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full"
        style={{
          background: 'hsl(220,22%,18%)',
          border: '1px solid hsl(220,16%,24%)',
          color: 'hsl(215,15%,55%)',
          zIndex: 10,
        }}
      >
        {isSidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  );
}

function PatientSelector() {
  const { activePatientId, setActivePatient, scenario, setScenario } = useDashboardStore();
  const patients = [
    { id: 'p-001', name: 'Sarah Chen', room: '4B-201' },
    { id: 'p-002', name: 'Robert Okonkwo', room: '2A-108' },
  ];

  return (
    <div style={{ borderTop: '1px solid hsl(220,18%,14%)', padding: '12px 8px' }}>
      <div style={{ fontSize: '10px', color: 'hsl(215,12%,38%)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px', paddingLeft: '8px' }}>
        Active Patient
      </div>
      {patients.map(p => (
        <button
          key={p.id}
          onClick={() => setActivePatient(p.id)}
          className="w-full text-left rounded-lg px-3 py-2 mb-1 transition-all"
          style={{
            background: activePatientId === p.id ? 'hsla(199,89%,48%,0.12)' : 'transparent',
            border: `1px solid ${activePatientId === p.id ? 'hsla(199,89%,48%,0.3)' : 'transparent'}`,
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: activePatientId === p.id ? 'hsl(199,89%,62%)' : 'hsl(215,15%,60%)' }}>
            {p.name}
          </div>
          <div style={{ fontSize: '10px', color: 'hsl(215,12%,38%)' }}>Room {p.room}</div>
        </button>
      ))}

      {/* Scenario switcher for demo */}
      <div style={{ marginTop: '12px', paddingLeft: '4px' }}>
        <div style={{ fontSize: '10px', color: 'hsl(215,12%,38%)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>
          Demo Scenario
        </div>
        <div className="grid grid-cols-2 gap-1">
          {(['normal', 'mild', 'high', 'critical'] as const).map(s => {
            const colors = {
              normal: 'hsl(152,69%,45%)', mild: 'hsl(43,90%,55%)',
              high: 'hsl(25,90%,55%)', critical: 'hsl(0,80%,55%)'
            };
            return (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className="rounded px-2 py-1 text-center transition-all"
                style={{
                  fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
                  background: scenario === s ? `${colors[s]}20` : 'hsla(220,18%,16%,0.5)',
                  color: scenario === s ? colors[s] : 'hsl(215,12%,40%)',
                  border: `1px solid ${scenario === s ? colors[s] + '40' : 'transparent'}`,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
