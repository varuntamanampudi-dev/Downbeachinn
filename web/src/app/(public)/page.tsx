import Link from 'next/link';
import {
  Waves, ParkingCircle, Wifi, Thermometer, BellRing, Landmark,
  ShoppingBag, Camera, Wind, Cigarette, MapPin, Phone, Mail,
  Star, Check, CalendarCheck, BadgeCheck, ChevronRight,
} from 'lucide-react';
import RoomCard from '@/features/rooms/components/RoomCard';
import { getRoomTypes } from '@/features/rooms/queries';
import { MOTEL } from '@/lib/constants';
import HeroBookingWidget from '@/components/HeroBookingWidget';

const HOTEL_AMENITIES = [
  { Icon: Waves,       title: 'Steps from the Beach',       desc: 'Walk to the sand in under 5 minutes.' },
  { Icon: ParkingCircle, title: 'Free Parking Sun – Thu',   desc: 'Complimentary on-site parking every Sunday through Thursday.' },
  { Icon: Wifi,        title: 'Free High-Speed Wi-Fi',      desc: 'Fast, reliable Wi-Fi throughout the entire property.' },
  { Icon: Thermometer, title: 'Individual Climate Control', desc: 'Personal A/C and heating in every room.' },
  { Icon: BellRing,    title: '24/7 Front Desk',            desc: 'Someone always here to help, day or night.' },
  { Icon: Landmark,    title: 'ATM On-Site',                desc: 'Convenient ATM available on the property.' },
  { Icon: ShoppingBag, title: 'Vending Machines',           desc: 'Snacks and drinks available around the clock.' },
  { Icon: Camera,      title: 'Security Surveillance',      desc: 'Property-wide exterior cameras for your peace of mind.' },
  { Icon: Wind,        title: 'Exterior Corridors',         desc: 'Open-air exterior corridors with easy room access.' },
  { Icon: Cigarette,   title: 'Smoking Areas',              desc: 'Designated outdoor smoking areas away from rooms.' },
];

