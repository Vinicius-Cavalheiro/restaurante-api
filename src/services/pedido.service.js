import { prisma } from "../config/prisma.js";
import { registrarAuditoria } from "./auditoria.service.js";
import { creditarPontosPedido } from "./fidelidade.service.js";
export async function criarPedido(dados) {
    const { usuarioId, unidadeId, canalPedido, itens, } = dados;
    if (itens.length === 0) {
        throw new Error("PEDIDO_SEM_ITENS");
    }
    // Valida unidade
    const unidade = await prisma.unidade.findUnique({
        where: {
            id: unidadeId,
        },
    });
    if (!unidade || !unidade.ativo) {
        throw new Error("UNIDADE_INVALIDA");
    }
    let valorTotal = 0;
    const itensCalculados = [];
    for (const item of itens) {
        if (!Number.isInteger(item.quantidade) ||
            item.quantidade <= 0) {
            throw new Error("QUANTIDADE_INVALIDA");
        }
        const produto = await prisma.produto.findUnique({
            where: {
                id: item.produtoId,
            },
        });
        if (!produto || !produto.ativo) {
            throw new Error("PRODUTO_INVALIDO");
        }
        const estoque = await prisma.estoque.findUnique({
            where: {
                unidadeId_produtoId: {
                    unidadeId,
                    produtoId: item.produtoId,
                },
            },
        });
        if (!estoque ||
            estoque.quantidade < item.quantidade) {
            throw new Error("ESTOQUE_INSUFICIENTE");
        }
        const precoUnitario = Number(produto.preco);
        const subtotal = precoUnitario * item.quantidade;
        valorTotal += subtotal;
        itensCalculados.push({
            produtoId: produto.id,
            quantidade: item.quantidade,
            precoUnitario,
            subtotal,
        });
    }
    const pedido = await prisma.pedido.create({
        data: {
            usuarioId,
            unidadeId,
            canalPedido,
            valorTotal,
            itens: {
                create: itensCalculados,
            },
        },
        include: {
            unidade: true,
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true,
                },
            },
            itens: {
                include: {
                    produto: true,
                },
            },
            pagamento: true,
        },
    });
    // Auditoria automática
    await registrarAuditoria({
        usuarioId,
        acao: "PEDIDO_CRIADO",
        entidade: "PEDIDO",
        entidadeId: pedido.id,
        detalhes: {
            unidadeId: pedido.unidadeId,
            canalPedido: pedido.canalPedido,
            valorTotal: Number(pedido.valorTotal),
        },
    });
    return pedido;
}
const transicoesPermitidas = {
    CONFIRMADO: ["EM_PREPARO"],
    EM_PREPARO: ["PRONTO"],
    PRONTO: ["FINALIZADO"],
    FINALIZADO: [],
    CANCELADO: [],
};
export async function atualizarStatusPedido(pedidoId, novoStatus, usuarioId) {
    const pedido = await prisma.pedido.findUnique({
        where: {
            id: pedidoId,
        },
    });
    if (!pedido) {
        throw new Error("PEDIDO_NAO_ENCONTRADO");
    }
    if (pedido.status === "PENDENTE") {
        throw new Error("PEDIDO_AGUARDANDO_PAGAMENTO");
    }
    const statusAtual = pedido.status;
    const permitidos = transicoesPermitidas[statusAtual] ?? [];
    if (!permitidos.includes(novoStatus)) {
        throw new Error("TRANSICAO_STATUS_INVALIDA");
    }
    const statusAnterior = pedido.status;
    const pedidoAtualizado = await prisma.pedido.update({
        where: {
            id: pedidoId,
        },
        data: {
            status: novoStatus,
        },
        include: {
            itens: {
                include: {
                    produto: true,
                },
            },
            pagamento: true,
            unidade: true,
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    perfil: true,
                },
            },
        },
    });
    // Auditoria da mudança de status
    await registrarAuditoria({
        usuarioId,
        acao: "STATUS_PEDIDO_ALTERADO",
        entidade: "PEDIDO",
        entidadeId: pedidoId,
        detalhes: {
            statusAnterior,
            statusNovo: novoStatus,
        },
    });
    // Fidelização:
    // os pontos são concedidos somente
    // quando o pedido chega a FINALIZADO.
    if (novoStatus === "FINALIZADO") {
        const resultadoPontos = await creditarPontosPedido(pedidoId);
        if (resultadoPontos.pontosCreditados > 0) {
            console.log(`${resultadoPontos.pontosCreditados} pontos de fidelidade creditados para o pedido ${pedidoId}.`);
        }
        else if (resultadoPontos.mensagem) {
            console.log(resultadoPontos.mensagem);
        }
    }
    return pedidoAtualizado;
}
export async function listarPedidos(canalPedido) {
    if (canalPedido !== undefined) {
        return prisma.pedido.findMany({
            where: {
                canalPedido,
            },
            include: {
                unidade: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        perfil: true,
                    },
                },
                itens: {
                    include: {
                        produto: true,
                    },
                },
                pagamento: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    return prisma.pedido.findMany({
        include: {
            unidade: true,
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    perfil: true,
                },
            },
            itens: {
                include: {
                    produto: true,
                },
            },
            pagamento: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
//# sourceMappingURL=pedido.service.js.map