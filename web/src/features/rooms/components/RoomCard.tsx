'use client';

import Link from 'next/link';
import type { Room } from '../types';

export default function RoomCard({ room }: { room: Room }) {
  return (
    <div
      className="room-card"
      style={{
        background: 'var(--color-surface-card)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid rgba(186,230,253,0.35)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          height: '210px',
          background: room.imagePlaceholderGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span style={{ color: 'rgba(3,105,161,0.5)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em' }}>
          PHOTO COMING SOON
        </span>
        <span
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255,255,255,0.9)',
            color: 'var(--color-sky-700)',
            fontWeight: 700,
            fontSize: '0.8rem',
            padding: '0.3rem 0.7rem',
            borderRadius: '999px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {room.beds}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-sky-900)' }}>{room.name}</h3>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-sky-600)' }}>
              ${room.pricePerNight}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>/night</span>
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{room.description}</p>

        {/* Amenities */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
          {room.amenities.slice(0, 4).map((a) => (
            <span
              key={a}
              style={{
                fontSize: '0.72rem',
                fontWeight: 500,
                background: 'var(--color-sky-50)',
                color: 'var(--color-sky-700)',
                border: '1px solid var(--color-sky-200)',
                borderRadius: '999px',
                padding: '0.2rem 0.6rem',
              }}
            >
              {a}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 500,
                background: 'var(--color-sky-100)',
                color: 'var(--color-sky-600)',
                borderRadius: '999px',
                padding: '0.2rem 0.6rem',
              }}
            >
              +{room.amenities.length - 4} more
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Up to {room.maxGuests} guest{room.maxGuests > 1 ? 's' : ''}
        </p>

        <Link href={`/book?room=${room.id}`} style={{ marginTop: '0.5rem' }}>
          <button className="btn-primary" style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            Select Room
          </button>
        </Link>
      </div>
    </div>
  );
}
