'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ASI_URL = 'https://reservation.asiwebres.com/SearchAvailability.aspx?id=09541d73b18e4909bf99e3bd998583d2&Operation=Date';

function toASIDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function fmt(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function CalMonth({ year, month, checkIn, checkOut, hovered, today, onSelect, onHover }: {
  year: number; month: number; checkIn: string; checkOut: string;
  hovered: string; today: string; onSelect: (d: string) => void; onHover: (d: string) => void;
}) {
  const dim = new Date(year, month + 1, 0).getDate();
  const fd  = new Date(year, month, 1).getDay();
  const cells: (number|null)[] = [];
  for (let i = 0; i < fd; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rangeEnd = hovered && checkIn && !checkOut ? hovered : checkOut;

  return (
    <div style={{ flex: '1 1 240px', minWidth: 0 }}>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: '#0d1b2a', marginBottom: '1rem' }}>
        {MONTHS[month]} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.3rem' }}>
        {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af', padding: '0.2rem 0' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '2px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const iso   = toISO(year, month, day);
          const past  = iso < today;
          const end   = iso === checkIn || iso === checkOut;
          const rng   = checkIn && rangeEnd && rangeEnd > checkIn && iso > checkIn && iso < rangeEnd;
          const hvEnd = iso === hovered && checkIn && !checkOut && hovered > checkIn;
          return (
            <div key={day}
              onClick={() => !past && onSelect(iso)}
              onMouseEnter={() => !past && onHover(iso)}
              style={{
                textAlign: 'center', padding: '0.45rem 0', fontSize: '0.875rem',
                fontWeight: end ? 700 : 400,
                cursor: past ? 'not-allowed' : 'pointer',
                borderRadius: end || hvEnd || !rng ? '50%' : '0',
                background: end || hvEnd ? 'var(--color-teal)' : rng ? 'rgba(13,148,136,0.12)' : 'transparent',
                color: end || hvEnd ? 'white' : past ? '#d1d5db' : iso === today ? 'var(--color-teal)' : '#111827',
                outline: iso === today && !end ? '2px solid var(--color-teal)' : 'none',
                outlineOffset: '-2px', userSelect: 'none',
              }}
            >{day}</div>
          );
        })}
      </div>
    </div>
  );
}

