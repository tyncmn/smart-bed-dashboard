'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Bell, Moon, Settings,
  ChevronLeft, ChevronRight, BedDouble, BarChart2, Watch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/lib/store';
import { getUserId } from '@/lib/auth';

const NAV_ITEMS = [
  { href: '/', label: 'Live Monitoring', icon: LayoutDashboard },
  { href: '/alerts', label: 'Alert Center', icon: Bell },
  { href: '/sleep', label: 'Sleep Analytics', icon: Moon },
  { href: '/dashboard', label: 'Sleep Dashboard', icon: BarChart2 },
  { href: '/admin', label: 'Admin Config', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, currentStatus } = useDashboardStore();
  const unreadCount = currentStatus?.unreadAlertCount ?? 0;
  const userId = getUserId();

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
          width: 34, height: 34, borderRadius: '10px',
          background: 'linear-gradient(135deg, hsla(199,89%,48%,0.22), hsla(220,70%,55%,0.15))',
          border: '1px solid hsla(199,89%,48%,0.25)',
          boxShadow: '0 0 18px hsla(199,89%,48%,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <BedDouble size={16} style={{ color: 'hsl(199,89%,65%)' }} />
        </div>
        {isSidebarOpen && (
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'hsl(210,20%,96%)', letterSpacing: '-0.01em' }}>SmartBed</div>
            <div style={{ fontSize: '10px', color: 'hsl(199,80%,50%)', letterSpacing: '0.08em', fontWeight: 600 }}>HEALTH MONITOR</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const resolvedHref =
            href === '/dashboard' && userId ? `/dashboard/${userId}` : href;
          const isActive =
            href === '/dashboard'
              ? pathname.startsWith('/dashboard')
              : pathname === href;
          const isBell = href === '/alerts';
          return (
            <Link
              key={href}
              href={resolvedHref}
              className="flex items-center gap-3 mx-2 mb-1 rounded-xl relative transition-all duration-150"
              style={{
                padding: isSidebarOpen ? '9px 12px' : '9px 14px',
                background: isActive ? 'hsla(199,89%,48%,0.12)' : 'transparent',
                color: isActive ? 'hsl(199,89%,65%)' : 'hsl(215,15%,52%)',
                borderLeft: isActive ? '2px solid hsl(199,89%,50%)' : '2px solid transparent',
                boxShadow: isActive ? '0 0 16px hsla(199,89%,48%,0.08) inset' : 'none',
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
        <div style={{ borderTop: '1px solid hsl(220,18%,14%)', padding: '14px 12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 10px', borderRadius: '10px',
            background: 'hsla(152,69%,45%,0.07)',
            border: '1px solid hsla(152,69%,45%,0.15)',
          }}>
            <Watch size={13} style={{ color: 'hsl(152,69%,52%)' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(152,69%,52%)' }}>Apple Watch</span>
            <span className="live-dot" style={{ marginLeft: 'auto' }} />
          </div>
          <div style={{ fontSize: '10px', color: 'hsl(215,12%,38%)', marginTop: '6px', paddingLeft: '4px' }}>
            Connected · Real-time streaming
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
