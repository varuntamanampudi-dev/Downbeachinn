import { db } from '@/lib/db/client';
import { taxConfig } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Info, Save } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function updateTaxRate(formData: FormData) {
  'use server';
  const rate = parseFloat(formData.get('rate') as string);
  if (isNaN(rate) || rate < 0 || rate > 100) return;
  const [existing] = await db.select({ id: taxConfig.id }).from(taxConfig);
  if (existing) {
    await db.update(taxConfig).set({ ratePercent: rate }).where(eq(taxConfig.id, existing.id));
  } else {
    await db.insert(taxConfig).values({ label: 'NJ Hotel / Motel Tax', ratePercent: rate });
  }
  revalidatePath('/admin/settings');
  revalidatePath('/book');
  revalidatePath('/rooms');
}

export default async function AdminSettingsPage() {
  const [config] = await db.select().from(taxConfig);
  const currentRate = config?.ratePercent ?? 13.63;

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Tax rate changes apply instantly to the guest-facing booking form.
        </p>
      </div>

      <div style={{ maxWidth: '480px' }}>
        <div style={{ background: 'white', borderRadius: '0.875rem', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 1px 4px rgba(13,27,42,0.06)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.3rem' }}>NJ Hotel / Motel Tax Rate</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Applied to all bookings at checkout. Standard NJ rate is 13.63%.
          </p>

          <form action={updateTaxRate}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.45rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Tax Rate (%)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  name="rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  defaultValue={currentRate}
                  style={{
                    width: '130px',
                    padding: '0.7rem 0.85rem',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--color-navy)',
                    background: 'white',
                  }}
                />
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 700, fontSize: '1rem' }}>%</span>
                <button
                  type="submit"
                  style={{
                    padding: '0.7rem 1.25rem',
                    background: 'var(--color-teal)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Save size={15} strokeWidth={2.5} /> Save
                </button>
              </div>
            </div>
          </form>

          {/* Current rate info */}
          <div style={{ background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.15)', borderRadius: '0.5rem', padding: '0.9rem 1rem', display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
            <Info size={15} color="var(--color-teal)" strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--color-teal)' }}>Current rate: {currentRate}%</strong>
              {' '}— on a $65/night room for 2 nights, tax would be{' '}
              <strong>${((65 * 2) * (currentRate / 100)).toFixed(2)}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
