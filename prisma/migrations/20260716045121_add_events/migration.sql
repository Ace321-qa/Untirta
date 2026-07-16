-- CreateTable
CREATE TABLE `events` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `featuredImage` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NULL,
    `venue` VARCHAR(191) NULL,
    `mapsUrl` VARCHAR(191) NULL,
    `organizer` VARCHAR(191) NULL,
    `registrationLink` VARCHAR(191) NULL,
    `registrationDeadline` DATETIME(3) NULL,
    `participantQuota` INTEGER NULL,
    `documentUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `events_slug_key`(`slug`),
    INDEX `events_status_startAt_idx`(`status`, `startAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
