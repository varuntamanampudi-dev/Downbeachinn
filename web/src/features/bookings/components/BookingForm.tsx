'use client';

import { useState } from 'react';
import type { Room } from '@/features/rooms/types';
import { calcPricing, formatMoney } from '@/lib/pricing';

interface Props {
  roomTypes: Room[];
  taxRate: number;
}

type Step = 1 | 2 | 3;

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

function isRoomEligible(room: Room, adults: number, children: number): boolean {
  if (room.type === 'double') return adults <= 4;
  return adults <= 2 && children <= 1;
}

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '0.7rem 1rem',
    border: focused ? `2px solid var(--color-teal)` : '1.5px solid rgba(13,148,136,0.25)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.925rem',
    color: 'var(--color-text-primary)',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block', fontSize: '0.8rem', fontWeight: 600,
      color: 'var(--color-text-secondary)', marginBottom: '0.4rem', letterSpacing: '0.02em',
    }}>
      {children}
    </label>
  );
}

function CounterBtn({ value, onChange, min, max, label }: {
  value: number; onChange: (n: number) => void; min: number; max: number; label: string;
}) {
  const btnBase: React.CSSProperties = {
    width: '36px', height: '36px', borderRadius: '50%',
    border: '1.5px solid rgba(13,148,136,0.25)',
    fontWeight: 700, fontSize: '1.1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        style={{ ...btnBase, background: value <= min ? '#f8fafc' : 'white', color: value <= min ? '#cbd5e1' : 'var(--color-teal)', cursor: value <= min ? 'not-allowed' : 'pointer' }}>
        −
      </button>
      <div style={{ minWidth: '60px', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-navy)' }}>{value}</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{label}</div>
      </div>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
        style={{ ...btnBase, background: value >= max ? '#f8fafc' : 'white', color: value >= max ? '#cbd5e1' : 'var(--color-teal)', cursor: value >= max ? 'not-allowed' : 'pointer' }}>
        +
      </button>
    </div>
  );
}

export default function BookingForm({ roomTypes, taxRate }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    checkIn: '', checkOut: '', adults: 2, children: 0,
    roomId: roomTypes[0]?.id ?? 0,
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: 'NJ', zip: '', specialRequests: '',
  });
  const [focused, setFocused] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  const upd = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const today = new Date().toISOString().split('T')[0];
  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.round((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;

  const eligibleRooms = roomTypes.filter((r) => isRoomEligible(r, form.adults, form.children));
  const selectedRoom = eligibleRooms.find((r) => r.id === form.roomId) ?? eligibleRooms[0];
  const pricing = selectedRoom ? calcPricing(selectedRoom.basePricePerNight, nights, taxRate, form.adults) : null;

  if (selectedRoom && form.roomId !== selectedRoom.id) upd('roomId', selectedRoom.id);

  async function handleConfirm() {
    setSubmitting(true);
    setBookingError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, roomId: selectedRoom?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setConfirmationCode(data.confirmationCode);
      setSubmitted(true);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const step1Ready = !!form.checkIn && !!form.checkOut && nights > 0 && !!selectedRoom;
  const step2Ready =
    !!form.firstName && !!form.lastName && !!form.email &&
    !!form.phone && !!form.address && !!form.city && !!form.state && !!form.zip;

  // ── Shared styles ──────────────────────────────────────────────
  const infoBox: React.CSSProperties = {
    fontSize: '0.78rem', color: 'var(--color-teal)',
    marginTop: '0.5rem', background: 'var(--color-teal-50)',
    padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(13,148,136,0.2)',
  };

  const btnPrimary = (disabled: boolean): React.CSSProperties => ({
    padding: '0.8rem', color: 'white', border: 'none',
    borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.95rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#cbd5e1' : 'var(--color-teal)',
    boxShadow: disabled ? 'none' : '0 4px 16px rgba(13,148,136,0.35)',
    transition: 'background 0.2s',
  });

  const btnBack: React.CSSProperties = {
    flex: 1, padding: '0.8rem', background: 'white',
    color: 'var(--color-teal)', border: '2px solid rgba(13,148,136,0.25)',
    borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Step indicator ── */}
      <div style={{ display: 'flex', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1.5px solid rgba(13,148,136,0.25)' }}>
        {(['Dates & Room', 'Your Details', 'Review'] as const).map((label, i) => {
          const s = (i + 1) as Step;
          const active = step === s;
          const done = step > s;
          return (
            <button key={label} type="button" onClick={() => done && setStep(s)} style={{
              flex: 1, padding: '0.65rem',
              border: 'none', borderRight: i < 2 ? '1px solid rgba(13,148,136,0.2)' : 'none',
              background: active ? 'var(--color-teal)' : done ? 'var(--color-teal-50)' : 'white',
              color: active ? 'white' : done ? 'var(--color-teal)' : 'var(--color-text-muted)',
              fontWeight: active ? 700 : 500, fontSize: '0.8rem',
              cursor: done ? 'pointer' : 'default', transition: 'all 0.2s',
            }}>
              {done ? '✓ ' : `${s}. `}{label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════
          STEP 1 — Dates & Room
          ══════════════════════════════════════════ */}
      {step === 1 && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-navy)' }}>Select Dates &amp; Room</h2>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Label>Check-in</Label>
              <input type="date" value={form.checkIn} min={today}
                onChange={(e) => upd('checkIn', e.target.value)}
                onFocus={() => setFocused('checkIn')} onBlur={() => setFocused('')}
                style={inputStyle(focused === 'checkIn')} />
            </div>
            <div>
              <Label>Check-out</Label>
              <input type="date" value={form.checkOut} min={form.checkIn || today}
                onChange={(e) => upd('checkOut', e.target.value)}
                onFocus={() => setFocused('checkOut')} onBlur={() => setFocused('')}
                style={inputStyle(focused === 'checkOut')} />
            </div>
          </div>

          {/* Guests */}
          <div>
            <Label>Guests</Label>
            <div style={{ background: 'var(--color-teal-50)', border: '1.5px solid rgba(13,148,136,0.25)', borderRadius: 'var(--radius-md)', padding: '1.1rem 1.25rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-teal)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Adults</div>
                <CounterBtn value={form.adults} onChange={(n) => upd('adults', n)} min={1} max={4} label="adult(s)" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-teal)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  Children <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', textTransform: 'none', letterSpacing: 0 }}>(under 17 · free)</span>
                </div>
                <CounterBtn value={form.children} onChange={(n) => upd('children', n)} min={0} max={4} label="child(ren)" />
              </div>
            </div>
            {form.adults > 2 && (
              <p style={infoBox}>
                ℹ️ Extra adult fee: <strong>+${(form.adults - 2) * 10}/night</strong> for {form.adults - 2} additional adult{form.adults - 2 > 1 ? 's' : ''}. Only Double rooms available for 3+ adults.
              </p>
            )}
            {form.children > 1 && (
              <p style={infoBox}>
                ℹ️ King, Queen &amp; Suite rooms fit 1 child max. Only Double rooms available for 2+ children.
              </p>
            )}
          </div>

          {/* Room selection */}
          <div>
            <Label>Room Type</Label>
            {eligibleRooms.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', padding: '1rem', background: 'var(--color-teal-50)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(13,148,136,0.2)' }}>
                No rooms available for this guest combination. Please adjust your guests.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {eligibleRooms.map((room) => (
                  <button key={room.id} type="button" onClick={() => upd('roomId', room.id)} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1rem 1.25rem', textAlign: 'left', gap: '1rem', cursor: 'pointer',
                    border: form.roomId === room.id ? '2px solid var(--color-teal)' : '1.5px solid rgba(13,148,136,0.2)',
                    borderRadius: 'var(--radius-md)',
                    background: form.roomId === room.id ? 'var(--color-teal-50)' : 'white',
                    transition: 'all 0.15s',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-navy)' }}>{room.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                        {room.beds} · Up to {room.maxGuests} adults{room.hasJacuzzi ? ' · 🛁 Jacuzzi' : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-teal)', fontSize: '1rem' }}>${formatMoney(room.basePricePerNight)}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>/night excl. tax</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing summary */}
          {pricing && nights > 0 && (
            <div style={{ background: 'var(--color-navy)', color: 'white', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{nights} night{nights > 1 ? 's' : ''} · {selectedRoom?.name}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>${formatMoney(pricing.subtotal)}</span>
                  <span style={{ fontSize: '0.72rem', opacity: 0.65, marginLeft: '0.3rem' }}>excl. tax</span>
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', opacity: 0.7, display: 'flex', justifyContent: 'space-between' }}>
                <span>${formatMoney(pricing.pricePerNight)}/night{pricing.extraAdultFeePerNight > 0 ? ` + $${pricing.extraAdultFeePerNight} extra adults` : ''} × {nights} nights</span>
                <span>+ ${formatMoney(pricing.taxAmount)} tax</span>
              </div>
            </div>
          )}

          <button type="button" onClick={() => setStep(2)} disabled={!step1Ready}
            style={{ ...btnPrimary(!step1Ready) }}>
            Continue to Your Details →
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════
          STEP 2 — Guest Details
          ══════════════════════════════════════════ */}
      {step === 2 && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-navy)' }}>Your Details</h2>

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Label>Email Address *</Label>
              <input type="email" value={form.email} onChange={(e) => upd('email', e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} placeholder="john@example.com" style={inputStyle(focused === 'email')} />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <input type="tel" value={form.phone} onChange={(e) => upd('phone', e.target.value)} onFocus={() => setFocused('phone')} onBlur={() => setFocused('')} placeholder="(555) 000-0000" style={inputStyle(focused === 'phone')} />
            </div>
          </div>

          <div>
            <Label>Street Address *</Label>
            <input type="text" value={form.address} onChange={(e) => upd('address', e.target.value)} onFocus={() => setFocused('address')} onBlur={() => setFocused('')} placeholder="123 Main Street" style={inputStyle(focused === 'address')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <Label>City *</Label>
              <input type="text" value={form.city} onChange={(e) => upd('city', e.target.value)} onFocus={() => setFocused('city')} onBlur={() => setFocused('')} placeholder="Atlantic City" style={inputStyle(focused === 'city')} />
            </div>
            <div>
              <Label>State *</Label>
              <select value={form.state} onChange={(e) => upd('state', e.target.value)} onFocus={() => setFocused('state')} onBlur={() => setFocused('')} style={{ ...inputStyle(focused === 'state'), appearance: 'auto' }}>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <Label>ZIP Code *</Label>
              <input type="text" value={form.zip} onChange={(e) => upd('zip', e.target.value)} onFocus={() => setFocused('zip')} onBlur={() => setFocused('')} placeholder="08401" maxLength={10} style={inputStyle(focused === 'zip')} />
            </div>
          </div>

          <div>
            <Label>Special Requests <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(optional)</span></Label>
            <textarea value={form.specialRequests} onChange={(e) => upd('specialRequests', e.target.value)} onFocus={() => setFocused('notes')} onBlur={() => setFocused('')} placeholder="Early check-in, ground floor, accessibility needs..." rows={3} style={{ ...inputStyle(focused === 'notes'), resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={() => setStep(1)} style={btnBack}>← Back</button>
            <button type="button" onClick={() => setStep(3)} disabled={!step2Ready}
              style={{ ...btnPrimary(!step2Ready), flex: 2 }}>
              Review Booking →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          STEP 3 — Confirmed
          ══════════════════════════════════════════ */}
      {step === 3 && submitted && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🏖️</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-navy)' }}>Booking Request Received!</h2>
          <div style={{ background: 'var(--color-teal-50)', border: '2px solid var(--color-teal)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.5rem', margin: '0.25rem 0' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-teal)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Confirmation Number</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-navy)', letterSpacing: '0.1em' }}>{confirmationCode}</div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '380px' }}>
            Thank you, <strong>{form.firstName}</strong>! A confirmation email has been sent to <strong>{form.email}</strong>. We&apos;ll be in touch to confirm and arrange payment.
          </p>
          <button type="button" onClick={() => { setStep(1); setSubmitted(false); setConfirmationCode(''); }}
            style={{ marginTop: '0.5rem', padding: '0.7rem 1.5rem', background: 'var(--color-teal)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(13,148,136,0.35)' }}>
            Make Another Booking
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════
          STEP 3 — Review
          ══════════════════════════════════════════ */}
      {step === 3 && !submitted && pricing && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-navy)' }}>Review Your Booking</h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { label: 'Room',       value: selectedRoom?.name ?? '' },
              { label: 'Check-in',   value: new Date(form.checkIn + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) },
              { label: 'Check-out',  value: new Date(form.checkOut + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) },
              { label: 'Nights',     value: String(nights) },
              { label: 'Adults',     value: String(form.adults) },
              { label: 'Children',   value: form.children > 0 ? `${form.children} (free, under 17)` : '0' },
              { label: 'Guest Name', value: `${form.firstName} ${form.lastName}` },
              { label: 'Email',      value: form.email },
              { label: 'Phone',      value: form.phone },
              { label: 'Address',    value: `${form.address}, ${form.city}, ${form.state} ${form.zip}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.55rem 0', borderBottom: '1px solid rgba(13,148,136,0.1)', gap: '1rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, flexShrink: 0 }}>{label}</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600, textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div style={{ background: 'var(--color-teal-50)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <span>${formatMoney(pricing.pricePerNight)}/night × {nights} night{nights > 1 ? 's' : ''}</span>
              <span>${formatMoney(pricing.pricePerNight * nights)}</span>
            </div>
            {pricing.extraAdultFeePerNight > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                <span>Extra adult fee (+${pricing.extraAdultFeePerNight}/night × {nights} nights)</span>
                <span>${formatMoney(pricing.extraAdultFeePerNight * nights)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <span>NJ Hotel/Motel Tax ({pricing.taxRatePercent}%)</span>
              <span>${formatMoney(pricing.taxAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-navy)', borderTop: '1px solid rgba(13,148,136,0.2)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
              <span>Total</span>
              <span>${formatMoney(pricing.total)}</span>
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            By clicking &quot;Confirm Booking&quot; you agree to our cancellation policy. Payment will be collected at the property.
          </p>

          {bookingError && (
            <p style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>
              {bookingError}
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={() => setStep(2)} disabled={submitting} style={btnBack}>← Back</button>
            <button type="button" onClick={handleConfirm} disabled={submitting} style={{
              ...btnPrimary(submitting), flex: 2,
              background: submitting ? '#94a3b8' : 'var(--color-teal)',
            }}>
              {submitting ? 'Submitting…' : `Confirm Booking — $${formatMoney(pricing.total)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
