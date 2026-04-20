'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Wifi, Wind, Tv, Refrigerator, Microwave, Bath, Sofa, BriefcaseBusiness, BedDouble, BedSingle, Images, ChevronRight } from 'lucide-react';
import type { Room } from '../types';
import { formatMoney } from '@/lib/pricing';
import { hasImages, ROOM_IMAGES, roomImagePath } from '../room-images.config';
import RoomGallery from './RoomGallery';

interface Props {
  room: Room;
}

const AMENITY_ICONS: Record<string, React.ElementType> = {
  'Wi-Fi': Wifi,
  'Air Conditioning': Wind,
  'Smart TV': Tv,
  'Mini Fridge': Refrigerator,
  'Microwave': Microwave,
  'Jacuzzi': Bath,
  'Sofa': Sofa,
  'Work Desk': BriefcaseBusiness,
  'King Bed': BedDouble,
  'Queen Bed': BedDouble,
  'Two Double Beds': BedSingle,
};

export default function RoomCard({ room }: Props) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const roomHasImages = hasImages(room.type);
  const imageCount = ROOM_IMAGES[room.type]?.length ?? 0;

  const thumbSrc = roomHasImages
    ? roomImagePath(room.type, ROOM_IMAGES[room.type][0].filename)
    : null;

  const TypeIcon = room.type === 'suite' ? Bath : BedDouble;

  return (
    <>
      <div
        className="room-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--color-warm-100)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Image Block ── */}
        <div
          style={{ height: '260px', position: 'relative', background: room.imagePlaceholderGradient, overflow: 'hidden', cursor: 'pointer' }}
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
              style={{ objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
              sizes="(max-width: 768px) 100vw, 420px"
            />
          ) : (
            <div style={{
              height: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TypeIcon size={32} color="rgba(255,255,255,0.6)" strokeWidth={1.25} />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Photos Coming Soon
              </span>
            </div>
          )}

          {/* Dark gradient overlay at bottom */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(13,27,42,0.65) 0%, rgba(13,27,42,0.1) 50%, transparent 100%)',
            transition: 'opacity 0.3s',
            opacity: hovered ? 1 : 0.7,
          }} />

          {/* Price badge — top right */}
          <div style={{
            position: 'absolute', top: '14px', right: '14px',
            background: 'rgba(13,27,42,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '0.4rem 0.75rem',
            textAlign: 'center',
            color: 'white',
          }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>${formatMoney(room.basePricePerNight)}</div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, marginTop: '2px' }}>/night</div>
          </div>

          {/* Jacuzzi badge */}
          {room.hasJacuzzi && (
            <div style={{
              position: 'absolute', top: '14px', left: '14px',
              background: 'var(--color-teal)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.7rem',
              padding: '0.3rem 0.7rem',
              borderRadius: '999px',
              letterSpacing: '0.04em',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              <Bath size={12} strokeWidth={2} /> Jacuzzi
            </div>
          )}

          {/* Hover CTA overlay */}
          <div style={{
            position: 'absolute', bottom: '14px', left: '50%',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s, transform 0.25s',
            transform: `translateX(-50%) translateY(${hovered ? '0' : '6px'})`,
            display: 'flex', gap: '0.5rem',
          }}>
            <button
              style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onClick={(e) => { e.stopPropagation(); setGalleryOpen(true); }}
            >
              <Images size={13} strokeWidth={2} style={{ display: 'inline', marginRight: '0.3rem' }} />
              {roomHasImages ? `${imageCount} photos` : 'Gallery'}
            </button>
          </div>

          {/* Beds badge — bottom left */}
          <div style={{
            position: 'absolute', bottom: '14px', left: '14px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            padding: '0.3rem 0.65rem',
            borderRadius: '999px',
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.2s',
          }}>
            {room.beds}
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name + guests */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-navy)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{room.name}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-warm-50)', border: '1px solid var(--color-warm-100)', borderRadius: '999px', padding: '0.2rem 0.6rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Up to {room.maxGuests} guests
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{room.description}</p>
          </div>

          {/* Amenity pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {room.amenities.slice(0, 4).map((a) => {
              const AmenityIcon = AMENITY_ICONS[a];
              return (
                <span key={a} style={{
                  fontSize: '0.72rem', fontWeight: 500,
                  background: '#f0fdfa',
                  color: 'var(--color-teal)',
                  border: '1px solid rgba(13,148,136,0.2)',
                  borderRadius: '999px',
                  padding: '0.22rem 0.65rem',
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                }}>
                  {AmenityIcon && <AmenityIcon size={11} strokeWidth={2} />}
                  {a}
                </span>
              );
            })}
            {room.amenities.length > 4 && (
              <span style={{
                fontSize: '0.72rem', fontWeight: 500,
                background: 'var(--color-warm-50)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-warm-100)',
                borderRadius: '999px',
                padding: '0.22rem 0.65rem',
              }}>
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>

          {/* Action row */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto', paddingTop: '0.25rem' }}>
            <button
              onClick={() => setGalleryOpen(true)}
              style={{
                padding: '0.65rem 1rem',
                background: 'transparent',
                color: 'var(--color-navy)',
                border: '1.5px solid var(--color-warm-100)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-teal)'; e.currentTarget.style.color = 'var(--color-teal)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-warm-100)'; e.currentTarget.style.color = 'var(--color-navy)'; }}
            >
              Photos
            </button>
            <Link href={`/book?room=${room.type}`} style={{ flex: 1 }}>
              <button className="btn-primary" style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                Select Room <ChevronRight size={15} strokeWidth={2.5} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <RoomGallery room={room} isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </>
  );
}
