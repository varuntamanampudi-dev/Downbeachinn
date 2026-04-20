'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MOTEL } from '@/lib/constants';

const navLinks = [
  { label: 'Rooms',     href: '/rooms'      },
  { label: 'Amenities', href: '/#amenities' },
  { label: 'Location',  href: '/#location'  },
  { label: 'Contact',   href: '/#contact'   },
];

export default function Header() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: solid ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: solid ? 'blur(20px)' : 'none',
      borderBottom: solid ? '1px solid rgba(0,0,0,0.08)' : 'none',
      boxShadow: solid ? '0 2px 20px rgba(13,27,42,0.1)' : 'none',
      transition: 'background 0.3s, box-shadow 0.3s, border-color 0.3s',
    }}>
      <div className="section-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px', height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0d9488, #0a7c71)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '0.9rem',
            letterSpacing: '-0.02em',
            boxShadow: '0 2px 8px rgba(13,148,136,0.4)',
          }}>DB</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: solid ? 'var(--color-navy)' : 'white', lineHeight: 1.1, letterSpacing: '-0.02em', transition: 'color 0.3s' }}>
              {MOTEL.name}
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 600, color: solid ? 'var(--color-teal)' : 'rgba(255,255,255,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'color 0.3s' }}>
              Atlantic City, NJ
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{ fontSize: '0.875rem', fontWeight: 500, color: solid ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.85)', transition: 'color 0.3s' }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/book">
            <button className="btn-primary" style={{ padding: '0.55rem 1.35rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              Book Now
            </button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', flexDirection: 'column', gap: '5px' }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: 'block', width: '22px', height: '2px',
              background: solid ? 'var(--color-navy)' : 'white',
              borderRadius: '2px',
              transition: 'background 0.3s',
            }} />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #f0ede6', padding: '1.25rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 8px 24px rgba(13,27,42,0.12)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-secondary)', padding: '0.4rem 0', borderBottom: '1px solid #f5f4f0' }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setMenuOpen(false)} style={{ marginTop: '0.25rem' }}>
            <button className="btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Book Now</button>
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
