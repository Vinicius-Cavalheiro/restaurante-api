-- AlterTable
ALTER TABLE `pedidos` MODIFY `canal` ENUM('BALCAO', 'APP', 'DELIVERY', 'TOTEM', 'PICKUP', 'WEB') NOT NULL;
