import RoomCard from '@/features/rooms/components/RoomCard';
import { getRoomTypes, getTaxRate } from '@/features/rooms/queries';
import { MOTEL } from '@/lib/constants';

export const metadata = {
  title: `Rooms & Rates — ${MOTEL.name}`,
  description: 'Browse all room types at DownBeach Inn. King, Queen, Double, and Jacuzzi Suite options with transparent nightly rates.',
};

export default async function RoomsPage() {
  const [roomTypes, taxRate] = await Promise.all([getRoomTypes(), getTaxRate()]);
  const startingPrice = Math.min(...roomTypes.map((r) => r.basePricePerNight));

  return (
    <>
      {/* Page Header */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-sky-50) 0%, var(--color-sky-100) 100%)', padding: '4rem 0 3rem', borderBottom: '1px solid var(--color-sky-200)' }}>
        <div className="section-container">
          <p style={{ color: 'var(--color-sky-600)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Accommodations</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--color-sky-900)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Rooms &amp; Rates</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.7 }}>
            All rooms are non-smoking and include free Wi-Fi and parking. Rates shown are per night before tax ({taxRate}%).
          </p>
        </div>
      </section>

      {/* Room Type Filters (visual only — functional filtering comes with full booking engine) */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--color-sky-100)', padding: '1rem 0', position: 'sticky', top: '68px', zIndex: 10 }}>
        <div className="section-container" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>Type:</span>
          {['All Types', 'King', 'Queen', 'Double', 'Suite'].map((f, i) => (
            <button key={f} style={{ padding: '0.35rem 0.9rem', borderRadius: '999px', border: i === 0 ? '2px solid var(--color-sky-400)' : '1px solid var(--color-sky-200)', background: i === 0 ? 'var(--color-sky-50)' : 'white', color: i === 0 ? 'var(--color-sky-700)' : 'var(--color-text-muted)', fontWeight: i === 0 ? 600 : 400, fontSize: '0.82rem', cursor: 'pointer' }}>
              {f}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            {MOTEL.totalRooms} rooms total
          </span>
        </div>
      </section>

      {/* Room Grid */}
      <section style={{ padding: '3rem 0 5rem', background: 'var(--color-surface)' }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {roomTypes.map((room) => <RoomCard key={room.id} room={room} taxRate={taxRate} />)}
          </div>

          {/* What's included banner */}
          <div className="glass-card" style={{ marginTop: '3.5rem', padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-sky-900)', marginBottom: '0.6rem' }}>Included with every room</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Free Wi-Fi', 'Free Parking', 'Daily Housekeeping', '24/7 Front Desk', 'Non-Smoking'].map((item) => (
                  <span key={item} style={{ fontSize: '0.78rem', fontWeight: 500, background: 'var(--color-sky-50)', color: 'var(--color-sky-700)', border: '1px solid var(--color-sky-200)', borderRadius: '999px', padding: '0.25rem 0.65rem' }}>
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Starting from</p>
              <p style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-sky-700)' }}>
                ${startingPrice.toFixed(2)}<span style={{ fontWeight: 400, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>/night</span>
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>+ {taxRate}% tax</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
