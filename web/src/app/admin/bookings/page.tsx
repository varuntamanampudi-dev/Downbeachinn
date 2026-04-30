import { db } from '@/lib/db/client';
import { bookings, rooms } from '@/lib/db/schema';
import { eq, desc, count, sum } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { formatMoney } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:     { bg: '#fffbeb', color: '#b45309', label: 'Pending'    },
  confirmed:   { bg: '#f0fdf4', color: '#15803d', label: 'Confirmed'  },
  checked_in:  { bg: '#eff6ff', color: '#1d4ed8', label: 'Checked In' },
  checked_out: { bg: '#f8fafc', color: '#475569', label: 'Checked Out'},
  cancelled:   { bg: '#fef2f2', color: '#b91c1c', label: 'Cancelled'  },
};

async function updateStatus(formData: FormData) {
  'use server';
  const id     = Number(formData.get('id'));
  const status = formData.get('status') as typeof bookings.$inferSelect.status;
  if (!id || !status) return;
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
  revalidatePath('/admin/bookings');
}

export default async function AdminBookingsPage() {
  const all = await db
    .select({
      id:               bookings.id,
      confirmationCode: bookings.confirmationCode,
      guestFirstName:   bookings.guestFirstName,
      guestLastName:    bookings.guestLastName,
      guestEmail:       bookings.guestEmail,
      guestPhone:       bookings.guestPhone,
      guestAddress:     bookings.guestAddress,
      guestCity:        bookings.guestCity,
      guestState:       bookings.guestState,
      guestZip:         bookings.guestZip,
      roomName:         rooms.name,
      checkIn:          bookings.checkIn,
      checkOut:         bookings.checkOut,
      nights:           bookings.nights,
      adults:           bookings.adults,
      children:         bookings.children,
      total:            bookings.total,
      status:           bookings.status,
      specialRequests:  bookings.specialRequests,
      createdAt:        bookings.createdAt,
    })
    .from(bookings)
    .leftJoin(rooms, eq(bookings.roomId, rooms.id))
    .orderBy(desc(bookings.createdAt));

  const [totals] = await db.select({ count: count(), revenue: sum(bookings.total) }).from(bookings);
  const [pending]   = await db.select({ c: count() }).from(bookings).where(eq(bookings.status, 'pending'));
  const [confirmed] = await db.select({ c: count() }).from(bookings).where(eq(bookings.status, 'confirmed'));

  const STATS = [
    { label: 'Total Bookings',  value: totals?.count ?? 0,                           color: '#0d9488' },
    { label: 'Pending',         value: pending?.c ?? 0,                              color: '#f59e0b' },
    { label: 'Confirmed',       value: confirmed?.c ?? 0,                            color: '#22c55e' },
    { label: 'Total Revenue',   value: `$${formatMoney(Number(totals?.revenue ?? 0))}`, color: '#6366f1' },
  ];

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Bookings</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>All reservation requests — update status as guests check in and out.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {STATS.map(({ label, value, color }) => (
          <div key={label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 1px 4px rgba(13,27,42,0.06)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color, marginTop: '0.35rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {all.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No bookings yet. They will appear here when guests submit reservations.
        </div>
      ) : (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 4px rgba(13,27,42,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Code', 'Guest', 'Room', 'Dates', 'Guests', 'Total', 'Status', 'Action'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {all.map((b, i) => {
                const sc = STATUS_COLORS[b.status] ?? STATUS_COLORS.pending;
                return (
                  <tr key={b.id} style={{ borderBottom: i < all.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--color-teal)', fontFamily: 'monospace', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{b.confirmationCode}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{b.guestFirstName} {b.guestLastName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{b.guestEmail}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{b.guestPhone}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{b.roomName}</td>
                    <td style={{ padding: '0.9rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ color: 'var(--color-navy)', fontWeight: 600 }}>{b.checkIn}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>→ {b.checkOut} · {b.nights}n</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {b.adults}A{b.children > 0 ? ` · ${b.children}C` : ''}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--color-navy)', whiteSpace: 'nowrap' }}>${formatMoney(b.total)}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{ background: sc.bg, color: sc.color, padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {sc.label}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <form action={updateStatus}>
                        <input type="hidden" name="id" value={b.id} />
                        <select
                          name="status"
                          defaultValue={b.status}
                          onChange={() => {}}
                          style={{ fontSize: '0.78rem', padding: '0.3rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.4rem', background: 'white', color: 'var(--color-navy)', cursor: 'pointer' }}
                        />
                        <StatusSelect currentStatus={b.status} bookingId={b.id} updateFn={updateStatus} />
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusSelect({ currentStatus, bookingId, updateFn }: { currentStatus: string; bookingId: number; updateFn: (f: FormData) => Promise<void> }) {
  const statuses = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
  return (
    <form action={updateFn} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
      <input type="hidden" name="id" value={bookingId} />
      <select name="status" defaultValue={currentStatus} style={{ fontSize: '0.78rem', padding: '0.3rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.4rem', background: 'white', color: 'var(--color-navy)', cursor: 'pointer' }}>
        {statuses.map((s) => (
          <option key={s} value={s}>{STATUS_COLORS[s]?.label ?? s}</option>
        ))}
      </select>
      <button type="submit" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', background: 'var(--color-teal)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
        Save
      </button>
    </form>
  );
}
