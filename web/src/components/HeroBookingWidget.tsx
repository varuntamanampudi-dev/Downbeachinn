'use client';

import { useState } from 'react';
import { CalendarDays, Users, Search } from 'lucide-react';

const ASI_URL = 'https://reservation.asiwebres.com/SearchAvailability.aspx?id=09541d73b18e4909bf99e3bd998583d2&Operation=Date';

function toASIDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

export default function HeroBookingWidget() {
  const today    = new Date().toISOString().split('T')[0];
  const [checkIn,  setCheckIn]  = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests,   setGuests]   = useState(2);

  const handleSearch = () => {
    if (!checkIn || !checkOut) return;
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = ASI_URL;
    form.target = '_blank';
    const fields: Record<string, string> = {
      txtcheckindate:  toASIDate(checkIn),
      txtcheckoutdate: toASIDate(checkOut),
      txtadult:        String(guests),
      txtChildren:     '0',
      txtPromocode:    '',
      txtRoomId:       '-1',
    };
    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type  = 'hidden';
      input.name  = name;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const inp: React.CSSProperties = {
    width: '100%', border: 'none', outline: 'none',
    background: 'transparent', fontSize: '0.95rem', fontWeight: 600,
    color: '#0d1b2a', padding: '0.5rem 0 0.25rem', fontFamily: 'inherit', cursor: 'pointer',
  };

  const ready = !!checkIn && !!checkOut;

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.3)', maxWidth: '720px', width: '100%' }}>

      {/* Check-in */}
      <div style={{ flex: '1 1 160px', padding: '0.75rem 1.25rem', borderRight: '1px solid #f0ede6' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <CalendarDays size={11} strokeWidth={2.5} />Check-in
        </div>
        <input type="date" value={checkIn} min={today}
          onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }}
          style={inp} />
        <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.1rem' }}>
          {checkIn ? new Date(checkIn + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Add date'}
        </div>
      </div>

      {/* Check-out */}
      <div style={{ flex: '1 1 160px', padding: '0.75rem 1.25rem', borderRight: '1px solid #f0ede6' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <CalendarDays size={11} strokeWidth={2.5} />Check-out
        </div>
        <input type="date" value={checkOut} min={checkIn || today}
          onChange={(e) => setCheckOut(e.target.value)}
          style={inp} />
        <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.1rem' }}>
          {checkOut ? new Date(checkOut + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Add date'}
        </div>
      </div>

      {/* Guests */}
      <div style={{ flex: '1 1 120px', padding: '0.75rem 1.25rem', borderRight: '1px solid #f0ede6' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Users size={11} strokeWidth={2.5} />Guests
        </div>
        <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
          style={{ ...inp, appearance: 'none', WebkitAppearance: 'none' }}>
          {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
        </select>
        <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.1rem' }}>Select count</div>
      </div>

      {/* CTA */}
      <div style={{ flex: '1 1 140px', padding: '0.5rem' }}>
        <button onClick={handleSearch}
          style={{ width: '100%', height: '100%', minHeight: '72px', background: ready ? 'var(--color-teal)' : '#94a3b8', color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '0.95rem', cursor: ready ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'background 0.2s', letterSpacing: '0.02em' }}
          onMouseEnter={(e) => { if (ready) e.currentTarget.style.background = '#14b8a6'; }}
          onMouseLeave={(e) => { if (ready) e.currentTarget.style.background = 'var(--color-teal)'; }}>
          <Search size={16} strokeWidth={2.5} />
          <span style={{ lineHeight: 1 }}>Check Availability</span>
        </button>
      </div>
    </div>
  );
}
