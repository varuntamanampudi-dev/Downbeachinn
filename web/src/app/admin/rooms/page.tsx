import { db } from '@/lib/db/client';
import { rooms } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { CheckCircle, XCircle, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function toggleRoom(formData: FormData) {
  'use server';
  const id       = Number(formData.get('id'));
  const isActive = formData.get('isActive') === 'true';
  const { eq }   = await import('drizzle-orm');
  await db.update(rooms).set({ isActive: !isActive }).where(eq(rooms.id, id));
  revalidatePath('/admin/rooms');
  revalidatePath('/'); revalidatePath('/rooms'); revalidatePath('/book');
}

async function updatePrice(formData: FormData) {
  'use server';
  const id    = Number(formData.get('id'));
  const price = parseFloat(formData.get('price') as string);
  if (isNaN(price) || price < 0 || price > 9999) return;
  const { eq } = await import('drizzle-orm');
  await db.update(rooms).set({ basePricePerNight: price }).where(eq(rooms.id, id));
  revalidatePath('/admin/rooms');
  revalidatePath('/'); revalidatePath('/rooms'); revalidatePath('/book');
}

async function bulkUpdatePrice(formData: FormData) {
  'use server';
  const type       = formData.get('type') as string;
  const hasJacuzzi = formData.get('hasJacuzzi') === 'true';
  const price      = parseFloat(formData.get('price') as string);
  if (isNaN(price) || price < 0 || price > 9999) return;
  const { eq, and } = await import('drizzle-orm');
  await db
    .update(rooms)
    .set({ basePricePerNight: price })
    .where(and(
      eq(rooms.type, type as 'king' | 'queen' | 'double' | 'suite'),
      eq(rooms.hasJacuzzi, hasJacuzzi)
    ));
  revalidatePath('/admin/rooms');
  revalidatePath('/'); revalidatePath('/rooms'); revalidatePath('/book');
}

const TYPE_LABEL: Record<string, string> = {
  king: 'King', queen: 'Queen', double: 'Double', suite: 'Suite',
};

const inp: React.CSSProperties = {
  width: '90px', padding: '0.4rem 0.5rem',
  border: '1.5px solid #e2e8f0', borderRadius: '0.4rem',
  fontSize: '0.875rem', color: 'var(--color-navy)', fontWeight: 600, background: 'white',
};

export default async function AdminRoomsPage() {
  const allRooms = await db.select().from(rooms).orderBy(rooms.roomNumber);

  // Build unique (type, hasJacuzzi) groups for bulk pricing
  const bulkGroups: { type: string; hasJacuzzi: boolean; label: string; currentPrice: number; count: number }[] = [];
  const seen = new Set<string>();
  for (const r of allRooms) {
    const key = `${r.type}-${r.hasJacuzzi}`;
    if (!seen.has(key)) {
      seen.add(key);
      const label = r.hasJacuzzi
        ? `${TYPE_LABEL[r.type] ?? r.type} + Jacuzzi`
        : `${TYPE_LABEL[r.type] ?? r.type} Room`;
      bulkGroups.push({
        type: r.type,
        hasJacuzzi: r.hasJacuzzi,
        label,
        currentPrice: r.basePricePerNight,
        count: allRooms.filter(x => x.type === r.type && x.hasJacuzzi === r.hasJacuzzi).length,
      });
    }
  }

  // Group rooms by type for the detail table
  const grouped: Record<string, typeof allRooms> = {};
  for (const r of allRooms) {
    grouped[r.type] = grouped[r.type] ?? [];
    grouped[r.type].push(r);
  }

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Rooms</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Use bulk pricing to update all rooms of a type at once, or adjust individual rooms below.
        </p>
      </div>

      {/* ── Bulk Pricing Card ── */}
      <div style={{ background: 'white', borderRadius: '0.875rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 4px rgba(13,27,42,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Zap size={17} color="var(--color-teal)" strokeWidth={2.5} />
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)' }}>Bulk Price Update</h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>sets the same price for every room of that type</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))', gap: '0.85rem' }}>
          {bulkGroups.map(({ type, hasJacuzzi, label, currentPrice, count }) => (
            <form key={`${type}-${hasJacuzzi}`} action={bulkUpdatePrice}>
              <input type="hidden" name="type"       value={type} />
              <input type="hidden" name="hasJacuzzi" value={String(hasJacuzzi)} />
              <div style={{
                border: `1.5px solid ${hasJacuzzi ? 'rgba(13,148,136,0.3)' : '#e2e8f0'}`,
                borderRadius: '0.65rem',
                padding: '1rem 1.1rem',
                background: hasJacuzzi ? 'rgba(13,148,136,0.04)' : '#fafafa',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-navy)' }}>{label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{count} room{count > 1 ? 's' : ''}</div>
                  </div>
                  {hasJacuzzi && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(13,148,136,0.12)', color: 'var(--color-teal)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '999px', padding: '0.2rem 0.55rem' }}>
                      Jacuzzi
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>$</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={currentPrice}
                    style={{ ...inp, width: '90px' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>/night</span>
                  <button type="submit" style={{ marginLeft: 'auto', padding: '0.4rem 0.9rem', background: 'var(--color-teal)', color: 'white', border: 'none', borderRadius: '0.4rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                    Update All
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
      </div>

      {/* ── Individual Rooms ── */}
      {Object.entries(grouped).map(([type, roomList]) => (
        <div key={type} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {TYPE_LABEL[type] ?? type} Rooms · {roomList.length} total
          </h2>

          <div style={{ background: 'white', borderRadius: '0.875rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(13,27,42,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 190px 120px 130px', gap: '1rem', padding: '0.6rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Room</span><span>Details</span><span>Price / Night</span><span>Status</span><span>Toggle</span>
            </div>

            {roomList.map((room, idx) => (
              <div key={room.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 190px 120px 130px', gap: '1rem', padding: '0.85rem 1.25rem', alignItems: 'center', borderBottom: idx < roomList.length - 1 ? '1px solid #f1f5f9' : 'none', opacity: room.isActive ? 1 : 0.55 }}>

                <div style={{ width: '38px', height: '38px', background: room.isActive ? 'rgba(13,148,136,0.08)' : '#f1f5f9', border: `1px solid ${room.isActive ? 'rgba(13,148,136,0.2)' : '#e2e8f0'}`, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: room.isActive ? 'var(--color-teal)' : 'var(--color-text-muted)' }}>
                  {room.roomNumber}
                </div>

                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-navy)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {room.beds}
                    {room.hasJacuzzi && <span style={{ fontSize: '0.65rem', fontWeight: 700, background: 'rgba(13,148,136,0.1)', color: 'var(--color-teal)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '999px', padding: '0.1rem 0.45rem' }}>Jacuzzi</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                    {room.maxGuests} guests · Floor {room.floor}{room.isSmoking ? ' · Smoking' : ''}
                  </div>
                </div>

                <form action={updatePrice} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input type="hidden" name="id" value={room.id} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>$</span>
                  <input name="price" type="number" min="0" step="0.01" defaultValue={room.basePricePerNight} style={inp} />
                  <button type="submit" style={{ padding: '0.4rem 0.65rem', background: 'var(--color-teal)', color: 'white', border: 'none', borderRadius: '0.4rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>Save</button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {room.isActive
                    ? <><CheckCircle size={15} color="#16a34a" strokeWidth={2.5} /><span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#16a34a' }}>Active</span></>
                    : <><XCircle    size={15} color="#dc2626" strokeWidth={2.5} /><span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#dc2626' }}>Inactive</span></>
                  }
                </div>

                <form action={toggleRoom}>
                  <input type="hidden" name="id"      value={room.id} />
                  <input type="hidden" name="isActive" value={String(room.isActive)} />
                  <button type="submit" style={{ padding: '0.4rem 0.9rem', background: room.isActive ? '#fee2e2' : '#dcfce7', color: room.isActive ? '#dc2626' : '#16a34a', border: 'none', borderRadius: '0.4rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                    {room.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
