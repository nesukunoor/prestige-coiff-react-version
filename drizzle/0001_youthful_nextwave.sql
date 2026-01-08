CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int,
	`customerName` varchar(100) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(20) NOT NULL,
	`serviceId` int NOT NULL,
	`serviceName` varchar(255) NOT NULL,
	`appointmentDate` datetime NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`month` int NOT NULL,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20) NOT NULL,
	`address` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`subject` varchar(255),
	`message` text NOT NULL,
	`status` enum('unread','read','replied') NOT NULL DEFAULT 'unread',
	`createdAt` timestamp DEFAULT (now()),
	`month` int NOT NULL,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('order','appointment','message','stock','system') NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`relatedId` int,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	`price` int NOT NULL,
	`totalPrice` int NOT NULL,
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderCode` varchar(20) NOT NULL,
	`customerId` int NOT NULL,
	`customerName` varchar(100) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(20) NOT NULL,
	`customerAddress` text NOT NULL,
	`totalAmount` int NOT NULL,
	`status` enum('pending','confirmed','shipped','delivered','cancelled','returned') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50) NOT NULL DEFAULT 'cash',
	`paymentStatus` enum('pending','paid','refunded') NOT NULL DEFAULT 'pending',
	`shippedAt` datetime,
	`deliveredAt` datetime,
	`createdAt` timestamp DEFAULT (now()),
	`month` int NOT NULL,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderCode_unique` UNIQUE(`orderCode`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`category` varchar(100) NOT NULL,
	`imageUrl` varchar(500),
	`stock` int NOT NULL DEFAULT 0,
	`inStock` boolean NOT NULL DEFAULT true,
	`featured` boolean NOT NULL DEFAULT false,
	`promotionPrice` int,
	`promotionActive` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revenue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int,
	`amount` int NOT NULL,
	`type` enum('order','adjustment') NOT NULL DEFAULT 'order',
	`description` text,
	`month` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `revenue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`duration` int NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
