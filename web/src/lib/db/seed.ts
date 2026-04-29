/**
 * Run with:  npx tsx src/lib/db/seed.ts
 *
 * Drops and re-creates all rows — safe to run multiple times.
 */
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';
import { rooms, pricingRules, taxConfig, adminUsers, adminOtpTokens } from './schema';

const DB_PATH = path.join(process.cwd(), 'local.db');
const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

const db = drizzle(sqlite);

// ── 1. Run migrations ────────────────────────────────────
migrate(db, { migrationsFolder: './drizzle' });
console.log('✓ Migrations applied');

// ── 2. Clear existing seed data ──────────────────────────
db.delete(pricingRules).run();
db.delete(rooms).run();
db.delete(taxConfig).run();
db.delete(adminUsers).run();
db.delete(adminOtpTokens).run();
console.log('✓ Cleared existing data');

// ── 3. Tax config ────────────────────────────────────────
db.insert(taxConfig).values({
  label: 'NJ Hotel / Motel Tax',
  ratePercent: 13.63,
}).run();
console.log('✓ Tax config inserted');

// ── Helper ───────────────────────────────────────────────
const STANDARD_AMENITIES = JSON.stringify([
  'Free Wi-Fi',
  'Air Conditioning',
  'Flat-Screen TV',
  'Mini Fridge',
  'On-Site Parking ($10/day)',
  'Daily Housekeeping',
]);

const DELUXE_AMENITIES = JSON.stringify([
  'Free Wi-Fi',
  'Air Conditioning',
  'Flat-Screen TV',
  'Mini Fridge',
  'On-Site Parking ($10/day)',
  'Daily Housekeeping',
  'Work Desk',
  'Blackout Curtains',
]);

const SUITE_AMENITIES = JSON.stringify([
  'Free Wi-Fi',
  'Air Conditioning',
  'Flat-Screen TV',
  'Mini Fridge',
  'On-Site Parking ($10/day)',
  'Daily Housekeeping',
  'Jacuzzi Tub',
  'Sitting Area',
  'Premium Toiletries',
  'Bathrobe & Slippers',
  'Blackout Curtains',
]);

// ── 4. Rooms ─────────────────────────────────────────────
//  7 Non-smoking King  → rooms 101–107
//  4 Non-smoking Queen → rooms 201–204
//  9 Non-smoking Double → rooms 301–309
//  1 Suite w/ Jacuzzi  → room 401

const roomsData = [
  // ── King Rooms (101–107) ──
  ...Array.from({ length: 7 }, (_, i) => ({
    roomNumber: `10${i + 1}`,
    type: 'king' as const,
    name: 'King Room',
    description: 'Spacious non-smoking room with a plush king-size bed, modern furnishings, and all the comforts of home. Perfect for couples or solo travelers looking for extra room.',
    maxGuests: 2,
    beds: '1 King Bed',
    isSmoking: false,
    hasJacuzzi: false,
    basePricePerNight: 65.00,
    isActive: true,
    imageKey: 'king',
    amenities: STANDARD_AMENITIES,
    floor: 1,
  })),

  // ── Queen Rooms (201–204) ──
  ...Array.from({ length: 4 }, (_, i) => ({
    roomNumber: `20${i + 1}`,
    type: 'queen' as const,
    name: 'Queen Room',
    description: 'Comfortable non-smoking room with a queen-size bed. Great for solo travelers, couples, or those on a business trip who want quality at a great price.',
    maxGuests: 2,
    beds: '1 Queen Bed',
    isSmoking: false,
    hasJacuzzi: false,
    basePricePerNight: 65.00,
    isActive: true,
    imageKey: 'queen',
    amenities: STANDARD_AMENITIES,
    floor: 2,
  })),

  // ── Double Rooms (301–309) ──
  ...Array.from({ length: 9 }, (_, i) => ({
    roomNumber: `30${i + 1}`,
    type: 'double' as const,
    name: 'Double Room',
    description: 'Non-smoking room with two double beds — ideal for families or small groups traveling together. Comfortable, clean, and great value steps from the beach.',
    maxGuests: 4,
    beds: '2 Double Beds',
    isSmoking: false,
    hasJacuzzi: false,
    basePricePerNight: 65.00,
    isActive: true,
    imageKey: 'double',
    amenities: DELUXE_AMENITIES,
    floor: 3,
  })),

  // ── Suite (401) ──
  {
    roomNumber: '401',
    type: 'suite' as const,
    name: 'Jacuzzi Suite',
    description: 'Our premium suite featuring a private in-room Jacuzzi tub, a separate sitting area, and upscale finishes throughout. Perfect for anniversaries, honeymoons, or a special weekend getaway.',
    maxGuests: 2,
    beds: '1 King Bed + Jacuzzi',
    isSmoking: false,
    hasJacuzzi: true,
    basePricePerNight: 65.00,
    isActive: true,
    imageKey: 'suite',
    amenities: SUITE_AMENITIES,
    floor: 4,
  },
];

db.insert(rooms).values(roomsData).run();
console.log(`✓ ${roomsData.length} rooms inserted`);

// ── 5. Admin user — phone-based OTP login ────────────────
// Change this phone number to the owner's real number before going to production.
// Must be in E.164 format: +1XXXXXXXXXX
db.insert(adminUsers).values([
  { name: 'Owner', phone: '+16093489111', email: 'downbeach3601@gmail.com', role: 'owner' },
  { name: 'Admin', phone: '+16095768309', email: 'REPLACE_WITH_SECOND_ADMIN_EMAIL',  role: 'owner' },
]).run();
console.log('✓ Admin users inserted');

console.log('\n✅ Seed complete. Database ready at local.db');
sqlite.close();
