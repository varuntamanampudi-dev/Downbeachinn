/**
 * Server-only room queries — all DB access for the rooms feature lives here.
 * These are called from Server Components and Server Actions only.
 */
import { db } from '@/lib/db/client';
import { rooms, pricingRules, taxConfig } from '@/lib/db/schema';
import { eq, and, lte, gte, isNull, or } from 'drizzle-orm';
import type { Room } from './types';

// ── Type from DB row → shared Room type ──────────────────
function dbRowToRoom(row: typeof rooms.$inferSelect): Room {
  return {
    id: row.id,
    roomNumber: row.roomNumber,
    type: row.type,
    name: row.name,
    description: row.description,
    maxGuests: row.maxGuests,
    beds: row.beds,
    isSmoking: row.isSmoking,
    hasJacuzzi: row.hasJacuzzi,
    basePricePerNight: row.basePricePerNight,
    isActive: row.isActive,
    imageKey: row.imageKey ?? null,
    amenities: (() => { try { return JSON.parse(row.amenities) as string[]; } catch { return []; } })(),
    floor: row.floor,
    // imagePlaceholderGradient only used as fallback
    imagePlaceholderGradient: GRADIENTS[row.type] ?? GRADIENTS.king,
  };
}

const GRADIENTS: Record<string, string> = {
  king:   'linear-gradient(135deg, #bae6fd 0%, #e0f2fe 100%)',
  queen:  'linear-gradient(135deg, #7dd3fc 0%, #bae6fd 100%)',
  double: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)',
  suite:  'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
};

// ── Queries ───────────────────────────────────────────────

/** Returns all active rooms grouped by type (one representative per type). */
export async function getRoomTypes(): Promise<Room[]> {
  const rows = await db.select().from(rooms).where(eq(rooms.isActive, true));
  // De-duplicate by type — return one room per type (for display cards)
  const seen = new Set<string>();
  const unique: Room[] = [];
  for (const row of rows) {
    if (!seen.has(row.type)) {
      seen.add(row.type);
      unique.push(dbRowToRoom(row));
    }
  }
  return unique;
}

/** Returns all active rooms (every physical room). */
export async function getAllRooms(): Promise<Room[]> {
  const rows = await db.select().from(rooms).where(eq(rooms.isActive, true));
  return rows.map(dbRowToRoom);
}

/** Returns a single room by id. */
export async function getRoomById(id: number): Promise<Room | null> {
  const rows = await db.select().from(rooms).where(eq(rooms.id, id));
  return rows[0] ? dbRowToRoom(rows[0]) : null;
}

/**
 * Resolves the effective price for a room type on a given date.
 * Priority: room-level override > type-level override > 'all' override > base price.
 */
export async function getEffectivePrice(
  roomId: number,
  roomType: string,
  date: string // "YYYY-MM-DD"
): Promise<number> {
  const rules = await db
    .select()
    .from(pricingRules)
    .where(
      and(
        eq(pricingRules.isActive, true),
        lte(pricingRules.startDate, date),
        gte(pricingRules.endDate, date),
        or(
          eq(pricingRules.appliesTo, 'all'),
          eq(pricingRules.appliesTo, roomType as 'king' | 'queen' | 'double' | 'suite'),
          and(eq(pricingRules.appliesTo, 'room'), eq(pricingRules.roomId!, roomId))
        )
      )
    );

  if (rules.length === 0) {
    // No override — return base price from room
    const row = await db.select({ base: rooms.basePricePerNight }).from(rooms).where(eq(rooms.id, roomId));
    return row[0]?.base ?? 65.00;
  }

  // Most specific rule wins
  const roomRule = rules.find((r) => r.appliesTo === 'room');
  if (roomRule) return roomRule.pricePerNight;
  const typeRule = rules.find((r) => r.appliesTo === roomType);
  if (typeRule) return typeRule.pricePerNight;
  return rules[0].pricePerNight;
}

/** Returns the current tax rate from DB. */
export async function getTaxRate(): Promise<number> {
  const rows = await db.select().from(taxConfig);
  return rows[0]?.ratePercent ?? 13.63;
}

/** Returns all active pricing rules (for admin dashboard). */
export async function getAllPricingRules() {
  return db.select().from(pricingRules).where(eq(pricingRules.isActive, true));
}
