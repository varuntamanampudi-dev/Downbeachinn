'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, KeyRound, ArrowRight, RotateCcw, Terminal } from 'lucide-react';
import { requestOtp, verifyOtp } from './actions';
import type { RequestOtpResult, VerifyOtpResult } from './actions';

export default function AdminLoginPage() {
  const router = useRouter();

  // Step 1 state
  const [step1Result, setStep1Result] = useState<RequestOtpResult>({});
  const [step1Pending, startStep1] = useTransition();

  // Step 2 state
  const [step2Result, setStep2Result] = useState<VerifyOtpResult>({});
  const [step2Pending, startStep2] = useTransition();

  // Redirect once verified
  useEffect(() => {
    if (step2Result?.success) {
      router.push('/admin');
    }
  }, [step2Result, router]);

  const onStep2 = Boolean(step1Result?.phone);

  function handleStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startStep1(async () => {
      const result = await requestOtp({}, formData);
      setStep1Result(result);
    });
  }

  function handleStep2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startStep2(async () => {
      const result = await verifyOtp({}, formData);
      setStep2Result(result);
    });
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(155deg, #071320 0%, #0d1b2a 50%, #0a2a3a 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div aria-hidden style={{ position: 'absolute', top: '10%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '5%', left: '0%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,27,42,0.8) 0%, rgba(11,120,110,0.08) 70%, transparent 85%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      <div style={{ margin: 'auto', width: '100%', maxWidth: '420px', padding: '1.5rem', position: 'relative', zIndex: 1 }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #0d9488, #0a7c71)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 20px rgba(13,148,136,0.4)',
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>DB</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Downbeach Admin
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' }}>
            {onStep2 ? 'Enter the 6-digit code sent to your phone' : 'Sign in with your registered phone number'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '1.25rem',
          padding: '2rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}>

          {!onStep2 ? (
            /* ── Step 1: phone number ── */
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Phone size={16} color="rgba(255,255,255,0.3)" strokeWidth={2} />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="6093489111"
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 2.5rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.12)',
                      borderRadius: '0.65rem',
                      fontSize: '1rem',
                      color: 'white',
                      outline: 'none',
                      boxSizing: 'border-box',
                      letterSpacing: '0.08em',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>
                  10-digit US number · no dashes
                </p>
              </div>

              {step1Result?.error && (
                <div style={{ fontSize: '0.83rem', color: '#fca5a5', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.5rem', padding: '0.65rem 0.9rem' }}>
                  {step1Result.error}
                </div>
              )}

              <button
                type="submit"
                disabled={step1Pending}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: step1Pending ? 'rgba(13,148,136,0.5)' : 'var(--color-teal)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.65rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: step1Pending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                }}
              >
                {step1Pending ? 'Sending…' : <><span>Send Code</span> <ArrowRight size={16} /></>}
              </button>
            </form>

          ) : (
            /* ── Step 2: OTP entry ── */
            <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Dev-mode OTP hint */}
              {step1Result.devCode && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '0.65rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Terminal size={15} color="#f59e0b" strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Dev Mode · No SMS sent</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.3em' }}>{step1Result.devCode}</div>
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  6-Digit Code
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <KeyRound size={16} color="rgba(255,255,255,0.3)" strokeWidth={2} />
                  </div>
                  <input
                    name="code"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    placeholder="——————"
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 2.5rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.12)',
                      borderRadius: '0.65rem',
                      fontSize: '1.5rem',
                      letterSpacing: '0.35em',
                      color: 'white',
                      outline: 'none',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Hidden phone field so FormData includes it */}
              <input type="hidden" name="phone" value={step1Result.phone} />

              {step2Result?.error && (
                <div style={{ fontSize: '0.83rem', color: '#fca5a5', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.5rem', padding: '0.65rem 0.9rem' }}>
                  {step2Result.error}
                </div>
              )}

              <button
                type="submit"
                disabled={step2Pending}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: step2Pending ? 'rgba(13,148,136,0.5)' : 'var(--color-teal)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.65rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: step2Pending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                }}
              >
                {step2Pending ? 'Verifying…' : <><span>Verify &amp; Sign In</span> <ArrowRight size={16} /></>}
              </button>

              <button
                type="button"
                onClick={() => { setStep1Result({}); setStep2Result({}); }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: '0 auto' }}
              >
                <RotateCcw size={12} /> Use a different number
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
          Downbeach Inn Admin · Atlantic City, NJ
        </p>
      </div>
    </div>
  );
}
