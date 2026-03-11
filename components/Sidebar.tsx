'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Activity, Bell, Moon, Settings,
  ChevronLeft, ChevronRight, BedDouble, Watch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/lib/store';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/monitoring', label: 'Live Monitoring', icon: Activity },
  { href: '/alerts', label: 'Alert Center', icon: Bell },
  { href: '/sleep', label: 'Sleep Analytics', icon: Moon },
  { href: '/admin', label: 'Admin Config', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, currentStatus } = useDashboardStore();
  const unreadCount = currentStatus?.unreadAlertCount ?? 0;

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
              {isBell && unreadCount > 0 && (
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
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Apple Watch status */}
      {isSidebarOpen && (
        <div style={{ borderTop: '1px solid hsl(220,18%,14%)', padding: '16px 12px' }}>
          <div className="flex items-center gap-2">
            <Watch size={14} style={{ color: 'hsl(152,69%,52%)' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(152,69%,52%)' }}>Apple Watch</span>
            <span className="live-dot" style={{ marginLeft: 'auto' }} />
          </div>
          <div style={{ fontSize: '10px', color: 'hsl(215,12%,40%)', marginTop: '4px', paddingLeft: '22px' }}>
            Connected · Streaming
          </div>
        </div>
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
