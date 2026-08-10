import { prisma } from "../config/prisma.js";
import { registrarAuditoria } from "./auditoria.service.js";
export async function processarPagamento(dados) {
    const { pedidoId, usuarioId, metodo, resultado, } = dados;
    const pedido = await prisma.pedido.findUnique({
        where: {
            id: pedidoId,
        },
        include: {
            itens: true,
            pagamento: true,
        },
    });
    if (!pedido) {
        throw new Error("PEDIDO_NAO_ENCONTRADO");
    }
    if (pedido.pagamento) {
        throw new Error("PAGAMENTO_JA_PROCESSADO");
    }
    if (pedido.status !== "PENDENTE") {
        throw new Error("STATUS_PEDIDO_INVALIDO");
    }
    // =====================================
    // PAGAMENTO RECUSADO
    // =====================================
    if (resultado === "RECUSADO") {
        const pagamento = await prisma.pagamento.create({
            data: {
                pedidoId: pedido.id,
                metodo,
                status: "RECUSADO",
                valor: pedido.valorTotal,
                transacao: `MOCK-RECUSADO-${Date.now()}`,
            },
        });
        await prisma.pedido.update({
            where: {
                id: pedido.id,
            },
            data: {
                status: "CANCELADO",
            },
        });
        await registrarAuditoria({
            usuarioId,
            acao: "PAGAMENTO_RECUSADO",
            entidade: "PEDIDO",
            entidadeId: pedido.id,
            detalhes: {
                metodo,
                valor: Number(pedido.valorTotal),
                statusAnterior: "PENDENTE",
                statusNovo: "CANCELADO",
                transacao: pagamento.transacao ?? "",
            },
        });
        return {
            pagamento,
            statusPedido: "CANCELADO",
        };
    }
    // =====================================
    // PAGAMENTO APROVADO
    // =====================================
    // Revalida estoque antes de cobrar/confirmar
    for (const item of pedido.itens) {
        const estoque = await prisma.estoque.findUnique({
            where: {
                unidadeId_produtoId: {
                    unidadeId: pedido.unidadeId,
                    produtoId: item.produtoId,
                },
            },
        });
        if (!estoque ||
            estoque.quantidade < item.quantidade) {
            throw new Error("ESTOQUE_INSUFICIENTE");
        }
    }
    const pagamento = await prisma.pagamento.create({
        data: {
            pedidoId: pedido.id,
            metodo,
            status: "APROVADO",
            valor: pedido.valorTotal,
            transacao: `MOCK-APROVADO-${Date.now()}`,
        },
    });
    // Baixa estoque
    for (const item of pedido.itens) {
        await prisma.estoque.update({
            where: {
                unidadeId_produtoId: {
                    unidadeId: pedido.unidadeId,
                    produtoId: item.produtoId,
                },
            },
            data: {
                quantidade: {
                    decrement: item.quantidade,
                },
            },
        });
        // Histórico de estoque
        await prisma.movimentacaoEstoque.create({
            data: {
                unidadeId: pedido.unidadeId,
                produtoId: item.produtoId,
                usuarioId,
                tipo: "SAIDA",
                quantidade: item.quantidade,
            },
        });
    }
    const pedidoAtualizado = await prisma.pedido.update({
        where: {
            id: pedido.id,
        },
        data: {
            status: "CONFIRMADO",
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
    await registrarAuditoria({
        usuarioId,
        acao: "PAGAMENTO_APROVADO",
        entidade: "PEDIDO",
        entidadeId: pedido.id,
        detalhes: {
            metodo,
            valor: Number(pedido.valorTotal),
            statusAnterior: "PENDENTE",
            statusNovo: "CONFIRMADO",
            transacao: pagamento.transacao ?? "",
        },
    });
    return {
        pagamento,
        pedido: pedidoAtualizado,
    };
}
//# sourceMappingURL=pagamento.service.js.map