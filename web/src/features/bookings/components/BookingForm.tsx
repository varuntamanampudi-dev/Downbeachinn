'use client';

import { useState } from 'react';
import { ROOMS } from '@/features/rooms/data';

type Step = 1 | 2 | 3;

function inputStyle(focused?: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '0.7rem 1rem',
    border: focused ? '2px solid var(--color-sky-400)' : '1.5px solid var(--color-sky-200)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.925rem',
    color: 'var(--color-text-primary)',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.2s',
  };
}

function labelStyle(): React.CSSProperties {
  return {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    marginBottom: '0.4rem',
    letterSpacing: '0.02em',
  };
}

export default function BookingForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomId: ROOMS[0].id,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [focused, setFocused] = useState<string | null>(null);

  const selectedRoom = ROOMS.find((r) => r.id === form.roomId)!;
  const nights =
    form.checkIn && form.checkOut
      ? Math.max(0, Math.round((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
      : 0;
  const total = nights * selectedRoom.pricePerNight;

  const updateForm = (key: keyof typeof form, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const today = new Date().toISOString().split('T')[0];

  const stepLabels = ['Dates & Room', 'Guest Details', 'Review'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '0', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1.5px solid var(--color-sky-200)' }}>
        {stepLabels.map((label, i) => {
          const s = (i + 1) as Step;
          const active = step === s;
          const done = step > s;
          return (
            <button
              key={label}
              onClick={() => done && setStep(s)}
              style={{
                flex: 1,
                padding: '0.65rem',
                border: 'none',
                borderRight: i < 2 ? '1px solid var(--color-sky-200)' : 'none',
                background: active ? 'var(--color-sky-600)' : done ? 'var(--color-sky-50)' : 'white',
                color: active ? 'white' : done ? 'var(--color-sky-600)' : 'var(--color-text-muted)',
                fontWeight: active ? 700 : 500,
                fontSize: '0.8rem',
                cursor: done ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
            >
              {done ? '✓ ' : `${s}. `}{label}
            </button>
          );
        })}
      </div>

      {/* ── STEP 1: Dates & Room ── */}
      {step === 1 && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-sky-900)' }}>Select Dates &amp; Room</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle()}>Check-in Date</label>
              <input
                type="date"
                value={form.checkIn}
                min={today}
                onChange={(e) => updateForm('checkIn', e.target.value)}
                onFocus={() => setFocused('checkIn')}
                onBlur={() => setFocused(null)}
                style={inputStyle(focused === 'checkIn')}
              />
            </div>
            <div>
              <label style={labelStyle()}>Check-out Date</label>
              <input
                type="date"
                value={form.checkOut}
                min={form.checkIn || today}
                onChange={(e) => updateForm('checkOut', e.target.value)}
                onFocus={() => setFocused('checkOut')}
                onBlur={() => setFocused(null)}
                style={inputStyle(focused === 'checkOut')}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle()}>Number of Guests</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => updateForm('guests', n)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    border: form.guests === n ? '2px solid var(--color-sky-500)' : '1.5px solid var(--color-sky-200)',
                    background: form.guests === n ? 'var(--color-sky-50)' : 'white',
                    color: form.guests === n ? 'var(--color-sky-700)' : 'var(--color-text-muted)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle()}>Room Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ROOMS.filter((r) => r.maxGuests >= form.guests).map((room) => (
                <button
                  key={room.id}
                  onClick={() => updateForm('roomId', room.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    border: form.roomId === room.id ? '2px solid var(--color-sky-400)' : '1.5px solid var(--color-sky-200)',
                    borderRadius: 'var(--radius-md)',
                    background: form.roomId === room.id ? 'var(--color-sky-50)' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-sky-900)' }}>{room.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{room.beds} · Up to {room.maxGuests} guests</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-sky-700)', fontSize: '1rem' }}>${room.pricePerNight}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>/night</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary strip */}
          {nights > 0 && (
            <div style={{ background: 'var(--color-sky-700)', color: 'white', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.875rem' }}>
                <strong>{nights}</strong> night{nights > 1 ? 's' : ''} · {selectedRoom.name}
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>${total}</div>
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            disabled={!form.checkIn || !form.checkOut || nights === 0}
            style={{
              padding: '0.8rem',
              background: !form.checkIn || !form.checkOut || nights === 0 ? '#cbd5e1' : 'linear-gradient(135deg, var(--color-sky-500), var(--color-sky-700))',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: !form.checkIn || !form.checkOut || nights === 0 ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s',
            }}
          >
            Continue to Guest Details →
          </button>
        </div>
      )}

      {/* ── STEP 2: Guest Details ── */}
      {step === 2 && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-sky-900)' }}>Your Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle()}>First Name</label>
              <input type="text" value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} onFocus={() => setFocused('first')} onBlur={() => setFocused(null)} placeholder="John" style={inputStyle(focused === 'first')} />
            </div>
            <div>
              <label style={labelStyle()}>Last Name</label>
              <input type="text" value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} onFocus={() => setFocused('last')} onBlur={() => setFocused(null)} placeholder="Smith" style={inputStyle(focused === 'last')} />
            </div>
          </div>

          <div>
            <label style={labelStyle()}>Email Address</label>
            <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} placeholder="john@example.com" style={inputStyle(focused === 'email')} />
          </div>

          <div>
            <label style={labelStyle()}>Phone Number</label>
            <input type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} placeholder="(555) 000-0000" style={inputStyle(focused === 'phone')} />
          </div>

          <div>
            <label style={labelStyle()}>Special Requests <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(optional)</span></label>
            <textarea
              value={form.specialRequests}
              onChange={(e) => updateForm('specialRequests', e.target.value)}
              onFocus={() => setFocused('notes')}
              onBlur={() => setFocused(null)}
              placeholder="Early check-in, ground floor room, accessibility needs..."
              rows={3}
              style={{ ...inputStyle(focused === 'notes'), resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: '0.8rem', background: 'white', color: 'var(--color-sky-700)', border: '2px solid var(--color-sky-200)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.firstName || !form.lastName || !form.email}
              style={{
                flex: 2,
                padding: '0.8rem',
                background: !form.firstName || !form.lastName || !form.email ? '#cbd5e1' : 'linear-gradient(135deg, var(--color-sky-500), var(--color-sky-700))',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: !form.firstName || !form.lastName || !form.email ? 'not-allowed' : 'pointer',
              }}
            >
              Review Booking →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review ── */}
      {step === 3 && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-sky-900)' }}>Review Your Booking</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'Room', value: selectedRoom.name },
              { label: 'Check-in', value: new Date(form.checkIn + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) },
              { label: 'Check-out', value: new Date(form.checkOut + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) },
              { label: 'Nights', value: String(nights) },
              { label: 'Guests', value: String(form.guests) },
              { label: 'Guest', value: `${form.firstName} ${form.lastName}` },
              { label: 'Email', value: form.email },
              { label: 'Phone', value: form.phone || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-sky-100)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--color-sky-700)', color: 'white', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{nights} night{nights > 1 ? 's' : ''} × ${selectedRoom.pricePerNight}/night</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.65, marginTop: '0.2rem' }}>Taxes & fees included</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>${total}</div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            By clicking &quot;Confirm Booking&quot; you agree to our cancellation policy. Payment will be processed securely via Shift4.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: '0.8rem', background: 'white', color: 'var(--color-sky-700)', border: '2px solid var(--color-sky-200)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
              ← Back
            </button>
            <button
              style={{ flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, var(--color-sky-500), var(--color-sky-700))', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(14,165,233,0.3)' }}
              onClick={() => alert('Payment integration coming in Phase 4!')}
            >
              Confirm Booking — ${total}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
