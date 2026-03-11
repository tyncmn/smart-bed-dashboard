"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if the user is authenticated (token exists in localStorage)
    const authed = isAuthenticated();
    
    if (!authed && pathname !== '/login') {
      router.push('/login');
    } else if (authed && pathname === '/login') {
      router.push('/');
    }
  }, [pathname, router]);

  // Don't render until mounted to prevent hydration errors,
  // and don't render children if we are redirecting away to login.
  if (!mounted) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}
