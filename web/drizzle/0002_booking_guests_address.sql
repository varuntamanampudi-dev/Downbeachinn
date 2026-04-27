ALTER TABLE `bookings` ADD COLUMN `adults` integer NOT NULL DEFAULT 2;
--> statement-breakpoint
ALTER TABLE `bookings` ADD COLUMN `children` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `bookings` ADD COLUMN `extra_adult_fee` real NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `bookings` ADD COLUMN `guest_address` text;
--> statement-breakpoint
ALTER TABLE `bookings` ADD COLUMN `guest_city` text;
--> statement-breakpoint
ALTER TABLE `bookings` ADD COLUMN `guest_state` text;
--> statement-breakpoint
ALTER TABLE `bookings` ADD COLUMN `guest_zip` text;
--> statement-breakpoint
ALTER TABLE `admin_users` ADD COLUMN `email` text;
