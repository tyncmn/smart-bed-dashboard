import { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Login - SmartBed Health Monitor',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // Return early without rendering the Sidebar so the login page stands alone.
  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </div>
  );
}
