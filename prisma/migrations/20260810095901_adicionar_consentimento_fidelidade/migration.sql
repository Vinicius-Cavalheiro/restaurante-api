-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `consentimentoFidelidadeEm` DATETIME(3) NULL,
    ADD COLUMN `fidelidadeAtiva` BOOLEAN NOT NULL DEFAULT false;
