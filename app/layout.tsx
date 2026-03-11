import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'SmartBed Health Monitor',
  description: 'AI-based sleep and health monitoring dashboard for clinical and care environments.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
