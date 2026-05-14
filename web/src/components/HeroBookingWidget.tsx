'use client';

import { useState, useRef, useEffect } from 'react';
import { CalendarDays, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ASI_URL = 'https://reservation.asiwebres.com/SearchAvailability.aspx?id=09541d73b18e4909bf99e3bd998583d2&Operation=Date';

function toASIDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDisplay(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

interface MonthProps {
  year: number; month: number;
  checkIn: string; checkOut: string; hoveredDate: string; today: string;
  onSelect: (iso: string) => void; onHover: (iso: string) => void;
}

function CalendarMonth({ year, month, checkIn, checkOut, hoveredDate, today, onSelect, onHover }: MonthProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay   = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rangeEnd = hoveredDate && checkIn && !checkOut ? hoveredDate : checkOut;

  return (
    <div style={{ flex: '1 1 260px', minWidth: 0 }}>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.975rem', color: '#0d1b2a', marginBottom: '1rem' }}>
        {MONTH_NAMES[month]} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.35rem' }}>
        {DAY_LABELS.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', padding: '0.2rem 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '2px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const iso      = toISO(year, month, day);
          const isPast   = iso < today;
          const isToday  = iso === today;
          const isCheckIn  = iso === checkIn;
          const isCheckOut = iso === checkOut;
          const isEndpoint = isCheckIn || isCheckOut;
          const rangeActive = checkIn && rangeEnd && rangeEnd > checkIn;
          const inRange     = rangeActive ? iso > checkIn && iso < rangeEnd : false;
          const isHoverEnd  = iso === hoveredDate && checkIn && !checkOut && hoveredDate > checkIn;

          return (
            <div key={day}
              onClick={() => !isPast && onSelect(iso)}
              onMouseEnter={() => !isPast && onHover(iso)}
              style={{
                textAlign: 'center', padding: '0.45rem 0',
                fontSize: '0.875rem', fontWeight: isEndpoint ? 700 : 400,
                cursor: isPast ? 'not-allowed' : 'pointer',
                borderRadius: isEndpoint || isHoverEnd || (!inRange) ? '50%' : '0',
                background: isEndpoint || isHoverEnd ? 'var(--color-teal)' : inRange ? 'rgba(13,148,136,0.12)' : 'transparent',
                color: isEndpoint || isHoverEnd ? 'white' : isPast ? '#d1d5db' : isToday ? 'var(--color-teal)' : '#111827',
                outline: isToday && !isEndpoint ? '2px solid var(--color-teal)' : 'none',
                outlineOffset: '-2px',
                userSelect: 'none',
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

  const [checkIn,     setCheckIn]     = useState('');
  const [checkOut,    setCheckOut]    = useState('');
  const [guests,      setGuests]      = useState(2);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selecting,   setSelecting]   = useState<'in' | 'out'>('in');
  const [hoveredDate, setHoveredDate] = useState('');
  const [viewYear,    setViewYear]    = useState(now.getFullYear());
  const [viewMonth,   setViewMonth]   = useState(now.getMonth());

  // Fixed-position coordinates for the calendar so it escapes overflow:hidden on the hero
  const [calPos, setCalPos] = useState({ top: 0, left: 0, width: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        // also check if the click is inside the fixed calendar (which is outside wrapperRef in the DOM flow)
        const calEl = document.getElementById('hero-cal-dropdown');
        if (calEl && calEl.contains(e.target as Node)) return;
        setCalendarOpen(false);
        setHoveredDate('');
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  // Reposition calendar on scroll / resize
  useEffect(() => {
    if (!calendarOpen) return;
    function reposition() {
      if (wrapperRef.current) {
        const r = wrapperRef.current.getBoundingClientRect();
        setCalPos({ top: r.bottom, left: r.left, width: r.width });
      }
    }
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition);
      window.removeEventListener('resize', reposition);
    };
  }, [calendarOpen]);

  function openCalendar(mode: 'in' | 'out') {
    setSelecting(mode);
    if (wrapperRef.current) {
      const r = wrapperRef.current.getBoundingClientRect();
      setCalPos({ top: r.bottom, left: r.left, width: r.width });
    }
    setCalendarOpen(true);
  }

  function handleSelect(iso: string) {
    if (selecting === 'in' || iso <= checkIn) {
      setCheckIn(iso);
      setCheckOut('');
      setSelecting('out');
    } else {
      setCheckOut(iso);
      setCalendarOpen(false);
      setHoveredDate('');
    }
  }

  function clearDates() { setCheckIn(''); setCheckOut(''); setSelecting('in'); setHoveredDate(''); }

  const canPrev = viewYear > now.getFullYear() || viewMonth > now.getMonth();
  function prevMonth() {
    if (!canPrev) return;
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1);
  }

  const month2 = viewMonth === 11 ? 0 : viewMonth + 1;
  const year2  = viewMonth === 11 ? viewYear + 1 : viewYear;
  const nights = checkIn && checkOut
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    : 0;
  const ready = !!checkIn && !!checkOut;

  function handleSearch() {
    if (!ready) return;
    const form = document.createElement('form');
    form.method = 'POST'; form.action = ASI_URL; form.target = '_blank';
    const fields: Record<string, string> = {
      txtcheckindate: toASIDate(checkIn), txtcheckoutdate: toASIDate(checkOut),
      txtadult: String(guests), txtChildren: '0', txtPromocode: '', txtRoomId: '-1',
    };
    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = name; input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', maxWidth: '720px', width: '100%' }}>

      {/* ── Widget bar ── */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '0.5rem',
        display: 'flex', flexWrap: 'wrap',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.3)',
      }}>
        {/* Check-in */}
        <div onClick={() => openCalendar('in')} style={{ flex: '1 1 160px', padding: '0.75rem 1.25rem', borderRight: '1px solid #f0ede6', cursor: 'pointer', borderRadius: 'var(--radius-lg)', background: calendarOpen && selecting === 'in' ? '#f0fdfa' : 'transparent', transition: 'background 0.15s' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CalendarDays size={11} strokeWidth={2.5} /> Check-in
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: checkIn ? '#0d1b2a' : '#9ca3af', lineHeight: 1.4 }}>
            {checkIn ? formatDisplay(checkIn) : 'Add date'}
          </div>
        </div>

        {/* Check-out */}
        <div onClick={() => openCalendar('out')} style={{ flex: '1 1 160px', padding: '0.75rem 1.25rem', borderRight: '1px solid #f0ede6', cursor: 'pointer', borderRadius: 'var(--radius-lg)', background: calendarOpen && selecting === 'out' ? '#f0fdfa' : 'transparent', transition: 'background 0.15s' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CalendarDays size={11} strokeWidth={2.5} /> Check-out
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: checkOut ? '#0d1b2a' : '#9ca3af', lineHeight: 1.4 }}>
            {checkOut ? formatDisplay(checkOut) : 'Add date'}
          </div>
        </div>

        {/* Guests */}
        <div style={{ flex: '1 1 120px', padding: '0.75rem 1.25rem', borderRight: '1px solid #f0ede6' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Users size={11} strokeWidth={2.5} /> Guests
          </div>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', fontWeight: 600, color: '#0d1b2a', fontFamily: 'inherit', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}>
            {[1,2,3,4].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>

        {/* CTA */}
        <div style={{ flex: '1 1 140px', padding: '0.5rem' }}>
          <button onClick={handleSearch}
            style={{ width: '100%', height: '100%', minHeight: '72px', background: ready ? 'var(--color-teal)' : '#94a3b8', color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '0.95rem', cursor: ready ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'background 0.2s' }}
            onMouseEnter={(e) => { if (ready) e.currentTarget.style.background = '#14b8a6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ready ? 'var(--color-teal)' : '#94a3b8'; }}>
            <Search size={16} strokeWidth={2.5} />
            <span style={{ lineHeight: 1.2, textAlign: 'center' }}>Check<br />Availability</span>
          </button>
        </div>
      </div>

      {/* ── Calendar — rendered with position:fixed to escape overflow:hidden on hero ── */}
      {calendarOpen && (
        <div id="hero-cal-dropdown" style={{
          position: 'fixed',
          top: calPos.top,
          left: calPos.left,
          width: calPos.width,
          background: 'white',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
          border: '1px solid #f0ede6', borderTop: 'none',
          padding: '1.5rem 1.75rem 1.25rem',
          zIndex: 9999,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
              {selecting === 'in' ? 'Select your check-in date' : checkIn ? `Check-in: ${formatDisplay(checkIn)} — now select check-out` : 'Select your check-out date'}
            </div>
            {nights > 0 && (
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-teal)', background: '#f0fdfa', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '999px', padding: '0.2rem 0.75rem' }}>
                {nights} night{nights !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Months + nav */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <button onClick={prevMonth} disabled={!canPrev} style={{ flexShrink: 0, width: '34px', height: '34px', marginTop: '0.2rem', background: 'none', border: '1px solid #e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: canPrev ? 'pointer' : 'not-allowed', opacity: canPrev ? 1 : 0.3 }}>
              <ChevronLeft size={16} color="#374151" />
            </button>

            <div style={{ flex: 1, display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              <CalendarMonth year={viewYear} month={viewMonth} checkIn={checkIn} checkOut={checkOut} hoveredDate={hoveredDate} today={today} onSelect={handleSelect} onHover={setHoveredDate} />
              <CalendarMonth year={year2} month={month2} checkIn={checkIn} checkOut={checkOut} hoveredDate={hoveredDate} today={today} onSelect={handleSelect} onHover={setHoveredDate} />
            </div>

            <button onClick={nextMonth} style={{ flexShrink: 0, width: '34px', height: '34px', marginTop: '0.2rem', background: 'none', border: '1px solid #e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronRight size={16} color="#374151" />
            </button>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
            <button onClick={clearDates} style={{ padding: '0.5rem 1.1rem', background: 'none', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Clear</button>
            <button onClick={() => setCalendarOpen(false)} disabled={!ready} style={{ padding: '0.5rem 1.25rem', background: ready ? 'var(--color-teal)' : '#94a3b8', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 700, cursor: ready ? 'pointer' : 'not-allowed' }}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
