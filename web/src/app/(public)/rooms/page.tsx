import { Wifi, ParkingCircle, Sparkles, BellRing, Ban, BadgeCheck } from 'lucide-react';
import RoomCard from '@/features/rooms/components/RoomCard';
import { getRoomTypes } from '@/features/rooms/queries';
import { MOTEL } from '@/lib/constants';

export const metadata = {
  title: `Rooms & Rates — ${MOTEL.name}`,
  description: 'Browse all room types at DownBeach Inn. King, Queen, Double, and Jacuzzi Suite options with transparent nightly rates.',
};

export default async function RoomsPage() {
  const roomTypes = await getRoomTypes();
  const startingPrice = Math.min(...roomTypes.map((r) => r.basePricePerNight));

  return (
    <>
      {/* ── Page Header ── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-navy) 0%, #0a2a3a 100%)',
        padding: '6rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="section-label" style={{ color: 'var(--color-teal-light)' }}>
            ✦ Accommodations
          </p>
          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.25rem)',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            Rooms &amp; Rates
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', maxWidth: '480px', lineHeight: 1.7, marginBottom: '2rem' }}>
            All rooms are non-smoking and include free Wi-Fi and parking. Rates shown are per night before tax.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { val: `${MOTEL.totalRooms}`, label: 'Total Rooms' },
              { val: `$${startingPrice}`, label: 'Starting/Night' },
              { val: '4.8★', label: 'Guest Rating' },
              { val: '24/7', label: 'Front Desk' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div style={{ fontWeight: 800, fontSize: '1.35rem', color: 'white', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '3px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter bar (sticky) ── */}
      <section style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-warm-100)',
        padding: '0.85rem 0',
        position: 'sticky',
        top: '72px',
        zIndex: 10,
        boxShadow: '0 2px 12px rgba(13,27,42,0.06)',
      }}>
        <div className="section-container" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: '0.25rem' }}>Filter:</span>
          {['All Rooms', 'King', 'Queen', 'Double', 'Suite'].map((f, i) => (
            <button key={f} style={{
              padding: '0.38rem 1rem',
              borderRadius: '999px',
              border: i === 0 ? '2px solid var(--color-teal)' : '1.5px solid var(--color-warm-100)',
              background: i === 0 ? 'var(--color-teal)' : 'white',
              color: i === 0 ? 'white' : 'var(--color-text-muted)',
              fontWeight: i === 0 ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              {f}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {roomTypes.length} room types available
          </span>
        </div>
      </section>

      {/* ── Room Grid ── */}
      <section style={{ padding: '3.5rem 0 6rem', background: 'var(--color-cream)' }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {roomTypes.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>

          {/* Included amenities banner */}
          <div style={{
            marginTop: '4rem',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-warm-100)',
            boxShadow: 'var(--shadow-card)',
            padding: '2rem 2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <p className="section-label">✦ Included with every room</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {[
                  { Icon: Wifi,           label: 'Free Wi-Fi' },
                  { Icon: ParkingCircle,  label: 'Free Parking' },
                  { Icon: Sparkles,       label: 'Daily Housekeeping' },
                  { Icon: BellRing,       label: '24/7 Front Desk' },
                  { Icon: Ban,            label: 'Non-Smoking' },
                ].map(({ Icon, label }) => (
                  <span key={label} style={{
                    fontSize: '0.8rem', fontWeight: 500,
                    background: '#f0fdfa',
                    color: 'var(--color-teal)',
                    border: '1px solid rgba(13,148,136,0.2)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.85rem',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                  }}>
                    <Icon size={13} strokeWidth={2} /> {label}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Rates from</p>
              <p style={{ fontWeight: 800, fontSize: '2rem', color: 'var(--color-navy)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                ${startingPrice.toFixed(0)}
                <span style={{ fontWeight: 400, fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>/night</span>
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>+tax · best rate guaranteed</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
