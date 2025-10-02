/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `shift_assignments` DROP FOREIGN KEY `shift_assignments_user_id_fkey`;

-- DropIndex
DROP INDEX `refresh_tokens_user_id_fkey` ON `refresh_tokens`;

-- DropIndex
DROP INDEX `shift_assignments_user_id_fkey` ON `shift_assignments`;

-- AlterTable
ALTER TABLE `refresh_tokens` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `shift_assignments` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shift_assignments` ADD CONSTRAINT `shift_assignments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
