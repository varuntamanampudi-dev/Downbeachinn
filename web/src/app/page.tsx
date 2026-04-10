import Link from 'next/link';
import RoomCard from '@/features/rooms/components/RoomCard';
import { ROOMS } from '@/features/rooms/data';

const AMENITIES = [
  { icon: '🌊', title: 'Steps from the Beach', desc: 'Walk to the sand in under 2 minutes from any room.' },
  { icon: '🅿️', title: 'Free Parking', desc: 'Ample on-site parking at no extra charge for all guests.' },
  { icon: '☕', title: 'Complimentary Breakfast', desc: 'Fresh continental breakfast served every morning.' },
  { icon: '📶', title: 'High-Speed Wi-Fi', desc: 'Fast, reliable Wi-Fi throughout the entire property.' },
  { icon: '❄️', title: 'Climate Control', desc: 'Individual A/C and heating in every room.' },
  { icon: '🔒', title: '24/7 Front Desk', desc: 'Someone always here to help, any hour of the day.' },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ minHeight: '88vh', background: 'linear-gradient(160deg, var(--color-sky-50) 0%, var(--color-surface) 40%, var(--color-sky-100) 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-120px', right: '-80px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="section-container" style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(186,230,253,0.6)', border: '1px solid var(--color-sky-300)', borderRadius: '999px', padding: '0.35rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-sky-700)', marginBottom: '1.5rem', backdropFilter: 'blur(8px)' }}>
              <span>🌊</span> Beachfront Motel — Shore City, NJ
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--color-sky-900)', marginBottom: '1.25rem' }}>
              Your Perfect<br />
              <span style={{ background: 'linear-gradient(135deg, var(--color-sky-500), var(--color-sky-700))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Beach Escape
              </span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '500px' }}>
              24 comfortable rooms, steps from the shore. Whether you&apos;re here for a weekend getaway or a week-long retreat, DownBeach Motel is your home by the sea.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/book"><button className="btn-primary">Book Your Stay</button></Link>
              <Link href="/rooms"><button className="btn-outline">View Rooms</button></Link>
            </div>

            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              {[{ value: '24', label: 'Rooms' }, { value: '2 min', label: 'To the beach' }, { value: '4.8★', label: 'Guest rating' }].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-sky-700)' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROOM PREVIEWS ── */}
      <section style={{ padding: '5rem 0', background: 'var(--color-surface)' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: 'var(--color-sky-600)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Accommodations</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--color-sky-900)', letterSpacing: '-0.02em' }}>Choose Your Room</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem', maxWidth: '480px', marginInline: 'auto', lineHeight: 1.6 }}>
              From cozy standard rooms to spacious family suites — all with complimentary Wi-Fi and our signature coastal comfort.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {ROOMS.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/rooms"><button className="btn-ghost">See All Rooms &amp; Rates →</button></Link>
          </div>
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section id="amenities" style={{ padding: '5rem 0', background: 'linear-gradient(180deg, var(--color-sky-50) 0%, var(--color-surface) 100%)' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: 'var(--color-sky-600)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>What&apos;s Included</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--color-sky-900)', letterSpacing: '-0.02em' }}>Everything You Need</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {AMENITIES.map((a) => (
              <div key={a.title} className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{a.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-sky-900)', marginBottom: '0.4rem' }}>{a.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section id="location" style={{ padding: '5rem 0', background: 'var(--color-surface)' }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--color-sky-600)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Find Us</p>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--color-sky-900)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Prime Beachfront Location</h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Located at 123 Beachfront Ave, Shore City, NJ — right in the heart of the strip. Walk to restaurants, shops, and of course the beach.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: '📍', text: '123 Beachfront Ave, Shore City, NJ 08008' },
                  { icon: '📞', text: '(609) 123-4567' },
                  { icon: '✉️', text: 'stay@downbeach.com' },
                ].map((item) => (
                  <div key={item.text} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    <span>{item.icon}</span><span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: '320px', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, var(--color-sky-100), var(--color-sky-200))', border: '1px solid var(--color-sky-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-sky-600)' }}>
              <span style={{ fontSize: '2.5rem' }}>🗺️</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Interactive Map</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Coming in Phase 2</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section id="contact" style={{ padding: '5rem 0', background: 'linear-gradient(135deg, var(--color-sky-700) 0%, var(--color-sky-900) 100%)' }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Ready to Book Your Stay?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '480px', marginInline: 'auto', lineHeight: 1.6 }}>
            Check availability and reserve your room in minutes. Best rates guaranteed when booking direct.
          </p>
          <Link href="/book"><button className="btn-cta-white">Check Availability</button></Link>
        </div>
      </section>
    </>
  );
}