const NEARBY = [
  { name: 'ACH Casino Resort',               dist: '257 yd' },
  { name: 'Tropicana Casino & Resort',       dist: '0.4 mi' },
  { name: 'Quarter at Tropicana',            dist: '0.5 mi' },
  { name: 'Atlantic City Boardwalk Hall',    dist: '0.8 mi' },
  { name: 'Caesars Atlantic City',           dist: '1 mi'   },
  { name: 'Playground Pier',                dist: '1 mi'   },
  { name: 'Tanger Outlets The Walk',         dist: '1.1 mi' },
  { name: "Bally's Atlantic City",           dist: '1.2 mi' },
  { name: 'Atlantic City Convention Center', dist: '1.2 mi' },
  { name: 'The Wild Wild West Casino',       dist: '1.2 mi' },
  { name: 'Resorts Casino Hotel',            dist: '1.8 mi' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', stars: 5, text: 'Perfect location — walked to the casino in 5 minutes. Rooms were clean and comfortable. Will definitely be back!' },
  { name: 'James R.', stars: 5, text: 'Great value for the price. Staff was super helpful. The Jacuzzi suite was a highlight of our anniversary trip.' },
  { name: 'Linda K.', stars: 4, text: 'Very convenient spot right on Pacific Ave. Easy parking, quiet rooms, and a short walk to the boardwalk.' },
];

const TRUST_BADGES = [
  { Icon: BadgeCheck, text: 'Best rate guaranteed' },
  { Icon: CalendarCheck, text: 'Free cancellation (48h)' },
  { Icon: Check, text: 'Instant confirmation' },
  { Icon: Star, text: '4.8 · 200+ reviews' },
];

export default async function HomePage() {
  const roomTypes = await getRoomTypes();

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh',
        backgroundImage: 'url("/images/hotel-hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#071320',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '72px',
      }}>
        {/* Dark overlay so text stays readable over the photo */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, rgba(7,19,32,0.80) 0%, rgba(13,27,42,0.70) 50%, rgba(10,42,58,0.75) 100%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div className="section-container" style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem 5rem' }}>
          {/* Location badge */}
          <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.4)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.75rem' }}>
            <MapPin size={12} color="var(--color-teal-light)" strokeWidth={2.5} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-teal-light)', letterSpacing: '0.05em' }}>
              {MOTEL.addressLine1} · {MOTEL.addressLine2}
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay-1" style={{ fontSize: 'clamp(2.75rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', color: 'white', marginBottom: '1.5rem', maxWidth: '720px' }}>
            Your Atlantic City<br />
            <span style={{ background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #a7f3d0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Beach Escape
            </span>{' '}Awaits
          </h1>

          <p className="animate-fade-up-delay-2" style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '520px' }}>
            {MOTEL.totalRooms} rooms on Pacific Ave — steps from the sand, casinos, and boardwalk.
            Best rates guaranteed when you book direct.
          </p>

          <div className="animate-fade-up-delay-3">
            <HeroBookingWidget />
          </div>

          {/* Trust strip */}
          <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.75rem' }}>
            {TRUST_BADGES.map(({ Icon, text }) => (
              <span key={text} className="trust-badge">
                <Icon size={14} color="var(--color-teal-light)" strokeWidth={2.5} />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
          <div className="section-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', padding: '0' }}>
            {[
              { value: `${MOTEL.totalRooms}`, label: 'Comfortable Rooms' },
              { value: '5 min',  label: 'Walk to Beach' },
              { value: '4.8★',  label: 'Guest Rating' },
              { value: '24/7',  label: 'Front Desk' },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: '1.25rem 1.5rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'white', letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ROOMS PREVIEW
          ══════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'var(--color-cream)' }}>
        <div className="section-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-label">✦ Accommodations</p>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Choose Your Room
              </h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.6rem', maxWidth: '420px', lineHeight: 1.6, fontSize: '0.95rem' }}>
                From cozy king rooms to our premium Jacuzzi Suite — every room is non-smoking and just minutes from the beach.
              </p>
            </div>
            <Link href="/rooms">
              <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                View All Rooms <ChevronRight size={16} />
              </button>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.75rem' }}>
            {roomTypes.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOTEL AMENITIES — Dark section
          ══════════════════════════════════════════ */}
      <section id="amenities" style={{ padding: '6rem 0', background: 'var(--color-navy)' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-teal-light)', marginBottom: '0.75rem' }}>✦ Property Features</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>
              Hotel Amenities
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem', maxWidth: '460px', marginInline: 'auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Everything you need for a great stay, included at {MOTEL.name}.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            {HOTEL_AMENITIES.map(({ Icon, title, desc }) => (
              <div key={title} className="amenity-card" style={{ padding: '1.75rem 1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={20} color="var(--color-teal-light)" strokeWidth={1.75} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white', marginBottom: '0.35rem' }}>{title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'var(--color-warm-50)' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">✦ Guest Reviews</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.03em' }}>
              What Our Guests Say
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-warm-100)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-navy)' }}>{t.name}</div>
              </div>
            ))}
          </div>

          {/* Overall rating */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem', background: 'white', border: '1px solid var(--color-warm-100)', borderRadius: 'var(--radius-xl)', padding: '1.25rem 2rem', boxShadow: 'var(--shadow-card)' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: '3rem', color: 'var(--color-navy)', lineHeight: 1 }}>4.8</div>
                <div style={{ display: 'flex', gap: '0.15rem', marginTop: '0.35rem', justifyContent: 'center' }}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid #f0ede6', paddingLeft: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.95rem' }}>Overall Rating</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Based on 200+ verified reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LOCATION + MAP + NEARBY
          ══════════════════════════════════════════ */}
      <section id="location" style={{ padding: '6rem 0', background: 'var(--color-cream)' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="section-label">✦ Find Us</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.03em' }}>
              Prime Atlantic City Location
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Walking distance to casinos, the boardwalk, dining, and the beach.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '2rem', alignItems: 'start' }}>
            {/* Left: contact + nearby */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { Icon: MapPin, label: 'Address', value: MOTEL.address },
                { Icon: Phone,  label: 'Phone',   value: MOTEL.phone   },
                { Icon: Mail,   label: 'Email',   value: MOTEL.email   },
              ].map(({ Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', border: '1px solid var(--color-warm-100)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: '38px', height: '38px', background: 'var(--color-teal-50)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="var(--color-teal)" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '0.15rem' }}>{label}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{value}</div>
                  </div>
                </div>
              ))}

              {/* What's Nearby */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-warm-100)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ padding: '1rem 1.25rem', background: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <MapPin size={16} color="var(--color-teal-light)" strokeWidth={2} />
                  <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>What&apos;s Nearby</h3>
                </div>
                {NEARBY.map((place, i) => (
                  <div key={place.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1.25rem', borderBottom: i < NEARBY.length - 1 ? '1px solid #faf9f6' : 'none' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>{place.name}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-teal)', flexShrink: 0, marginLeft: '1rem', background: 'var(--color-teal-50)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>{place.dist}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: map */}
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card-hover)', border: '1px solid var(--color-warm-100)', lineHeight: 0 }}>
              <iframe
                title="Downbeach Inn — 3601 Pacific Ave, Atlantic City, NJ"
                src="https://maps.google.com/maps?q=3601+Pacific+Ave,+Atlantic+City,+NJ+08401&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="520"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
          ══════════════════════════════════════════ */}
      <section id="contact" style={{ padding: '6rem 0', background: 'linear-gradient(135deg, var(--color-navy) 0%, #0a2a3a 50%, #071320 100%)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(13,148,136,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="section-container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-teal-light)', marginBottom: '1rem' }}>✦ Best Rate Guaranteed</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: '1.25rem', lineHeight: 1.1 }}>
            Ready for Your<br />Perfect Beach Getaway?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', marginBottom: '2.5rem', maxWidth: '440px', marginInline: 'auto', lineHeight: 1.65 }}>
            Book directly with us for the lowest rate, free cancellation, and instant confirmation.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book">
              <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Book Your Room <ChevronRight size={18} />
              </button>
            </Link>
            <a href={`tel:+1${MOTEL.phonePlain}`}>
              <button className="btn-outline" style={{ padding: '1rem 2rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} /> Call {MOTEL.phone}
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
