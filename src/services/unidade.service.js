import { prisma } from "../config/prisma.js";
export async function criarUnidade({ nome, endereco, cidade, }) {
    return prisma.unidade.create({
        data: {
            nome,
            endereco,
            cidade,
        },
    });
}
export async function listarUnidades() {
    return prisma.unidade.findMany({
        orderBy: {
            nome: "asc",
        },
    });
}
export async function buscarUnidadePorId(id) {
    return prisma.unidade.findUnique({
        where: {
            id,
        },
    });
}
export async function atualizarUnidade(id, dados) {
    return prisma.unidade.update({
        where: {
            id,
        },
        data: dados,
    });
}
export async function excluirUnidade(id) {
    return prisma.unidade.delete({
        where: {
            id,
        },
    });
}
//# sourceMappingURL=unidade.service.js.map