'use client';

import { useState } from 'react';
import { CalendarDays, ArrowRight } from 'lucide-react';

const ASI_URL = 'https://reservation.asiwebres.com/SearchAvailability.aspx?id=09541d73b18e4909bf99e3bd998583d2&Operation=Date';

function toASIDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '0.7rem 1rem',
    border: focused ? '2px solid var(--color-sky-400)' : '1.5px solid var(--color-sky-200)',
    borderRadius: 'var(--radius-md)', fontSize: '0.925rem',
    color: 'var(--color-text-primary)', background: 'white',
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const,
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.4rem', letterSpacing: '0.02em' }}>
      {children}
    </label>
  );
}

function Counter({ value, onChange, min, max, label }: { value: number; onChange: (n: number) => void; min: number; max: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid var(--color-sky-200)', background: value <= min ? '#f8fafc' : 'white', color: value <= min ? '#cbd5e1' : 'var(--color-sky-700)', fontWeight: 700, fontSize: '1.1rem', cursor: value <= min ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
      <div style={{ minWidth: '60px', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-sky-900)' }}>{value}</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{label}</div>
      </div>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid var(--color-sky-200)', background: value >= max ? '#f8fafc' : 'white', color: value >= max ? '#cbd5e1' : 'var(--color-sky-700)', fontWeight: 700, fontSize: '1.1rem', cursor: value >= max ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
    </div>
  );
}

export default function ASIBookingForm() {
  const today = new Date().toISOString().split('T')[0];
  const [checkIn,  setCheckIn]  = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults,   setAdults]   = useState(2);
  const [children, setChildren] = useState(0);
  const [focused,  setFocused]  = useState('');

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;

  const ready = !!checkIn && !!checkOut && nights > 0;

  const handleSubmit = () => {
    if (!ready) return;
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = ASI_URL;
    form.target = '_blank';
    const fields: Record<string, string> = {
      txtcheckindate:  toASIDate(checkIn),
      txtcheckoutdate: toASIDate(checkOut),
      txtadult:        String(adults),
      txtChildren:     String(children),
      txtPromocode:    '',
      txtRoomId:       '-1',
    };
    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = name; input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
        <CalendarDays size={20} color="var(--color-sky-600)" strokeWidth={2} />
        <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-sky-900)', margin: 0 }}>Check Availability</h2>
      </div>

      {/* Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <Label>Check-in</Label>
          <input type="date" value={checkIn} min={today}
            onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }}
            onFocus={() => setFocused('in')} onBlur={() => setFocused('')}
            style={inputStyle(focused === 'in')} />
        </div>
        <div>
          <Label>Check-out</Label>
          <input type="date" value={checkOut} min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            onFocus={() => setFocused('out')} onBlur={() => setFocused('')}
            style={inputStyle(focused === 'out')} />
        </div>
      </div>

      {/* Nights indicator */}
      {nights > 0 && (
        <div style={{ background: 'var(--color-sky-50)', border: '1px solid var(--color-sky-200)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', fontSize: '0.85rem', color: 'var(--color-sky-700)', fontWeight: 600, textAlign: 'center' }}>
          {nights} night{nights > 1 ? 's' : ''} · {new Date(checkIn + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → {new Date(checkOut + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      )}

      {/* Guests */}
      <div>
        <Label>Guests</Label>
        <div style={{ background: 'var(--color-sky-50)', border: '1.5px solid var(--color-sky-200)', borderRadius: 'var(--radius-md)', padding: '1.1rem 1.25rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-sky-700)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Adults</div>
            <Counter value={adults} onChange={setAdults} min={1} max={4} label="adult(s)" />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-sky-700)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Children <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', textTransform: 'none', letterSpacing: 0 }}>(under 17 · free)</span>
            </div>
            <Counter value={children} onChange={setChildren} min={0} max={4} label="child(ren)" />
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!ready}
        style={{ padding: '0.9rem', background: ready ? 'linear-gradient(135deg, var(--color-sky-500), var(--color-sky-700))' : '#cbd5e1', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '1rem', cursor: ready ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: ready ? '0 4px 20px rgba(14,165,233,0.3)' : 'none' }}>
        Check Availability &amp; Book <ArrowRight size={18} />
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>
        You&apos;ll be taken to our secure booking portal to select your room and complete payment.
      </p>
    </div>
  );
}
