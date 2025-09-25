/*
  Warnings:

  - You are about to drop the column `user_id` on the `attendance_logs` table. All the data in the column will be lost.
  - The values [early] on the enum `attendance_logs_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `refresh` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shift_assignment_id` to the `attendance_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendance_logs` DROP FOREIGN KEY `attendance_logs_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_user_id_fkey`;

-- DropIndex
DROP INDEX `attendance_logs_user_id_fkey` ON `attendance_logs`;

-- DropIndex
DROP INDEX `refresh_tokens_refresh_key` ON `refresh_tokens`;

-- DropIndex
DROP INDEX `refresh_tokens_user_id_fkey` ON `refresh_tokens`;

-- AlterTable
ALTER TABLE `attendance_logs` DROP COLUMN `user_id`,
    ADD COLUMN `shift_assignment_id` INTEGER NOT NULL,
    MODIFY `status` ENUM('ontime', 'early_leave', 'late_checkout', 'missing', 'late') NOT NULL;

-- AlterTable
ALTER TABLE `refresh_tokens` DROP COLUMN `refresh`,
    ADD COLUMN `token` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shift_start` TIME NOT NULL,
    `shift_end` TIME NOT NULL,
    `cross_day` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shift_assignments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shift_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `shift_start` DATETIME(3) NOT NULL,
    `shift_end` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_summary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shift_assignment_id` INTEGER NOT NULL,
    `checkin_time` DATETIME(3) NOT NULL,
    `checkout_time` DATETIME(3) NULL,
    `checkin_status` ENUM('late', 'ontime', 'early_leave', 'late_checkout', 'missing') NOT NULL,
    `checkout_status` ENUM('late', 'ontime', 'early_leave', 'late_checkout', 'missing') NULL,
    `summary_status` ENUM('present', 'absent', 'half_day', 'missing_checkout') NOT NULL,
    `work_duration` INTEGER NULL,
    `late_duration` INTEGER NULL,
    `overtime_duration` INTEGER NULL,
    `early_leave_duration` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `daily_summary_shift_assignment_id_key`(`shift_assignment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `refresh_tokens_token_key` ON `refresh_tokens`(`token`);

-- AddForeignKey
ALTER TABLE `attendance_logs` ADD CONSTRAINT `attendance_logs_shift_assignment_id_fkey` FOREIGN KEY (`shift_assignment_id`) REFERENCES `shift_assignments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shift_assignments` ADD CONSTRAINT `shift_assignments_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `Shift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shift_assignments` ADD CONSTRAINT `shift_assignments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_summary` ADD CONSTRAINT `daily_summary_shift_assignment_id_fkey` FOREIGN KEY (`shift_assignment_id`) REFERENCES `shift_assignments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
