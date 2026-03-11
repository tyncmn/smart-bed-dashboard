'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Sidebar } from '@/components/Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authed = isAuthenticated();
    if (!authed && pathname !== '/login') router.push('/login');
    if (authed && pathname === '/login') router.push('/');
  }, [pathname, router]);

  if (!mounted) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'hsl(222,28%,7%)', color: 'hsl(215,12%,40%)', fontSize: '13px', gap: '10px' }}>
        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid hsl(199,89%,48%)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        Loading...
      </div>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
