'use client';

import React from 'react';
import { User, ArrowLeft, Activity, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PatientPage() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100%', padding: '40px',
    }}>
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'hsl(220,25%,9%)',
        border: '1px solid hsl(220,18%,17%)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 24px',
          background: 'linear-gradient(135deg, hsla(199,89%,48%,0.15), hsla(220,70%,60%,0.1))',
          border: '1px solid hsla(199,89%,48%,0.2)',
          boxShadow: '0 0 28px hsla(199,89%,48%,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <User size={28} style={{ color: 'hsl(199,89%,60%)' }} />
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'hsl(210,20%,95%)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
          Patient Detail
        </h1>
        <p style={{ fontSize: '13.5px', color: 'hsl(215,12%,46%)', lineHeight: 1.7, marginBottom: '28px' }}>
          Patient profile management is not available in the current release.
          Use the Overview and Alert Center to monitor patient health in real time.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
          {[
            { icon: Activity, label: 'Live Monitoring', href: '/monitoring', color: 'hsl(152,69%,48%)' },
            { icon: Shield, label: 'Alert Center', href: '/alerts', color: 'hsl(0,70%,58%)' },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 16px', borderRadius: '10px',
              background: 'hsl(220,22%,13%)', border: '1px solid hsl(220,16%,21%)',
              color: 'hsl(215,15%,70%)', fontSize: '13px', fontWeight: 500,
              textDecoration: 'none', transition: 'border-color 0.15s',
            }}>
              <Icon size={15} style={{ color }} />
              {label}
            </Link>
          ))}
        </div>

        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', color: 'hsl(215,12%,40%)', textDecoration: 'none',
        }}>
          <ArrowLeft size={13} /> Back to Overview
        </Link>
      </div>
    </div>
  );
}
