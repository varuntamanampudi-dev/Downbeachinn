import RoomCard from '@/features/rooms/components/RoomCard';
import { ROOMS } from '@/features/rooms/data';

export const metadata = {
  title: 'Rooms & Rates — DownBeach Motel',
  description: 'Browse all 24 rooms at DownBeach Motel. Standard, Deluxe, and Family Suite options with transparent nightly rates.',
};

export default function RoomsPage() {
  return (
    <>
      {/* Page Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-sky-50) 0%, var(--color-sky-100) 100%)',
          padding: '4rem 0 3rem',
          borderBottom: '1px solid var(--color-sky-200)',
        }}
      >
        <div className="section-container">
          <p style={{ color: 'var(--color-sky-600)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Accommodations
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--color-sky-900)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Rooms &amp; Rates
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.7 }}>
            All rooms include free Wi-Fi, parking, and continental breakfast. Rates shown are per night. No hidden fees.
          </p>
        </div>
      </section>

      {/* Filters bar (UI only — functional in Phase 2) */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--color-sky-100)', padding: '1rem 0', position: 'sticky', top: '68px', zIndex: 10 }}>
        <div className="section-container" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>Filter:</span>
          {['All', 'Standard', 'Deluxe', 'Suite'].map((f) => (
            <button
              key={f}
              style={{
                padding: '0.35rem 0.9rem',
                borderRadius: '999px',
                border: f === 'All' ? '2px solid var(--color-sky-400)' : '1px solid var(--color-sky-200)',
                background: f === 'All' ? 'var(--color-sky-50)' : 'white',
                color: f === 'All' ? 'var(--color-sky-700)' : 'var(--color-text-muted)',
                fontWeight: f === 'All' ? 600 : 400,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            {ROOMS.length} room types available
          </span>
        </div>
      </section>

      {/* Room Grid */}
      <section style={{ padding: '3rem 0 5rem', background: 'var(--color-surface)' }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {ROOMS.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>

          {/* What's included */}
          <div
            className="glass-card"
            style={{ marginTop: '3.5rem', padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-sky-900)', marginBottom: '0.4rem' }}>Included with every room</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {['Free Wi-Fi', 'Free Parking', 'Continental Breakfast', 'Daily Housekeeping', '24/7 Front Desk', 'Beach Towels'].map((item) => (
                  <span
                    key={item}
                    style={{ fontSize: '0.78rem', fontWeight: 500, background: 'var(--color-sky-50)', color: 'var(--color-sky-700)', border: '1px solid var(--color-sky-200)', borderRadius: '999px', padding: '0.25rem 0.65rem' }}
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Starting from</p>
              <p style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-sky-700)' }}>
                ${Math.min(...ROOMS.map((r) => r.pricePerNight))}<span style={{ fontWeight: 400, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>/night</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
