-- Rebuild admin_users with phone-based auth (drop old username/password columns)
PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `admin_users_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`role` text DEFAULT 'staff' NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
INSERT INTO `admin_users_new` (`id`, `name`, `phone`, `role`, `created_at`)
  SELECT `id`, `username`, '', `role`, `created_at` FROM `admin_users`;
--> statement-breakpoint
DROP TABLE `admin_users`;
--> statement-breakpoint
ALTER TABLE `admin_users_new` RENAME TO `admin_users`;
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_phone_unique` ON `admin_users` (`phone`);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- OTP tokens table for phone-based login
CREATE TABLE `admin_otp_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phone` text NOT NULL,
	`code` text NOT NULL,
	`expires_at` text NOT NULL,
	`used` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
