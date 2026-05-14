'use client';

import { useState, useRef, useEffect } from 'react';
import { CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

const DAY_LABELS  = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
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
    <div style={{ flex: '1 1 220px', minWidth: 0 }}>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-navy)', marginBottom: '0.875rem' }}>
        {MONTH_NAMES[month]} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.25rem' }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af', padding: '0.2rem 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '2px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const iso        = toISO(year, month, day);
          const isPast     = iso < today;
          const isToday    = iso === today;
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
                textAlign: 'center', padding: '0.4rem 0',
                fontSize: '0.85rem', fontWeight: isEndpoint ? 700 : 400,
                cursor: isPast ? 'not-allowed' : 'pointer',
                borderRadius: isEndpoint || isHoverEnd || !inRange ? '50%' : '0',
                background: isEndpoint || isHoverEnd ? 'var(--color-teal)' : inRange ? 'rgba(13,148,136,0.12)' : 'transparent',
                color: isEndpoint || isHoverEnd ? 'white' : isPast ? '#d1d5db' : isToday ? 'var(--color-teal)' : 'var(--color-navy)',
                outline: isToday && !isEndpoint ? '2px solid var(--color-teal)' : 'none',
                outlineOffset: '-2px', userSelect: 'none',
              }}
            >{day}</div>
          );
        })}
      </div>
    </div>
  );
}

