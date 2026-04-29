'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, ArrowRight, RotateCcw } from 'lucide-react';
import { requestOtp, verifyOtp } from './actions';
import type { RequestOtpResult, VerifyOtpResult } from './actions';

export default function AdminLoginPage() {
  const router = useRouter();

  const [step1Result, setStep1Result] = useState<RequestOtpResult>({});
  const [step1Pending, startStep1] = useTransition();

  const [step2Result, setStep2Result] = useState<VerifyOtpResult>({});
  const [step2Pending, startStep2] = useTransition();

  useEffect(() => {
    if (step2Result?.success) router.push('/admin');
  }, [step2Result, router]);

  const onStep2 = Boolean(step1Result?.email);

  function handleStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startStep1(async () => {
      const result = await requestOtp({}, new FormData(e.currentTarget));
      setStep1Result(result);
    });
  }

  function handleStep2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startStep2(async () => {
      const result = await verifyOtp({}, new FormData(e.currentTarget));
      setStep2Result(result);
    });
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 2.5rem',
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '0.65rem',
    fontSize: '1rem',
    color: 'white',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(155deg, #071320 0%, #0d1b2a 50%, #0a2a3a 100%)', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', top: '10%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      <div style={{ margin: 'auto', width: '100%', maxWidth: '420px', padding: '1.5rem', position: 'relative', zIndex: 1 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #0d9488, #0a7c71)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 20px rgba(13,148,136,0.4)' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>DB</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Downbeach Admin
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' }}>
            {onStep2
              ? `Code sent to ${step1Result.email}`
              : 'Sign in with your registered email'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>

          {!onStep2 ? (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Mail size={16} color="rgba(255,255,255,0.3)" strokeWidth={2} />
                  </div>
                  <input name="email" type="email" placeholder="you@example.com" required autoFocus style={inputStyle} />
                </div>
              </div>

              {step1Result?.error && (
                <div style={{ fontSize: '0.83rem', color: '#fca5a5', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.5rem', padding: '0.65rem 0.9rem' }}>
                  {step1Result.error}
                </div>
              )}

              <button type="submit" disabled={step1Pending} style={{ width: '100%', padding: '0.85rem', background: step1Pending ? 'rgba(13,148,136,0.5)' : 'var(--color-teal)', color: 'white', border: 'none', borderRadius: '0.65rem', fontWeight: 700, fontSize: '0.95rem', cursor: step1Pending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {step1Pending ? 'Sending code…' : <><span>Send Code to Email</span><ArrowRight size={16} /></>}
              </button>
            </form>

          ) : (
            <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: '0.65rem', padding: '0.75rem 1rem', fontSize: '0.83rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                ✉️ A 6-digit code was sent to <strong style={{ color: 'white' }}>{step1Result.email}</strong>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  6-Digit Code
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <KeyRound size={16} color="rgba(255,255,255,0.3)" strokeWidth={2} />
                  </div>
                  <input name="code" type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} placeholder="——————" required autoFocus style={{ ...inputStyle, fontSize: '1.5rem', letterSpacing: '0.35em', textAlign: 'center' }} />
                </div>
              </div>

              <input type="hidden" name="email" value={step1Result.email} />

              {step2Result?.error && (
                <div style={{ fontSize: '0.83rem', color: '#fca5a5', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.5rem', padding: '0.65rem 0.9rem' }}>
                  {step2Result.error}
                </div>
              )}

              <button type="submit" disabled={step2Pending} style={{ width: '100%', padding: '0.85rem', background: step2Pending ? 'rgba(13,148,136,0.5)' : 'var(--color-teal)', color: 'white', border: 'none', borderRadius: '0.65rem', fontWeight: 700, fontSize: '0.95rem', cursor: step2Pending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {step2Pending ? 'Verifying…' : <><span>Verify &amp; Sign In</span><ArrowRight size={16} /></>}
              </button>

              <button type="button" onClick={() => { setStep1Result({}); setStep2Result({}); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: '0 auto' }}>
                <RotateCcw size={12} /> Use a different email
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
