'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Room } from '../types';
import { ROOM_IMAGES, roomImagePath, hasImages } from '../room-images.config';

interface Props {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

const PLACEHOLDER_SLIDES = [
  { label: 'Room Overview', icon: '🛏️' },
  { label: 'Bathroom', icon: '🚿' },
  { label: 'Amenities', icon: '☕' },
];

export default function RoomGallery({ room, isOpen, onClose }: Props) {
  const [current, setCurrent] = useState(0);

  const images = ROOM_IMAGES[room.type] ?? [];
  const usingPlaceholders = !hasImages(room.type);
  const total = usingPlaceholders ? PLACEHOLDER_SLIDES.length : images.length;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total) , [total]);

  // Keyboard navigation + close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, prev, next]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(7, 30, 46, 0.88)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {/* Modal — stop click propagation so clicking inside doesn't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '820px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-sky-100)' }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-sky-900)' }}>{room.name}</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
              {usingPlaceholders
                ? 'Photos coming soon — placeholders shown'
                : `Photo ${current + 1} of ${total}`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close gallery"
            style={{ background: 'var(--color-sky-50)', border: '1px solid var(--color-sky-200)', borderRadius: 'var(--radius-md)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1rem', color: 'var(--color-sky-700)', flexShrink: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Main image area */}
        <div style={{ position: 'relative', aspectRatio: '16 / 9', background: room.imagePlaceholderGradient }}>
          {usingPlaceholders ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--color-sky-700)', padding: '2rem' }}>
              <div style={{ fontSize: '3.5rem' }}>{PLACEHOLDER_SLIDES[current].icon}</div>
              <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{PLACEHOLDER_SLIDES[current].label}</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, textAlign: 'center', maxWidth: '300px' }}>
                {room.name} photo coming soon.<br />
                Upload to <code style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.6)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  public/images/rooms/{room.type}/
                </code>
              </p>
            </div>
          ) : (
            <Image
              src={roomImagePath(room.type, images[current].filename)}
              alt={images[current].alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="820px"
              priority
            />
          )}

          {/* Prev / Next arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous photo"
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '1rem', color: 'var(--color-sky-900)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)', transition: 'transform 0.15s',
                }}
              >
                ‹
              </button>
              <button
                onClick={next}
                aria-label="Next photo"
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '1rem', color: 'var(--color-sky-900)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)', transition: 'transform 0.15s',
                }}
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {total > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 0' }}>
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to photo ${i + 1}`}
                style={{
                  width: i === current ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  border: 'none',
                  background: i === current ? 'var(--color-sky-500)' : 'var(--color-sky-200)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Thumbnail strip — only when real images exist */}
        {!usingPlaceholders && images.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1rem 1rem', overflowX: 'auto' }}>
            {images.map((img, i) => (
              <button
                key={img.filename}
                onClick={() => setCurrent(i)}
                style={{
                  flexShrink: 0, width: '72px', height: '52px', borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden', border: i === current ? '2px solid var(--color-sky-500)' : '2px solid transparent',
                  position: 'relative', cursor: 'pointer', padding: 0, background: 'var(--color-sky-100)',
                  transition: 'border-color 0.15s',
                }}
                aria-label={img.alt}
              >
                <Image src={roomImagePath(room.type, img.filename)} alt={img.alt} fill style={{ objectFit: 'cover' }} sizes="72px" />
              </button>
            ))}
          </div>
        )}

        {/* Room details footer */}
        <div style={{ borderTop: '1px solid var(--color-sky-100)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: 'var(--color-sky-50)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {room.amenities.slice(0, 5).map((a) => (
              <span key={a} style={{ fontSize: '0.72rem', fontWeight: 500, background: 'white', color: 'var(--color-sky-700)', border: '1px solid var(--color-sky-200)', borderRadius: '999px', padding: '0.2rem 0.6rem' }}>
                {a}
              </span>
            ))}
          </div>
          <a
            href={`/book?room=${room.type}`}
            style={{ background: 'linear-gradient(135deg, var(--color-sky-500), var(--color-sky-700))', color: 'white', borderRadius: 'var(--radius-md)', padding: '0.6rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', flexShrink: 0 }}
          >
            Book This Room
          </a>
        </div>
      </div>
    </div>
  );
}
