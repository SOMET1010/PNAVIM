CREATE TABLE `domains` (
	`id` int AUTO_INCREMENT NOT NULL,
	`domaine` varchar(200) NOT NULL,
	`actif` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `domains_id` PRIMARY KEY(`id`),
	CONSTRAINT `domains_domaine_unique` UNIQUE(`domaine`)
);
--> statement-breakpoint
CREATE TABLE `logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(200) NOT NULL,
	`details` text,
	`ipAddress` varchar(45),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `otp_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`code` varchar(6) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`used` boolean NOT NULL DEFAULT false,
	`attempts` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `otp_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','superadmin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `prenom` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `nom` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `fonction` varchar(200);--> statement-breakpoint
ALTER TABLE `users` ADD `direction` varchar(200);--> statement-breakpoint
ALTER TABLE `users` ADD `organisation` varchar(200);--> statement-breakpoint
ALTER TABLE `users` ADD `telephone` varchar(30);--> statement-breakpoint
ALTER TABLE `users` ADD `telephoneFixe` varchar(30);--> statement-breakpoint
ALTER TABLE `users` ADD `adresse` text;--> statement-breakpoint
ALTER TABLE `users` ADD `siteWeb` varchar(300);--> statement-breakpoint
ALTER TABLE `users` ADD `photoUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `cardStatus` enum('active','inactive','pending') DEFAULT 'pending' NOT NULL;