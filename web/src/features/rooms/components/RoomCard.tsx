'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Room } from '../types';
import { calcPricing, formatMoney } from '@/lib/pricing';
import { hasImages, ROOM_IMAGES, roomImagePath } from '../room-images.config';
import RoomGallery from './RoomGallery';

interface Props {
  room: Room;
  taxRate: number;
}

export default function RoomCard({ room, taxRate }: Props) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { total } = calcPricing(room.basePricePerNight, 1, taxRate);
  const roomHasImages = hasImages(room.type);
  const imageCount = ROOM_IMAGES[room.type]?.length ?? 0;

  // Thumbnail src — first real image or null (shows gradient placeholder)
  const thumbSrc = roomHasImages
    ? roomImagePath(room.type, ROOM_IMAGES[room.type][0].filename)
    : null;

  return (
    <>
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
        {/* ── Image / Placeholder ── */}
        <div
          style={{ height: '210px', position: 'relative', background: room.imagePlaceholderGradient, overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => setGalleryOpen(true)}
          role="button"
          aria-label={`View photos of ${room.name}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setGalleryOpen(true)}
        >
          {thumbSrc ? (
            <Image
              src={thumbSrc}
              alt={`${room.name} at DownBeach Inn`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem' }}>
                {room.type === 'king' ? '🛏️' : room.type === 'queen' ? '🛌' : room.type === 'double' ? '🛏️🛏️' : '🛁'}
              </span>
              <span style={{ color: 'rgba(3,105,161,0.55)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                PHOTOS COMING SOON
              </span>
            </div>
          )}

          {/* View photos button overlay */}
          <div
            style={{
              position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(186,230,253,0.6)',
              borderRadius: '999px',
              padding: '0.3rem 0.9rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-sky-700)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>🖼️</span>
            {roomHasImages ? `View ${imageCount} photo${imageCount > 1 ? 's' : ''}` : 'View Gallery'}
          </div>

          {/* Corner badges */}
          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
            <span style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--color-sky-700)', fontWeight: 700, fontSize: '0.76rem', padding: '0.22rem 0.6rem', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              {room.beds}
            </span>
            {room.hasJacuzzi && (
              <span style={{ background: 'var(--color-sky-700)', color: 'white', fontWeight: 700, fontSize: '0.72rem', padding: '0.22rem 0.6rem', borderRadius: '999px' }}>
                🛁 Jacuzzi
              </span>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-sky-900)' }}>{room.name}</h3>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-sky-600)' }}>
                ${formatMoney(room.basePricePerNight)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>/night + tax</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-sky-500)', fontWeight: 600 }}>
                ${formatMoney(total)} w/ tax
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{room.description}</p>

          {/* Amenity pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
            {room.amenities.slice(0, 4).map((a) => (
              <span key={a} style={{ fontSize: '0.72rem', fontWeight: 500, background: 'var(--color-sky-50)', color: 'var(--color-sky-700)', border: '1px solid var(--color-sky-200)', borderRadius: '999px', padding: '0.2rem 0.6rem' }}>
                {a}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span style={{ fontSize: '0.72rem', fontWeight: 500, background: 'var(--color-sky-100)', color: 'var(--color-sky-600)', borderRadius: '999px', padding: '0.2rem 0.6rem' }}>
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Up to {room.maxGuests} guest{room.maxGuests > 1 ? 's' : ''} · Floor {room.floor}
          </p>

          {/* Action row */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => setGalleryOpen(true)}
              style={{ flex: 1, padding: '0.7rem', background: 'white', color: 'var(--color-sky-700)', border: '2px solid var(--color-sky-200)', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
            >
              View Photos
            </button>
            <Link href={`/book?room=${room.type}`} style={{ flex: 2 }}>
              <button className="btn-primary" style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                Select Room
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <RoomGallery room={room} isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </>
  );
}
