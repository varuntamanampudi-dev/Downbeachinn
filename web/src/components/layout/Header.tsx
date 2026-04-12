'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MOTEL } from '@/lib/constants';

const navLinks = [
  { label: 'Rooms & Rates', href: '/rooms' },
  { label: 'Amenities', href: '/#amenities' },
  { label: 'Location', href: '/#location' },
  { label: 'Contact', href: '/#contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(186,230,253,0.5)',
        boxShadow: 'var(--shadow-nav)',
      }}
    >
      <div className="section-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-sky-400), var(--color-sky-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            DB
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-sky-900)', letterSpacing: '-0.02em' }}>
            {MOTEL.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)', transition: 'color 0.2s' }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/book" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem', borderRadius: 'var(--radius-md)' }}>
              Book Now
            </button>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexDirection: 'column',
            gap: '5px',
            padding: '4px',
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: 'var(--color-sky-700)',
                borderRadius: '2px',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          style={{
            background: 'white',
            borderTop: '1px solid var(--color-sky-100)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setMenuOpen(false)}>
            <button
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, var(--color-sky-500), var(--color-sky-700))',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Book Now
            </button>
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
