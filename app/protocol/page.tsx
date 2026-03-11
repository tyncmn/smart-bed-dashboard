'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ProtocolPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4" style={{ color: 'hsl(215,15%,50%)' }}>
      <ShieldCheck size={40} style={{ color: 'hsl(215,12%,30%)' }} />
      <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'hsl(210,20%,85%)' }}>Protocol & Dispenser</h1>
      <p style={{ fontSize: '13px', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6 }}>
        Protocol management and pill dispenser controls are not available in the MVP.
      </p>
      <Link href="/" className="px-4 py-2 rounded-lg transition-all hover:brightness-110" style={{
        background: 'hsl(220,22%,16%)', border: '1px solid hsl(220,16%,24%)', color: 'hsl(199,70%,55%)', fontSize: '13px', fontWeight: 500,
      }}>
        Back to Overview
      </Link>
    </div>
  );
}
