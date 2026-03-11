'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { setTokens, setSession } from '@/lib/auth';
import { loginApi } from '@/lib/api';
import { Heart, Eye, EyeOff, AlertCircle, Loader2, Wifi } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi(email.trim(), password);
      setTokens(data.accessToken, data.refreshToken);
      setSession(data.userId, data.role);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    background: focusedField === name ? 'hsl(220,22%,13%)' : 'hsl(220,22%,11%)',
    border: `1.5px solid ${
      error && !loading ? 'hsla(0,70%,55%,0.35)' :
      focusedField === name ? 'hsl(199,89%,48%)' : 'hsl(220,18%,22%)'
    }`,
    borderRadius: '10px',
    padding: '13px 16px',
    color: 'hsl(210,20%,96%)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
    boxShadow: focusedField === name ? '0 0 0 3px hsla(199,89%,48%,0.12)' : 'none',
    boxSizing: 'border-box',
    opacity: loading ? 0.6 : 1,
  });

  const canSubmit = !loading && email.trim().length > 0 && password.length > 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'hsl(222,28%,7%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(hsl(220,18%,13%) 1px, transparent 1px),
          linear-gradient(90deg, hsl(220,18%,13%) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
      }} />

      {/* Glow behind card */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, hsla(199,89%,48%,0.07) 0%, transparent 65%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '420px',
        background: 'hsl(220,25%,9%)',
        border: '1px solid hsl(220,18%,17%)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px hsla(199,89%,48%,0.04) inset',
      }}>

        {/* Brand header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '13px', flexShrink: 0,
            background: 'linear-gradient(135deg, hsla(199,89%,48%,0.18), hsla(220,70%,60%,0.12))',
            border: '1px solid hsla(199,89%,48%,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px hsla(199,89%,48%,0.14)',
          }}>
            <Heart size={21} style={{ color: 'hsl(199,89%,60%)', fill: 'hsla(199,89%,60%,0.18)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '17px', fontWeight: 700, color: 'hsl(210,20%,96%)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              SmartBed
            </div>
            <div style={{ fontSize: '11px', color: 'hsl(199,80%,52%)', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', marginTop: '2px' }}>
              Health Monitor
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 8px', borderRadius: '6px', background: 'hsla(152,69%,45%,0.08)', border: '1px solid hsla(152,69%,45%,0.18)' }}>
            <Wifi size={11} style={{ color: 'hsl(152,69%,48%)' }} />
            <span style={{ fontSize: '10px', color: 'hsl(152,69%,52%)', fontWeight: 700, letterSpacing: '0.07em' }}>LIVE</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'hsl(210,20%,95%)', letterSpacing: '-0.025em', lineHeight: 1.25 }}>
            Sign in to dashboard
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '13.5px', color: 'hsl(215,12%,46%)', lineHeight: 1.6 }}>
            Enter your clinical credentials to access patient monitoring.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '12px 14px', borderRadius: '10px', marginBottom: '22px',
            background: 'hsla(0,72%,50%,0.07)',
            border: '1px solid hsla(0,72%,50%,0.22)',
          }}>
            <AlertCircle size={15} style={{ color: 'hsl(0,72%,65%)', flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '13px', color: 'hsl(0,72%,72%)', lineHeight: 1.5 }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Email */}
          <div>
            <label style={{
              display: 'block', fontSize: '11.5px', fontWeight: 600,
              color: 'hsl(215,12%,52%)', marginBottom: '7px',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); passwordRef.current?.focus(); }}}
              placeholder="doctor@hospital.com"
              autoComplete="email"
              disabled={loading}
              required
              style={inputStyle('email')}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', fontSize: '11.5px', fontWeight: 600,
              color: 'hsl(215,12%,52%)', marginBottom: '7px',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                required
                style={{ ...inputStyle('password'), paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: focusedField === 'password' ? 'hsl(215,12%,60%)' : 'hsl(215,12%,40%)',
                  padding: '4px', display: 'flex', alignItems: 'center',
                  transition: 'color 0.15s',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              marginTop: '2px',
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              background: canSubmit
                ? 'linear-gradient(135deg, hsl(199,89%,43%), hsl(210,82%,52%))'
                : 'hsl(220,18%,17%)',
              color: canSubmit ? 'hsl(210,20%,99%)' : 'hsl(215,12%,35%)',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s',
              boxShadow: canSubmit ? '0 6px 24px hsla(199,89%,48%,0.3)' : 'none',
            }}
          >
            {loading
              ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Signing in...</>
              : 'Sign In'
            }
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: '32px', borderTop: '1px solid hsl(220,18%,16%)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {[
              ['Access',  'Role-based · Doctor, Nurse, Operator'],
              ['Session', 'JWT · Encrypted · Audit logged'],
              ['Data',    'Apple Watch · Real-time sync'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'hsl(215,12%,36%)', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '11px', color: 'hsl(215,12%,46%)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::placeholder { color: hsl(215,12%,35%) !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px hsl(220,22%,13%) inset !important;
          -webkit-text-fill-color: hsl(210,20%,96%) !important;
        }
      `}</style>
    </div>
  );
}
