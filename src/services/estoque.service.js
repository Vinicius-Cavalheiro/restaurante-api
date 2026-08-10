import { prisma } from "../config/prisma.js";
export async function buscarEstoque(unidadeId, produtoId) {
    return prisma.estoque.findUnique({
        where: {
            unidadeId_produtoId: {
                unidadeId,
                produtoId,
            },
        },
        include: {
            unidade: true,
            produto: true,
        },
    });
}
export async function listarEstoquePorUnidade(unidadeId) {
    return prisma.estoque.findMany({
        where: {
            unidadeId,
        },
        include: {
            produto: true,
        },
        orderBy: {
            produto: {
                nome: "asc",
            },
        },
    });
}
export async function entradaEstoque(unidadeId, produtoId, quantidade, usuarioId) {
    const estoque = await prisma.estoque.upsert({
        where: {
            unidadeId_produtoId: {
                unidadeId,
                produtoId,
            },
        },
        create: {
            unidadeId,
            produtoId,
            quantidade,
        },
        update: {
            quantidade: {
                increment: quantidade,
            },
        },
        include: {
            unidade: true,
            produto: true,
        },
    });
    await prisma.movimentacaoEstoque.create({
        data: {
            unidadeId,
            produtoId,
            usuarioId,
            tipo: "ENTRADA",
            quantidade,
        },
    });
    return estoque;
}
export async function saidaEstoque(unidadeId, produtoId, quantidade, usuarioId) {
    console.log("1 - iniciando saida");
    const estoqueAtual = await prisma.estoque.findUnique({
        where: {
            unidadeId_produtoId: {
                unidadeId,
                produtoId,
            },
        },
    });
    console.log("2 - estoque encontrado:", estoqueAtual);
    if (!estoqueAtual ||
        estoqueAtual.quantidade < quantidade) {
        throw new Error("ESTOQUE_INSUFICIENTE");
    }
    console.log("3 - atualizando estoque");
    const estoque = await prisma.estoque.update({
        where: {
            unidadeId_produtoId: {
                unidadeId,
                produtoId,
            },
        },
        data: {
            quantidade: {
                decrement: quantidade,
            },
        },
        include: {
            unidade: true,
            produto: true,
        },
    });
    console.log("4 - estoque atualizado");
    await prisma.movimentacaoEstoque.create({
        data: {
            unidadeId,
            produtoId,
            usuarioId,
            tipo: "SAIDA",
            quantidade,
        },
    });
    console.log("5 - movimentacao criada");
    return estoque;
}
export async function listarMovimentacoes(unidadeId) {
    if (unidadeId !== undefined) {
        return prisma.movimentacaoEstoque.findMany({
            where: {
                unidadeId,
            },
            include: {
                unidade: true,
                produto: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        perfil: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    return prisma.movimentacaoEstoque.findMany({
        include: {
            unidade: true,
            produto: true,
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    perfil: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
//# sourceMappingURL=estoque.service.js.map