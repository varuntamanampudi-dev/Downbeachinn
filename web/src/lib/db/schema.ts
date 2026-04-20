import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// ── Rooms ────────────────────────────────────────────────
export const rooms = sqliteTable('rooms', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  roomNumber:   text('room_number').notNull().unique(),   // e.g. "101"
  type:         text('type', { enum: ['king', 'queen', 'double', 'suite'] }).notNull(),
  name:         text('name').notNull(),                   // display name
  description:  text('description').notNull(),
  maxGuests:    integer('max_guests').notNull(),
  beds:         text('beds').notNull(),                   // e.g. "1 King Bed"
  isSmoking:    integer('is_smoking', { mode: 'boolean' }).notNull().default(false),
  hasJacuzzi:   integer('has_jacuzzi', { mode: 'boolean' }).notNull().default(false),
  basePricePerNight: real('base_price_per_night').notNull().default(65.00),
  isActive:     integer('is_active', { mode: 'boolean' }).notNull().default(true),
  imageKey:     text('image_key'),                        // e.g. "king" → /images/rooms/king.jpg
  amenities:    text('amenities').notNull(),              // JSON array stored as text
  floor:        integer('floor').notNull().default(1),
  createdAt:    text('created_at').notNull().default("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"),
  updatedAt:    text('updated_at').notNull().default("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"),
});

// ── Pricing Rules ─────────────────────────────────────────
// Admin can set date-range price overrides per room type or per specific room.
// Most specific rule wins (room-level > type-level > base).
export const pricingRules = sqliteTable('pricing_rules', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  label:        text('label').notNull(),                  // e.g. "July 4th Weekend"
  appliesTo:    text('applies_to', {
                  enum: ['all', 'king', 'queen', 'double', 'suite', 'room'],
                }).notNull().default('all'),
  roomId:       integer('room_id'),                       // null unless appliesTo = 'room'
  pricePerNight: real('price_per_night').notNull(),
  startDate:    text('start_date').notNull(),             // ISO date "YYYY-MM-DD"
  endDate:      text('end_date').notNull(),               // ISO date "YYYY-MM-DD" (inclusive)
  isActive:     integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt:    text('created_at').notNull().default("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"),
  updatedAt:    text('updated_at').notNull().default("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"),
});

// ── Tax Config ────────────────────────────────────────────
// Single-row config table so admin can update tax rate without a code deploy.
export const taxConfig = sqliteTable('tax_config', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  label:        text('label').notNull().default('NJ Hotel Tax'),
  ratePercent:  real('rate_percent').notNull().default(13.63),
  updatedAt:    text('updated_at').notNull().default("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"),
});

// ── Bookings ──────────────────────────────────────────────
// Full schema ready for Phase 4; referenced here so migrations stay in sync.
export const bookings = sqliteTable('bookings', {
  id:              integer('id').primaryKey({ autoIncrement: true }),
  confirmationCode: text('confirmation_code').notNull().unique(),
  roomId:          integer('room_id').notNull(),
  guestFirstName:  text('guest_first_name').notNull(),
  guestLastName:   text('guest_last_name').notNull(),
  guestEmail:      text('guest_email').notNull(),
  guestPhone:      text('guest_phone'),
  checkIn:         text('check_in').notNull(),             // "YYYY-MM-DD"
  checkOut:        text('check_out').notNull(),            // "YYYY-MM-DD"
  nights:          integer('nights').notNull(),
  guests:          integer('guests').notNull().default(1),
  pricePerNight:   real('price_per_night').notNull(),
  subtotal:        real('subtotal').notNull(),
  taxAmount:       real('tax_amount').notNull(),
  total:           real('total').notNull(),
  specialRequests: text('special_requests'),
  status:          text('status', {
                     enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'],
                   }).notNull().default('pending'),
  createdAt:       text('created_at').notNull().default("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"),
  updatedAt:       text('updated_at').notNull().default("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"),
});

// ── Admin Users ───────────────────────────────────────────
export const adminUsers = sqliteTable('admin_users', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  name:      text('name').notNull(),
  phone:     text('phone').notNull().unique(),           // E.164 format e.g. "+16093489111"
  role:      text('role', { enum: ['owner', 'staff'] }).notNull().default('staff'),
  createdAt: text('created_at').notNull().default("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"),
});

// ── Admin OTP Tokens ──────────────────────────────────────
// Short-lived 6-digit codes used for phone-based login.
export const adminOtpTokens = sqliteTable('admin_otp_tokens', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  phone:     text('phone').notNull(),
  code:      text('code').notNull(),                    // 6-digit string
  expiresAt: text('expires_at').notNull(),              // ISO datetime
  used:      integer('used', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"),
});
