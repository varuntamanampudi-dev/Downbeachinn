'use client';

import { useState } from 'react';
import type { Room } from '@/features/rooms/types';
import { calcPricing, formatMoney } from '@/lib/pricing';

interface Props {
  roomTypes: Room[];
  taxRate: number;
}

type Step = 1 | 2 | 3;

function inputStyle(focused: boolean): React.CSSProperties {
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.4rem', letterSpacing: '0.02em' }}>
      {children}
    </label>
  );
}

export default function BookingForm({ roomTypes, taxRate }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    roomId: roomTypes[0]?.id ?? 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [focused, setFocused] = useState<string>('');

  const upd = (key: keyof typeof form, value: string | number) =>
    setForm((p) => ({ ...p, [key]: value }));

  const selectedRoom = roomTypes.find((r) => r.id === form.roomId) ?? roomTypes[0];
  const nights =
    form.checkIn && form.checkOut
      ? Math.max(0, Math.round((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
      : 0;

  const pricing = selectedRoom ? calcPricing(selectedRoom.basePricePerNight, nights, taxRate) : null;
  const today = new Date().toISOString().split('T')[0];
  const eligibleRooms = roomTypes.filter((r) => r.maxGuests >= form.guests);

  const step1Ready = !!form.checkIn && !!form.checkOut && nights > 0;
  const step2Ready = !!form.firstName && !!form.lastName && !!form.email;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1.5px solid var(--color-sky-200)' }}>
        {(['Dates & Room', 'Your Details', 'Review'] as const).map((label, i) => {
          const s = (i + 1) as Step;
          const active = step === s;
          const done = step > s;
          return (
            <button key={label} onClick={() => done && setStep(s)} style={{ flex: 1, padding: '0.65rem', border: 'none', borderRight: i < 2 ? '1px solid var(--color-sky-200)' : 'none', background: active ? 'var(--color-sky-600)' : done ? 'var(--color-sky-50)' : 'white', color: active ? 'white' : done ? 'var(--color-sky-600)' : 'var(--color-text-muted)', fontWeight: active ? 700 : 500, fontSize: '0.8rem', cursor: done ? 'pointer' : 'default', transition: 'all 0.2s' }}>
              {done ? '✓ ' : `${s}. `}{label}
            </button>
          );
        })}
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-sky-900)' }}>Select Dates &amp; Room</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Label>Check-in</Label>
              <input type="date" value={form.checkIn} min={today} onChange={(e) => upd('checkIn', e.target.value)} onFocus={() => setFocused('checkIn')} onBlur={() => setFocused('')} style={inputStyle(focused === 'checkIn')} />
            </div>
            <div>
              <Label>Check-out</Label>
              <input type="date" value={form.checkOut} min={form.checkIn || today} onChange={(e) => upd('checkOut', e.target.value)} onFocus={() => setFocused('checkOut')} onBlur={() => setFocused('')} style={inputStyle(focused === 'checkOut')} />
            </div>
          </div>

          <div>
            <Label>Number of Guests</Label>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4].map((n) => (
                <button key={n} onClick={() => upd('guests', n)} style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', border: form.guests === n ? '2px solid var(--color-sky-500)' : '1.5px solid var(--color-sky-200)', background: form.guests === n ? 'var(--color-sky-50)' : 'white', color: form.guests === n ? 'var(--color-sky-700)' : 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Room Type</Label>
            {eligibleRooms.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', padding: '1rem', background: 'var(--color-sky-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-sky-200)' }}>
                No rooms available for {form.guests} guests. Please select fewer guests.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {eligibleRooms.map((room) => (
                  <button key={room.id} onClick={() => upd('roomId', room.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', border: form.roomId === room.id ? '2px solid var(--color-sky-400)' : '1.5px solid var(--color-sky-200)', borderRadius: 'var(--radius-md)', background: form.roomId === room.id ? 'var(--color-sky-50)' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-sky-900)' }}>{room.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                        {room.beds} · Up to {room.maxGuests} guest{room.maxGuests > 1 ? 's' : ''}
                        {room.hasJacuzzi ? ' · 🛁 Jacuzzi' : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-sky-700)', fontSize: '1rem' }}>${formatMoney(room.basePricePerNight)}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>/night + tax</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Summary strip */}
          {pricing && nights > 0 && (
            <div style={{ background: 'var(--color-sky-700)', color: 'white', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{nights} night{nights > 1 ? 's' : ''} · {selectedRoom?.name}</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>${formatMoney(pricing.total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', opacity: 0.8 }}>
                <span>${formatMoney(pricing.pricePerNight)}/night × {nights} nights = ${formatMoney(pricing.subtotal)}</span>
                <span>Tax: ${formatMoney(pricing.taxAmount)}</span>
              </div>
            </div>
          )}

          <button onClick={() => setStep(2)} disabled={!step1Ready} style={{ padding: '0.8rem', background: step1Ready ? 'linear-gradient(135deg, var(--color-sky-500), var(--color-sky-700))' : '#cbd5e1', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.95rem', cursor: step1Ready ? 'pointer' : 'not-allowed' }}>
            Continue to Your Details →
          </button>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-sky-900)' }}>Your Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Label>First Name *</Label>
              <input type="text" value={form.firstName} onChange={(e) => upd('firstName', e.target.value)} onFocus={() => setFocused('first')} onBlur={() => setFocused('')} placeholder="John" style={inputStyle(focused === 'first')} />
            </div>
            <div>
              <Label>Last Name *</Label>
              <input type="text" value={form.lastName} onChange={(e) => upd('lastName', e.target.value)} onFocus={() => setFocused('last')} onBlur={() => setFocused('')} placeholder="Smith" style={inputStyle(focused === 'last')} />
            </div>
          </div>

          <div>
            <Label>Email Address *</Label>
            <input type="email" value={form.email} onChange={(e) => upd('email', e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} placeholder="john@example.com" style={inputStyle(focused === 'email')} />
          </div>

          <div>
            <Label>Phone Number</Label>
            <input type="tel" value={form.phone} onChange={(e) => upd('phone', e.target.value)} onFocus={() => setFocused('phone')} onBlur={() => setFocused('')} placeholder="(555) 000-0000" style={inputStyle(focused === 'phone')} />
          </div>

          <div>
            <Label>Special Requests <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(optional)</span></Label>
            <textarea value={form.specialRequests} onChange={(e) => upd('specialRequests', e.target.value)} onFocus={() => setFocused('notes')} onBlur={() => setFocused('')} placeholder="Early check-in, ground floor, accessibility needs..." rows={3} style={{ ...inputStyle(focused === 'notes'), resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: '0.8rem', background: 'white', color: 'var(--color-sky-700)', border: '2px solid var(--color-sky-200)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
            <button onClick={() => setStep(3)} disabled={!step2Ready} style={{ flex: 2, padding: '0.8rem', background: step2Ready ? 'linear-gradient(135deg, var(--color-sky-500), var(--color-sky-700))' : '#cbd5e1', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.95rem', cursor: step2Ready ? 'pointer' : 'not-allowed' }}>
              Review Booking →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && pricing && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-sky-900)' }}>Review Your Booking</h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { label: 'Room', value: selectedRoom?.name ?? '' },
              { label: 'Check-in', value: new Date(form.checkIn + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) },
              { label: 'Check-out', value: new Date(form.checkOut + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) },
              { label: 'Nights', value: String(nights) },
              { label: 'Guests', value: String(form.guests) },
              { label: 'Guest Name', value: `${form.firstName} ${form.lastName}` },
              { label: 'Email', value: form.email },
              { label: 'Phone', value: form.phone || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.55rem 0', borderBottom: '1px solid var(--color-sky-100)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div style={{ background: 'var(--color-sky-50)', border: '1px solid var(--color-sky-200)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <span>${formatMoney(pricing.pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}</span>
              <span>${formatMoney(pricing.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <span>NJ Hotel/Motel Tax ({pricing.taxRatePercent}%)</span>
              <span>${formatMoney(pricing.taxAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-sky-900)', borderTop: '1px solid var(--color-sky-200)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
              <span>Total</span>
              <span>${formatMoney(pricing.total)}</span>
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            By clicking &quot;Confirm Booking&quot; you agree to our cancellation policy. Payment will be processed securely via Shift4.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: '0.8rem', background: 'white', color: 'var(--color-sky-700)', border: '2px solid var(--color-sky-200)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
            <button onClick={() => alert('Payment integration coming in Phase 4!')} style={{ flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, var(--color-sky-500), var(--color-sky-700))', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(14,165,233,0.3)' }}>
              Confirm Booking — ${formatMoney(pricing.total)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
