import { db } from '@/lib/db/client';
import { rooms, pricingRules, taxConfig, bookings } from '@/lib/db/schema';
import { eq, count, sum } from 'drizzle-orm';
import Link from 'next/link';
import { BedDouble, Tag, Percent, ChevronRight, CalendarCheck } from 'lucide-react';
import { formatMoney } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [totalRooms]       = await db.select({ c: count() }).from(rooms);
  const [activeRooms]      = await db.select({ c: count() }).from(rooms).where(eq(rooms.isActive, true));
  const [activePriceRules] = await db.select({ c: count() }).from(pricingRules).where(eq(pricingRules.isActive, true));
  const [tax]              = await db.select({ rate: taxConfig.ratePercent }).from(taxConfig);
  const [pendingBookings]  = await db.select({ c: count() }).from(bookings).where(eq(bookings.status, 'pending'));
  const [allBookings]      = await db.select({ c: count(), rev: sum(bookings.total) }).from(bookings);
  return {
    total:          totalRooms?.c  ?? 0,
    active:         activeRooms?.c ?? 0,
    priceRules:     activePriceRules?.c ?? 0,
    taxRate:        tax?.rate ?? 13.63,
    pendingBookings: pendingBookings?.c ?? 0,
    totalBookings:  allBookings?.c ?? 0,
    revenue:        Number(allBookings?.rev ?? 0),
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const STATS = [
    { label: 'Total Bookings',     value: stats.totalBookings,          sub: `${stats.pendingBookings} pending`,  Icon: CalendarCheck, color: '#0d9488', bg: 'rgba(13,148,136,0.12)', border: 'rgba(13,148,136,0.25)' },
    { label: 'Total Revenue',      value: `$${formatMoney(stats.revenue)}`, sub: 'all bookings combined',         Icon: Percent,       color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.25)' },
    { label: 'Active Rooms',       value: stats.active,                 sub: `of ${stats.total} total`,           Icon: BedDouble,     color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)'  },
    { label: 'NJ Hotel Tax',       value: `${stats.taxRate}%`,          sub: 'applied at checkout',               Icon: Tag,           color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)',  border: 'rgba(14,165,233,0.25)' },
  ];

  const QUICK_ACTIONS = [
    { href: '/admin/bookings', label: 'View Bookings',  desc: `${stats.pendingBookings} pending — confirm, check in, check out`, Icon: CalendarCheck },
    { href: '/admin/rooms',    label: 'Manage Rooms',   desc: 'Toggle availability & edit base prices',  Icon: BedDouble },
    { href: '/admin/pricing',  label: 'Pricing Rules',  desc: 'Create seasonal / event date overrides',  Icon: Tag       },
    { href: '/admin/settings', label: 'Tax Settings',   desc: 'Update the NJ hotel/motel tax rate',      Icon: Percent   },
  ];

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Overview</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Live snapshot of your property.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {STATS.map(({ label, value, sub, Icon, color, bg, border }) => (
          <div key={label} style={{ background: 'white', borderRadius: '0.875rem', border: '1px solid #e2e8f0', padding: '1.4rem', boxShadow: '0 1px 4px rgba(13,27,42,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={19} color={color} strokeWidth={2} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '0.3rem' }}>{label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {QUICK_ACTIONS.map(({ href, label, desc, Icon }) => (
            <Link key={href} href={href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.1rem 1.25rem',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.875rem',
              textDecoration: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              boxShadow: '0 1px 4px rgba(13,27,42,0.04)',
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color="var(--color-teal)" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.9rem' }}>{label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{desc}</div>
              </div>
              <ChevronRight size={18} color="var(--color-text-muted)" strokeWidth={2} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
