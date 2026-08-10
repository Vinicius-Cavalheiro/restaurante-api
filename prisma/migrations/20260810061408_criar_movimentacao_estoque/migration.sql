-- CreateTable
CREATE TABLE `movimentacoes_estoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unidadeId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `tipo` ENUM('ENTRADA', 'SAIDA') NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `movimentacoes_estoque_unidadeId_idx`(`unidadeId`),
    INDEX `movimentacoes_estoque_produtoId_idx`(`produtoId`),
    INDEX `movimentacoes_estoque_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `movimentacoes_estoque` ADD CONSTRAINT `movimentacoes_estoque_unidadeId_fkey` FOREIGN KEY (`unidadeId`) REFERENCES `unidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movimentacoes_estoque` ADD CONSTRAINT `movimentacoes_estoque_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movimentacoes_estoque` ADD CONSTRAINT `movimentacoes_estoque_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
