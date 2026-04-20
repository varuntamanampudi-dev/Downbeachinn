# Motel Booking Website Development Plan

This document outlines the phased plan to build a complete booking website for a 24-room motel. The system will feature a premium, dynamic guest-facing frontend and a secure admin dashboard for the owner to manage room availability, prices, and bookings. The development is designed to be low-cost, ultimately targeting deployment on AWS Lightsail, and will be built and tested locally phase by phase.


## Proposed Technology Stack

- **Frontend/Backend:** Next.js (React)
  - *Why:* Next.js allows us to build both the beautiful user interface and the backend API routes in a single codebase. It also provides excellent SEO right out of the box, which is vital for a motel website to attract organic traffic.
- **Styling:** Vanilla CSS (CSS Modules)
  - *Why:* Provides maximum flexibility to create a premium, dynamic, and unique aesthetic without being tied to a framework's default look.
- **Database:** PostgreSQL or SQLite
  - *Why:* For a 24-room motel, a relational database is perfect for handling bookings without overlaps. SQLite can be exceptionally cheap (free, just a file on the server), but PostgreSQL is more robust. We can run PostgreSQL directly on the AWS Lightsail instance to keep costs minimized.
- **Authentication:** Auth.js (NextAuth) or simple JWT-based auth
  - *Why:* Secure and straightforward way to protect the admin dashboard.
- **Hosting:** AWS Lightsail
  - *Why:* Predictable, low monthly pricing that is perfect for small businesses.

---

## Development Phases

We will execute this project in the following phases. At the end of each phase, we will spin up the local development server (`localhost`) so you can test, review, and request changes before we move forward.

### Phase 1: Foundation & Guest User Interface (UI)
**Goal:** Build the visual shell of the website that guests will see.
- Setup a new Next.js project with our vanilla CSS architecture.
- Design a premium, highly aesthetic landing page to "wow" visitors (hero section, room previews, amenities). Integrated with user-provided photos.
- Create the "Rooms & Rates" page.
- Create the initial UI for the booking flow (date selection, guest count).
- *Local Checkpoint:* Verify the design, animations, and responsive layout on mobile/desktop.

### Phase 2: Database Design & Backend Setup
**Goal:** Set up the data structure and connect the application to the database.
- Define database schemas for `Rooms`, `Bookings`, `Pricing Rules`, and `Users` (Admin).
- Set up a local development database.
- Build internal API routes to fetch real room availability and prices from the database.
- Integrate the frontend from Phase 1 with the database so the rooms display real data instead of mock placeholders.
- *Local Checkpoint:* Verify that data changes in the database reflect on the local website correctly.

### Phase 3: Admin Dashboard & Authentication
**Goal:** Build the secure area for the business owner to manage prices, availability, and bookings.

#### 3a — Authentication
- Create the login page at `/admin/login` (username + password form).
- Implement a server action that validates credentials against the `admin_users` table (bcrypt password hash comparison).
- Issue a signed HTTP-only JWT cookie on success (`jose` or `jsonwebtoken`).
- Create a Next.js middleware (`middleware.ts`) that protects all `/admin/*` routes by verifying the JWT cookie — unauthenticated requests redirect to `/admin/login`.
- Add a logout route (`/admin/logout`) that clears the cookie.
- Seed the database with one `owner` account for local testing.

#### 3b — Dashboard Layout & Overview
- Create a persistent admin shell layout (`/admin/layout.tsx`) with a sidebar: Overview, Rooms, Pricing, Bookings, Settings.
- Build the Overview page (`/admin`) showing: today's occupancy (X/24 rooms booked), tonight's check-ins, upcoming check-outs, and a 7-day revenue summary — all pulled live from the `bookings` table.

#### 3c — Room Management
- Build the Rooms page (`/admin/rooms`) listing all 24 rooms with their current base price and active/inactive status.
- Add an inline edit form per room to update `base_price_per_night` and toggle `is_active` (removes the room from the guest-facing booking form).
- Wire server actions for `UPDATE rooms SET ...` with immediate revalidation.