export default function HeroBookingWidget() {
  const now   = new Date();
  const today = now.toISOString().split('T')[0];

  const [checkIn,  setCheckIn]  = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests,   setGuests]   = useState(2);
  const [open,     setOpen]     = useState(false);
  const [mode,     setMode]     = useState<'in'|'out'>('in');
  const [hovered,  setHovered]  = useState('');
  const [vy, setVy] = useState(now.getFullYear());
  const [vm, setVm] = useState(now.getMonth());
  const [pos, setPos] = useState({ top: 0, left: 0, width: 700 });
  const [mounted, setMounted] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const inBar = barRef.current?.contains(e.target as Node);
      const inCal = calRef.current?.contains(e.target as Node);
      if (!inBar && !inCal) { setOpen(false); setHovered(''); }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function openCal(m: 'in'|'out') {
    if (barRef.current) {
      const r = barRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + window.scrollY, left: r.left + window.scrollX, width: r.width });
    }
    setMode(m);
    setOpen(true);
  }

  function pick(iso: string) {
    if (mode === 'in' || iso <= checkIn) {
      setCheckIn(iso); setCheckOut(''); setMode('out');
    } else {
      setCheckOut(iso); setOpen(false); setHovered('');
    }
  }

  const canPrev = vy > now.getFullYear() || vm > now.getMonth();
  function prev() { if (!canPrev) return; if (vm === 0) { setVy(y => y-1); setVm(11); } else setVm(m => m-1); }
  function next() { if (vm === 11) { setVy(y => y+1); setVm(0); } else setVm(m => m+1); }

  const m2 = vm === 11 ? 0 : vm + 1;
  const y2 = vm === 11 ? vy + 1 : vy;
  const nights = checkIn && checkOut ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000) : 0;
  const ready  = !!checkIn && !!checkOut;

  function search() {
    if (!ready) return;
    const form = document.createElement('form');
    form.method = 'POST'; form.action = ASI_URL; form.target = '_blank';
    [['txtcheckindate', toASIDate(checkIn)], ['txtcheckoutdate', toASIDate(checkOut)],
     ['txtadult', String(guests)], ['txtChildren', '0'], ['txtPromocode', ''], ['txtRoomId', '-1']]
      .forEach(([n, v]) => { const i = document.createElement('input'); i.type='hidden'; i.name=n; i.value=v; form.appendChild(i); });
    document.body.appendChild(form); form.submit(); document.body.removeChild(form);
  }

  const calDropdown = (
    <div ref={calRef} style={{
      position: 'absolute',
      top: pos.top,
      left: pos.left,
      width: pos.width,
      background: 'white',
      borderRadius: '0 0 1.25rem 1.25rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
      border: '1px solid #f0ede6',
      borderTop: 'none',
      padding: '1.5rem 1.75rem 1.25rem',
      zIndex: 9999,
      boxSizing: 'border-box' as const,
    }}>
      {/* Prompt */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
          {mode === 'in' ? 'Select check-in date' : checkIn ? `Check-in ${fmt(checkIn)} · select check-out` : 'Select check-out date'}
        </span>
        {nights > 0 && <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-teal)', background: '#f0fdfa', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '999px', padding: '0.2rem 0.75rem' }}>{nights} night{nights !== 1 ? 's' : ''}</span>}
      </div>

      {/* Nav + months */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <button onClick={prev} disabled={!canPrev} style={{ flexShrink: 0, width: 34, height: 34, marginTop: '0.15rem', background: 'none', border: '1px solid #e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: canPrev ? 'pointer' : 'not-allowed', opacity: canPrev ? 1 : 0.3 }}>
          <ChevronLeft size={16} color="#374151" />
        </button>
        <div style={{ flex: 1, display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <CalMonth year={vy} month={vm} checkIn={checkIn} checkOut={checkOut} hovered={hovered} today={today} onSelect={pick} onHover={setHovered} />
          <CalMonth year={y2} month={m2} checkIn={checkIn} checkOut={checkOut} hovered={hovered} today={today} onSelect={pick} onHover={setHovered} />
        </div>
        <button onClick={next} style={{ flexShrink: 0, width: 34, height: 34, marginTop: '0.15rem', background: 'none', border: '1px solid #e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronRight size={16} color="#374151" />
        </button>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
        <button onClick={() => { setCheckIn(''); setCheckOut(''); setMode('in'); }} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid #e5e7eb', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Clear</button>
        <button onClick={() => setOpen(false)} disabled={!ready} style={{ padding: '0.5rem 1.25rem', background: ready ? 'var(--color-teal)' : '#94a3b8', color: 'white', border: 'none', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 700, cursor: ready ? 'pointer' : 'not-allowed' }}>Done</button>
      </div>
    </div>
  );

  return (
    <>
      {/* Widget bar */}
      <div ref={barRef} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '0.5rem', display: 'flex', flexWrap: 'wrap', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.3)', maxWidth: '720px', width: '100%' }}>

        <div onClick={() => openCal('in')} style={{ flex: '1 1 160px', padding: '0.75rem 1.25rem', borderRight: '1px solid #f0ede6', cursor: 'pointer', borderRadius: 'var(--radius-lg)', background: open && mode === 'in' ? '#f0fdfa' : 'transparent', transition: 'background 0.15s' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CalendarDays size={11} strokeWidth={2.5} /> Check-in
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: checkIn ? '#0d1b2a' : '#9ca3af' }}>
            {checkIn ? fmt(checkIn) : 'Add date'}
          </div>
        </div>

        <div onClick={() => openCal('out')} style={{ flex: '1 1 160px', padding: '0.75rem 1.25rem', borderRight: '1px solid #f0ede6', cursor: 'pointer', borderRadius: 'var(--radius-lg)', background: open && mode === 'out' ? '#f0fdfa' : 'transparent', transition: 'background 0.15s' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CalendarDays size={11} strokeWidth={2.5} /> Check-out
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: checkOut ? '#0d1b2a' : '#9ca3af' }}>
            {checkOut ? fmt(checkOut) : 'Add date'}
          </div>
        </div>

        <div style={{ flex: '1 1 120px', padding: '0.75rem 1.25rem', borderRight: '1px solid #f0ede6' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Users size={11} strokeWidth={2.5} /> Guests
          </div>
          <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', fontWeight: 600, color: '#0d1b2a', fontFamily: 'inherit', cursor: 'pointer', appearance: 'none' }}>
            {[1,2,3,4].map(n => <option key={n} value={n}>{n} guest{n>1?'s':''}</option>)}
          </select>
        </div>

        <div style={{ flex: '1 1 140px', padding: '0.5rem' }}>
          <button onClick={search} style={{ width: '100%', height: '100%', minHeight: '72px', background: ready ? 'var(--color-teal)' : '#94a3b8', color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '0.95rem', cursor: ready ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'background 0.2s' }}
            onMouseEnter={e => { if (ready) e.currentTarget.style.background = '#14b8a6'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ready ? 'var(--color-teal)' : '#94a3b8'; }}>
            <Search size={16} strokeWidth={2.5} />
            <span style={{ lineHeight: 1.2, textAlign: 'center' }}>Check<br />Availability</span>
          </button>
        </div>
      </div>

      {/* Portal: renders at <body> level — escapes hero overflow:hidden completely */}
      {open && mounted && createPortal(calDropdown, document.body)}
    </>
  );
}
