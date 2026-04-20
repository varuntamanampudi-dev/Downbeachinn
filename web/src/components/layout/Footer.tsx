import Link from 'next/link';
import { MapPin, Phone, Mail, Star, ChevronRight } from 'lucide-react';
import { MOTEL } from '@/lib/constants';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-navy)',
      color: 'rgba(255,255,255,0.6)',
      padding: '4rem 0 0',
      marginTop: 'auto',
    }}>
      <div className="section-container">

        {/* ── Main grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>

          {/* Brand column */}
          <div style={{ maxWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '38px', height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0d9488, #0a7c71)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '0.85rem',
                boxShadow: '0 2px 12px rgba(13,148,136,0.4)',
              }}>DB</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{MOTEL.name}</div>
                <div style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--color-teal-light)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Atlantic City, NJ</div>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              {MOTEL.totalRooms} comfortable rooms on Pacific Ave. Steps from the boardwalk, beach, and Atlantic City's best attractions.
            </p>
            {/* Rating pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              padding: '0.4rem 0.9rem',
              fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)',
            }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
              <span style={{ marginLeft: '0.25rem' }}>4.8 · 200+ reviews</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { label: 'Rooms & Rates', href: '/rooms' },
                { label: 'Book a Room', href: '/book' },
                { label: 'Amenities', href: '/#amenities' },
                { label: 'Location & Map', href: '/#location' },
                { label: 'Contact Us', href: '/#contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ChevronRight size={13} color="var(--color-teal)" strokeWidth={2.5} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--color-teal-light)" strokeWidth={1.75} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{MOTEL.addressLine1}<br />{MOTEL.addressLine2}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={16} color="var(--color-teal-light)" strokeWidth={1.75} style={{ flexShrink: 0 }} />
                <a href={`tel:+1${MOTEL.phonePlain}`} className="footer-link" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {MOTEL.phone}
                </a>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={16} color="var(--color-teal-light)" strokeWidth={1.75} style={{ flexShrink: 0 }} />
                <a href={`mailto:${MOTEL.email}`} className="footer-link" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {MOTEL.email}
                </a>
              </div>
            </div>

            {/* Book CTA */}
            <Link href="/book" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
              <button className="btn-primary" style={{ padding: '0.7rem 1.5rem', fontSize: '0.875rem' }}>
                Book Now →
              </button>
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          padding: '1.5rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.35)',
        }}>
          <p>&copy; {new Date().getFullYear()} {MOTEL.name}. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" className="footer-link" style={{ color: 'rgba(255,255,255,0.35)' }}>Privacy Policy</Link>
            <Link href="/terms" className="footer-link" style={{ color: 'rgba(255,255,255,0.35)' }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
