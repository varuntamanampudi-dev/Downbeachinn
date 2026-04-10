import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, var(--color-sky-900) 0%, #071e2e 100%)',
        color: 'rgba(255,255,255,0.75)',
        padding: '3.5rem 0 2rem',
        marginTop: 'auto',
      }}
    >
      <div className="section-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--color-sky-400), var(--color-sky-600))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                DB
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>DownBeach Motel</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              A comfortable stay steps from the shore. 24 rooms, every modern convenience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Rooms & Rates', href: '/rooms' },
                { label: 'Book a Room', href: '/book' },
                { label: 'Amenities', href: '/#amenities' },
                { label: 'Location', href: '/#location' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li>123 Beachfront Ave</li>
              <li>Shore City, NJ 08008</li>
              <li style={{ marginTop: '0.25rem' }}>
                <a href="tel:+16091234567" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  (609) 123-4567
                </a>
              </li>
              <li>
                <a href="mailto:stay@downbeach.com" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  stay@downbeach.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <p style={{ fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} DownBeach Motel. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem' }}>
            <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.55)' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.55)' }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
