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
**Goal:** Build the secure area for the business owner.
- Implement an exact login page for the administrator.
- Build the Admin Dashboard UI.
- Create tools to manage **Pricing** (e.g., set base prices, weekend spikes).
- Create tools to manage **Availability** (block off a room for maintenance, view upcoming bookings).
- *Local Checkpoint:* Test the admin login and verify that changing a price or blocking a room immediately visually affects the guest-facing website.

### Phase 4: The Booking Engine
**Goal:** Allow guests to actually book rooms safely.
- Finalize the reservation logic (checking for double-bookings).
- Build the checkout/booking form to collect guest information.
- Integrate Shift4 payment processor to securely handle online transactions.
- Implement confirmation screens and booking reference generation.
- *Local Checkpoint:* Perform end-to-end booking tests locally. Try to double-book a room to ensure the system rejects it.

### Phase 5: Polish & AWS Lightsail Deployment
**Goal:** Prepare for production and go live.
- Final SEO optimizations (meta tags, sitemaps).
- Performance audits and bug crushing.
- Provision the AWS Lightsail instance (Node.js + Database blueprint).
- Deploy the code to the Lightsail server.
- Connect the production domain name.
- *Final Checkpoint:* Verify the live site operates perfectly in the real world.

