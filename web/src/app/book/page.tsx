import BookingForm from '@/features/bookings/components/BookingForm';

export const metadata = {
  title: 'Book a Room — DownBeach Motel',
  description: 'Reserve your room at DownBeach Motel. Check availability, select dates, and book online.',
};

export default function BookPage() {
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
            Reservations
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--color-sky-900)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Book Your Stay
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.7 }}>
            Fill in your details below and we&apos;ll confirm your reservation. Best rates guaranteed when booking direct.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section style={{ padding: '3rem 0 5rem', background: 'var(--color-surface)' }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            <BookingForm />

            {/* Side info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-sky-900)', marginBottom: '1rem' }}>Why Book Direct?</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {[
                    'Lowest guaranteed rate',
                    'Free cancellation (48h notice)',
                    'Instant confirmation email',
                    'No third-party booking fees',
                    'Direct contact with our team',
                  ].map((item) => (
                    <li key={item} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <span style={{ color: 'var(--color-sky-500)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-sky-900)', marginBottom: '0.5rem' }}>Need Help?</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Our front desk is available 24/7 to assist you with your booking.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a href="tel:+16091234567" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-sky-700)', fontWeight: 600 }}>
                    <span>📞</span> (609) 123-4567
                  </a>
                  <a href="mailto:stay@downbeach.com" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-sky-700)', fontWeight: 600 }}>
                    <span>✉️</span> stay@downbeach.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