#### 3d — Pricing Rules Management
- Build the Pricing page (`/admin/pricing`) showing all active `pricing_rules` rows in a table (label, date range, applies-to, price/night).
- Add a "New Rule" form to create date-range overrides: choose applies-to (`all`, room type, or a specific room), set start/end dates and the override price, and give it a label (e.g. "July 4th Weekend").
- Add delete/deactivate per rule.
- Display a live preview showing what price a guest would see for each room type on a given date (calls `getEffectivePrice`).

#### 3e — Tax Configuration
- Add a Settings page (`/admin/settings`) with a single editable field: the NJ hotel/motel tax rate backed by the `tax_config` table row.
- Changing this value takes effect immediately on the guest-facing booking form and all future price calculations (no redeploy needed).

- *Local Checkpoint:* Log in as admin. Create a pricing rule for this weekend and verify that the nightly price shown in the guest-facing booking form updates. Toggle a room inactive and confirm it disappears from the room selector. Change the tax rate and confirm the booking form reflects the new total.

### Phase 4: The Booking Engine
**Goal:** Wire the existing booking form UI to a real backend — availability checks, payment, confirmation, and admin booking management.

> **Current state entering Phase 4:** The 3-step `BookingForm` UI exists and collects all guest data. The "Confirm Booking" button currently shows an alert placeholder. The `bookings` table schema and `confirmation_code` field are already defined. Nothing is persisted yet.

#### 4a — Availability API
- Build `POST /api/availability` that accepts `{ roomId, checkIn, checkOut }` and queries the `bookings` table for any `confirmed` or `pending` booking on that room whose date range overlaps the requested range.
- Returns `{ available: boolean, conflictingDates?: string[] }`.
- Call this from `BookingForm` when the user reaches Step 3 (Review) to show a real-time availability check before they pay.
- Update `getRoomTypes()` query to accept optional check-in/check-out dates and filter out fully-booked room types so unavailable options never appear in the room selector.

#### 4b — Shift4 Payment Integration
- Create a Shift4 merchant account and obtain API keys (test + live).
- Store keys in environment variables: `SHIFT4_SECRET_KEY`, `SHIFT4_PUBLISHABLE_KEY`.
- Build `POST /api/checkout` (server-side): receives booking form data, calls Shift4's Charges API to create a charge, and on success inserts a row into the `bookings` table with `status = 'confirmed'` and a generated `confirmation_code` (e.g. `DB-XXXXXXXX`).
- The confirmation code is generated as `DB-` + 8 random uppercase alphanumeric characters and must be unique (retry on collision).
- Handle Shift4 errors: card declined → return 402 with a user-friendly message; network failure → return 503 and do not insert a booking row.
- Add the Shift4.js client-side script to `BookingForm` to tokenize the card number before it ever touches our server (PCI compliance).
- Replace the alert placeholder in `BookingForm` Step 3 with a real card input widget and a call to `POST /api/checkout`.

#### 4c — Confirmation Page
- On successful payment, redirect the guest to `/booking/confirmation?code=DB-XXXXXXXX`.
- Build this page to display: confirmation code, room name, check-in/check-out dates, guest name, itemized price breakdown (subtotal + tax + total), and motel contact info.
- Add a "Print / Save" button using `window.print()`.

#### 4d — Admin Booking Management
- Add a Bookings page (`/admin/bookings`) showing all bookings in a table: confirmation code, guest name, room, dates, total, status.
- Filter tabs: Upcoming / Today / All / Cancelled.
- Allow admin to manually transition status: `confirmed → checked_in → checked_out` and `confirmed → cancelled` (with a cancellation reason field).
- Cancellations do not automatically process refunds (owner handles refunds directly through the Shift4 dashboard) — but the booking row is marked `cancelled` so the room opens back up for new reservations.

- *Local Checkpoint:* Use Shift4 test card numbers to complete a full end-to-end booking. Verify the confirmation page loads with the correct code. Attempt to book the same room for the same dates a second time and confirm the system rejects it with an "unavailable" message. In the admin dashboard, find the booking and mark it as checked in.

### Phase 5: Polish & AWS Lightsail Deployment
**Goal:** Prepare for production and go live.
- Final SEO optimizations (meta tags, sitemaps).
- Performance audits and bug crushing.
- Provision the AWS Lightsail instance (Node.js + Database blueprint).
- Deploy the code to the Lightsail server.
- Connect the production domain name.
- *Final Checkpoint:* Verify the live site operates perfectly in the real world.

