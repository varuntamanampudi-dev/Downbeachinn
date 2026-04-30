'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BedDouble, Tag, Settings, ExternalLink, LogOut, CalendarCheck } from 'lucide-react';

const NAV = [
  { href: '/admin',           label: 'Overview', Icon: LayoutDashboard },
  { href: '/admin/bookings',  label: 'Bookings', Icon: CalendarCheck   },
  { href: '/admin/rooms',     label: 'Rooms',    Icon: BedDouble       },
  { href: '/admin/pricing',   label: 'Pricing',  Icon: Tag             },
  { href: '/admin/settings',  label: 'Settings', Icon: Settings        },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav style={{ flex: 1, padding: '0.75rem 0.75rem' }}>
      {NAV.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.65rem 0.85rem',
              color: active ? 'white' : 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: active ? 700 : 500,
              background: active ? 'rgba(13,148,136,0.2)' : 'transparent',
              borderRadius: '0.6rem',
              marginBottom: '0.15rem',
              transition: 'background 0.15s, color 0.15s',
              borderLeft: active ? '3px solid var(--color-teal-light)' : '3px solid transparent',
            }}
          >
            <Icon size={17} strokeWidth={active ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <Link
          href="/"
          target="_blank"
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.85rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', textDecoration: 'none', borderRadius: '0.6rem', transition: 'color 0.15s' }}
        >
          <ExternalLink size={15} strokeWidth={2} /> View Live Site
        </Link>
        <a
          href="/admin/logout"
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.85rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', textDecoration: 'none', borderRadius: '0.6rem', transition: 'color 0.15s' }}
        >
          <LogOut size={15} strokeWidth={2} /> Sign Out
        </a>
      </div>
    </nav>
  );
}
