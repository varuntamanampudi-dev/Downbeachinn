import { Phone, Mail, BadgeCheck, CalendarX, MailCheck, CircleDollarSign, Headset, Info } from 'lucide-react';
import { getTaxRate } from '@/features/rooms/queries';
import { MOTEL } from '@/lib/constants';
import ASIBookingForm from './ASIBookingForm';

export const metadata = {
  title: `Book a Room — ${MOTEL.name}`,
  description: 'Reserve your room at Downbeach Inn. Check availability, select dates, and book online.',
};

export default async function BookPage() {
  const taxRate = await getTaxRate();

  return (
    <>
      {/* ── Page Header ── */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy) 0%, #0a2a3a 100%)', padding: '5.5rem 0 3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-80px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="section-label" style={{ color: 'var(--color-teal-light)' }}>✦ Reservations</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            Book Your Stay
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.7 }}>
            Select your dates and guests — you&apos;ll be taken to our secure booking portal to complete your reservation.
          </p>
        </div>
      </section>

      {/* ── Booking ── */}
      <section style={{ padding: '3rem 0 5rem', background: 'var(--color-cream)' }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>

            <ASIBookingForm />

            {/* Side info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-warm-100)', boxShadow: 'var(--shadow-card)', padding: '1.75rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '1.1rem' }}>Why Book Direct?</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[
                    { Icon: BadgeCheck,       text: 'Lowest guaranteed rate' },
                    { Icon: CalendarX,        text: 'Free cancellation (48h notice)' },
                    { Icon: MailCheck,        text: 'Instant confirmation email' },
                    { Icon: CircleDollarSign, text: 'No third-party booking fees' },
                    { Icon: Headset,          text: 'Direct contact with our team' },
                  ].map(({ Icon, text }) => (
                    <li key={text} style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <Icon size={16} color="var(--color-teal)" strokeWidth={2} style={{ flexShrink: 0 }} />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-warm-100)', boxShadow: 'var(--shadow-card)', padding: '1.75rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '0.4rem' }}>Need Help?</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.1rem' }}>
                  Our front desk is available 24/7 to assist you.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <a href={`tel:+1${MOTEL.phonePlain}`} style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-teal)', fontWeight: 600, textDecoration: 'none' }}>
                    <Phone size={16} strokeWidth={2} style={{ flexShrink: 0 }} />{MOTEL.phone}
                  </a>
                  <a href={`mailto:${MOTEL.email}`} style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-teal)', fontWeight: 600, textDecoration: 'none' }}>
                    <Mail size={16} strokeWidth={2} style={{ flexShrink: 0 }} />{MOTEL.email}
                  </a>
                </div>
              </div>

              <div style={{ background: '#f0fdfa', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Info size={16} color="var(--color-teal)" strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-teal)', fontWeight: 700, marginBottom: '0.25rem' }}>About Pricing</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Nightly rates start at $65.00. NJ hotel/motel tax of {taxRate}% is added at checkout. No hidden fees.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
