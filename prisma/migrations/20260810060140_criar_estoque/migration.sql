-- CreateTable
CREATE TABLE `estoques` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unidadeId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `estoques_unidadeId_idx`(`unidadeId`),
    INDEX `estoques_produtoId_idx`(`produtoId`),
    UNIQUE INDEX `estoques_unidadeId_produtoId_key`(`unidadeId`, `produtoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `estoques` ADD CONSTRAINT `estoques_unidadeId_fkey` FOREIGN KEY (`unidadeId`) REFERENCES `unidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoques` ADD CONSTRAINT `estoques_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
