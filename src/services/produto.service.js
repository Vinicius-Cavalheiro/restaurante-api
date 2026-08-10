import { prisma } from "../config/prisma.js";
export async function criarProduto(dados) {
    return prisma.produto.create({
        data: dados,
    });
}
export async function listarProdutos() {
    return prisma.produto.findMany({
        orderBy: {
            nome: "asc",
        },
    });
}
export async function buscarProdutoPorId(id) {
    return prisma.produto.findUnique({
        where: { id },
    });
}
export async function buscarProdutoPorSku(sku) {
    return prisma.produto.findUnique({
        where: { sku },
    });
}
export async function atualizarProduto(id, dados) {
    return prisma.produto.update({
        where: { id },
        data: dados,
    });
}
export async function excluirProduto(id) {
    return prisma.produto.delete({
        where: { id },
    });
}
//# sourceMappingURL=produto.service.js.map