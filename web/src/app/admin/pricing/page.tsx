import { db } from '@/lib/db/client';
import { pricingRules } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function createRule(formData: FormData) {
  'use server';
  const label         = (formData.get('label')        as string).trim();
  const appliesTo     =  formData.get('appliesTo')    as 'all' | 'king' | 'queen' | 'double' | 'suite';
  const pricePerNight = parseFloat(formData.get('pricePerNight') as string);
  const startDate     = (formData.get('startDate')    as string).trim();
  const endDate       = (formData.get('endDate')      as string).trim();
  if (!label || isNaN(pricePerNight) || !startDate || !endDate) return;
  await db.insert(pricingRules).values({ label, appliesTo, pricePerNight, startDate, endDate, isActive: true });
  revalidatePath('/admin/pricing');
  revalidatePath('/book');
  revalidatePath('/rooms');
}

async function deleteRule(formData: FormData) {
  'use server';
  const id = Number(formData.get('id'));
  await db.update(pricingRules).set({ isActive: false }).where(eq(pricingRules.id, id));
  revalidatePath('/admin/pricing');
  revalidatePath('/book');
  revalidatePath('/rooms');
}

const APPLIES_LABELS: Record<string, string> = {
  all: 'All Rooms', king: 'King Rooms', queen: 'Queen Rooms', double: 'Double Rooms', suite: 'Suites',
};

const label: React.CSSProperties = {
  display: 'block', fontSize: '0.72rem', fontWeight: 700,
  color: 'var(--color-text-muted)', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase',
};
const input: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.75rem',
  border: '1.5px solid #e2e8f0', borderRadius: '0.5rem',
  fontSize: '0.875rem', color: 'var(--color-navy)', background: 'white', boxSizing: 'border-box',
};

export default async function AdminPricingPage() {
  const rules = await db
    .select()
    .from(pricingRules)
    .where(eq(pricingRules.isActive, true))
    .orderBy(pricingRules.startDate);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Pricing Rules</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Date-range price overrides. The most specific rule wins. Changes apply instantly.
        </p>
      </div>

      {/* New rule form */}
      <div style={{ background: 'white', borderRadius: '0.875rem', border: '1px solid #e2e8f0', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 1px 4px rgba(13,27,42,0.06)' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Add New Rule</h2>
        <form action={createRule}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={label}>Label</label>
              <input name="label" type="text" placeholder="July 4th Weekend" required style={input} />
            </div>
            <div>
              <label style={label}>Applies To</label>
              <select name="appliesTo" style={input} defaultValue="all">
                {Object.entries(APPLIES_LABELS).map(([val, lbl]) => (
                  <option key={val} value={val}>{lbl}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={label}>Price / Night ($)</label>
              <input name="pricePerNight" type="number" min="0" step="0.01" placeholder="95.00" required style={input} />
            </div>
            <div>
              <label style={label}>Start Date</label>
              <input name="startDate" type="date" min={today} required style={input} />
            </div>
            <div>
              <label style={label}>End Date</label>
              <input name="endDate" type="date" min={today} required style={input} />
            </div>
          </div>
          <button type="submit" style={{ padding: '0.6rem 1.4rem', background: 'var(--color-teal)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} strokeWidth={2.5} /> Add Rule
          </button>
        </form>
      </div>

      {/* Rules table */}
      <div style={{ background: 'white', borderRadius: '0.875rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(13,27,42,0.06)' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-navy)' }}>Active Rules</h2>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', background: '#f1f5f9', borderRadius: '999px', padding: '0.2rem 0.65rem' }}>{rules.length}</span>
        </div>

        {rules.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            <AlertCircle size={28} color="#cbd5e1" strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 0.75rem' }} />
            No pricing rules yet. Base prices from the Rooms page apply.
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 110px 100px 100px 60px', gap: '1rem', padding: '0.55rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Label</span>
              <span>Applies To</span>
              <span>Price / Night</span>
              <span>Start</span>
              <span>End</span>
              <span></span>
            </div>

            {rules.map((rule, idx) => {
              const isExpired = rule.endDate < today;
              return (
                <div key={rule.id} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 110px 100px 100px 60px', gap: '1rem', padding: '0.85rem 1.25rem', alignItems: 'center', borderBottom: idx < rules.length - 1 ? '1px solid #f1f5f9' : 'none', opacity: isExpired ? 0.5 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)' }}>{rule.label}</span>
                    {isExpired && <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '0.1rem 0.45rem', borderRadius: '999px' }}>Expired</span>}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{APPLIES_LABELS[rule.appliesTo] ?? rule.appliesTo}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-teal)' }}>${rule.pricePerNight.toFixed(2)}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{rule.startDate}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{rule.endDate}</span>
                  <form action={deleteRule}>
                    <input type="hidden" name="id" value={rule.id} />
                    <button type="submit" title="Remove rule" style={{ padding: '0.4rem', background: 'transparent', color: '#94a3b8', border: 'none', borderRadius: '0.35rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={15} strokeWidth={2} />
                    </button>
                  </form>
                </div>
              );
            })}
          </>
        )}
      </div>

      <p style={{ marginTop: '0.9rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        Priority order: room-specific &gt; room-type &gt; "All rooms" &gt; base price. Removing a rule restores the base price immediately.
      </p>
    </div>
  );
}
