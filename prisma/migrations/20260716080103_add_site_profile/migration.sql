-- CreateTable
CREATE TABLE `site_profile` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `description` TEXT NOT NULL,
    `vision` TEXT NOT NULL,
    `mission` LONGTEXT NOT NULL,
    `values` TEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