function CounterBtn({ value, onChange, min, max, label }: { value: number; onChange: (n: number) => void; min: number; max: number; label: string }) {
  const base: React.CSSProperties = { width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid rgba(13,148,136,0.25)', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        style={{ ...base, background: value <= min ? '#f8fafc' : 'white', color: value <= min ? '#cbd5e1' : 'var(--color-teal)', cursor: value <= min ? 'not-allowed' : 'pointer' }}>−</button>
      <div style={{ minWidth: '52px', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-navy)' }}>{value}</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{label}</div>
      </div>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
        style={{ ...base, background: value >= max ? '#f8fafc' : 'white', color: value >= max ? '#cbd5e1' : 'var(--color-teal)', cursor: value >= max ? 'not-allowed' : 'pointer' }}>+</button>
    </div>
  );
}

export default function ASIBookingForm() {
  const now   = new Date();
  const today = now.toISOString().split('T')[0];

  const [checkIn,      setCheckIn]      = useState('');
  const [checkOut,     setCheckOut]     = useState('');
  const [adults,       setAdults]       = useState(2);
  const [children,     setChildren]     = useState(0);
  const [calOpen,      setCalOpen]      = useState(false);
  const [selecting,    setSelecting]    = useState<'in' | 'out'>('in');
  const [hoveredDate,  setHoveredDate]  = useState('');
  const [viewYear,     setViewYear]     = useState(now.getFullYear());
  const [viewMonth,    setViewMonth]    = useState(now.getMonth());

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setCalOpen(false);
        setHoveredDate('');
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  function openCal(mode: 'in' | 'out') {
    setSelecting(mode);
    setCalOpen(true);
  }

  function handleSelect(iso: string) {
    if (selecting === 'in' || iso <= checkIn) {
      setCheckIn(iso); setCheckOut(''); setSelecting('out');
    } else {
      setCheckOut(iso); setCalOpen(false); setHoveredDate('');
    }
  }

  const canPrev = viewYear > now.getFullYear() || viewMonth > now.getMonth();
  function prevMonth() { if (!canPrev) return; if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); } else setViewMonth(m => m-1); }
  function nextMonth() { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); } else setViewMonth(m => m+1); }

  const month2 = viewMonth === 11 ? 0 : viewMonth + 1;
  const year2  = viewMonth === 11 ? viewYear + 1 : viewYear;

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;
  const ready = !!checkIn && !!checkOut && nights > 0;

  function handleSubmit() {
    if (!ready) return;
    const form = document.createElement('form');
    form.method = 'POST'; form.action = ASI_URL; form.target = '_blank';
    const fields: Record<string, string> = {
      txtcheckindate: toASIDate(checkIn), txtcheckoutdate: toASIDate(checkOut),
      txtadult: String(adults), txtChildren: String(children),
      txtPromocode: '', txtRoomId: '-1',
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
    <div ref={formRef} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <CalendarDays size={20} color="var(--color-teal)" strokeWidth={2} />
        <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-navy)', margin: 0 }}>Check Availability</h2>
      </div>

      {/* Date fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Check-in */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>Check-in</label>
          <button type="button" onClick={() => openCal('in')} style={{
            width: '100%', padding: '0.75rem 1rem', textAlign: 'left',
            border: calOpen && selecting === 'in' ? '2px solid var(--color-teal)' : '1.5px solid rgba(13,148,136,0.25)',
            borderRadius: 'var(--radius-md)', background: calOpen && selecting === 'in' ? 'var(--color-teal-50)' : 'white',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <div style={{ fontSize: checkIn ? '0.925rem' : '0.875rem', fontWeight: checkIn ? 600 : 400, color: checkIn ? 'var(--color-navy)' : '#9ca3af' }}>
              {checkIn ? formatDisplay(checkIn) : 'Select date'}
            </div>
          </button>
        </div>

        {/* Check-out */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>Check-out</label>
          <button type="button" onClick={() => openCal('out')} style={{
            width: '100%', padding: '0.75rem 1rem', textAlign: 'left',
            border: calOpen && selecting === 'out' ? '2px solid var(--color-teal)' : '1.5px solid rgba(13,148,136,0.25)',
            borderRadius: 'var(--radius-md)', background: calOpen && selecting === 'out' ? 'var(--color-teal-50)' : 'white',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <div style={{ fontSize: checkOut ? '0.925rem' : '0.875rem', fontWeight: checkOut ? 600 : 400, color: checkOut ? 'var(--color-navy)' : '#9ca3af' }}>
              {checkOut ? formatDisplay(checkOut) : 'Select date'}
            </div>
          </button>
        </div>
      </div>

      {/* Calendar dropdown — inline inside card, no overflow issues */}
      {calOpen && (
        <div style={{ border: '1px solid rgba(13,148,136,0.2)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', background: 'white', boxShadow: '0 8px 32px rgba(13,27,42,0.1)' }}>

          {/* Prompt + nights */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {selecting === 'in' ? 'Select check-in date' : checkIn ? `Check-in ${formatDisplay(checkIn)} · now pick check-out` : 'Select check-out date'}
            </div>
            {nights > 0 && (
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-teal)', background: 'var(--color-teal-50)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '999px', padding: '0.15rem 0.65rem' }}>
                {nights} night{nights !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Months */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <button onClick={prevMonth} disabled={!canPrev} style={{ flexShrink: 0, width: '30px', height: '30px', marginTop: '0.15rem', background: 'none', border: '1px solid #e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: canPrev ? 'pointer' : 'not-allowed', opacity: canPrev ? 1 : 0.3 }}>
              <ChevronLeft size={14} color="#374151" />
            </button>
            <div style={{ flex: 1, display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <CalendarMonth year={viewYear} month={viewMonth} checkIn={checkIn} checkOut={checkOut} hoveredDate={hoveredDate} today={today} onSelect={handleSelect} onHover={setHoveredDate} />
              <CalendarMonth year={year2} month={month2} checkIn={checkIn} checkOut={checkOut} hoveredDate={hoveredDate} today={today} onSelect={handleSelect} onHover={setHoveredDate} />
            </div>
            <button onClick={nextMonth} style={{ flexShrink: 0, width: '30px', height: '30px', marginTop: '0.15rem', background: 'none', border: '1px solid #e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronRight size={14} color="#374151" />
            </button>
          </div>

          {/* Calendar footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid #f3f4f6' }}>
            <button onClick={() => { setCheckIn(''); setCheckOut(''); setSelecting('in'); }} style={{ padding: '0.4rem 0.9rem', background: 'none', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Clear</button>
            <button onClick={() => setCalOpen(false)} disabled={!ready} style={{ padding: '0.4rem 1rem', background: ready ? 'var(--color-teal)' : '#94a3b8', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 700, cursor: ready ? 'pointer' : 'not-allowed' }}>Done</button>
          </div>
        </div>
      )}

      {/* Nights summary */}
      {nights > 0 && !calOpen && (
        <div style={{ background: 'var(--color-teal-50)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 600, textAlign: 'center' }}>
          {nights} night{nights > 1 ? 's' : ''} · {formatDisplay(checkIn)} → {formatDisplay(checkOut)}
        </div>
      )}

      {/* Guests */}
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>Guests</label>
        <div style={{ background: 'var(--color-teal-50)', border: '1.5px solid rgba(13,148,136,0.25)', borderRadius: 'var(--radius-md)', padding: '1.1rem 1.25rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-teal)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Adults</div>
            <CounterBtn value={adults} onChange={setAdults} min={1} max={4} label="adult(s)" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-teal)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Children <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', textTransform: 'none' }}>(under 17 · free)</span>
            </div>
            <CounterBtn value={children} onChange={setChildren} min={0} max={4} label="child(ren)" />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={!ready} style={{
        padding: '0.9rem', border: 'none', borderRadius: 'var(--radius-md)',
        background: ready ? 'var(--color-teal)' : '#cbd5e1',
        color: 'white', fontWeight: 700, fontSize: '1rem',
        cursor: ready ? 'pointer' : 'not-allowed',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        boxShadow: ready ? '0 4px 20px rgba(13,148,136,0.35)' : 'none',
        transition: 'background 0.2s, box-shadow 0.2s',
      }}>
        Check Availability &amp; Book <ArrowRight size={18} />
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>
        You&apos;ll be taken to our secure booking portal to select your room and complete payment.
      </p>
    </div>
  );
}
