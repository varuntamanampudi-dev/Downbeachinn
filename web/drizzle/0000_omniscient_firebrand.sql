CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'staff' NOT NULL,
	`created_at` text DEFAULT 'strftime(''%Y-%m-%dT%H:%M:%fZ'', ''now'')' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_username_unique` ON `admin_users` (`username`);--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`confirmation_code` text NOT NULL,
	`room_id` integer NOT NULL,
	`guest_first_name` text NOT NULL,
	`guest_last_name` text NOT NULL,
	`guest_email` text NOT NULL,
	`guest_phone` text,
	`check_in` text NOT NULL,
	`check_out` text NOT NULL,
	`nights` integer NOT NULL,
	`guests` integer DEFAULT 1 NOT NULL,
	`price_per_night` real NOT NULL,
	`subtotal` real NOT NULL,
	`tax_amount` real NOT NULL,
	`total` real NOT NULL,
	`special_requests` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT 'strftime(''%Y-%m-%dT%H:%M:%fZ'', ''now'')' NOT NULL,
	`updated_at` text DEFAULT 'strftime(''%Y-%m-%dT%H:%M:%fZ'', ''now'')' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_confirmation_code_unique` ON `bookings` (`confirmation_code`);--> statement-breakpoint
CREATE TABLE `pricing_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`applies_to` text DEFAULT 'all' NOT NULL,
	`room_id` integer,
	`price_per_night` real NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT 'strftime(''%Y-%m-%dT%H:%M:%fZ'', ''now'')' NOT NULL,
	`updated_at` text DEFAULT 'strftime(''%Y-%m-%dT%H:%M:%fZ'', ''now'')' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_number` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`max_guests` integer NOT NULL,
	`beds` text NOT NULL,
	`is_smoking` integer DEFAULT false NOT NULL,
	`has_jacuzzi` integer DEFAULT false NOT NULL,
	`base_price_per_night` real DEFAULT 65 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`image_key` text,
	`amenities` text NOT NULL,
	`floor` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT 'strftime(''%Y-%m-%dT%H:%M:%fZ'', ''now'')' NOT NULL,
	`updated_at` text DEFAULT 'strftime(''%Y-%m-%dT%H:%M:%fZ'', ''now'')' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_room_number_unique` ON `rooms` (`room_number`);--> statement-breakpoint
CREATE TABLE `tax_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text DEFAULT 'NJ Hotel Tax' NOT NULL,
	`rate_percent` real DEFAULT 13.63 NOT NULL,
	`updated_at` text DEFAULT 'strftime(''%Y-%m-%dT%H:%M:%fZ'', ''now'')' NOT NULL
);
