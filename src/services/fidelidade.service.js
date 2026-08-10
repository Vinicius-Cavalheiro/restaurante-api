import { prisma } from "../config/prisma.js";
import { registrarAuditoria } from "./auditoria.service.js";
export async function consultarPontos(usuarioId) {
    const usuario = await prisma.usuario.findUnique({
        where: {
            id: usuarioId,
        },
        select: {
            id: true,
            nome: true,
            pontosFidelidade: true,
            fidelidadeAtiva: true,
            consentimentoFidelidadeEm: true,
        },
    });
    if (!usuario) {
        throw new Error("USUARIO_NAO_ENCONTRADO");
    }
    return usuario;
}
export async function registrarConsentimentoFidelidade(usuarioId) {
    const usuario = await prisma.usuario.findUnique({
        where: {
            id: usuarioId,
        },
    });
    if (!usuario) {
        throw new Error("USUARIO_NAO_ENCONTRADO");
    }
    if (usuario.fidelidadeAtiva) {
        throw new Error("FIDELIDADE_JA_ATIVA");
    }
    const usuarioAtualizado = await prisma.usuario.update({
        where: {
            id: usuarioId,
        },
        data: {
            fidelidadeAtiva: true,
            consentimentoFidelidadeEm: new Date(),
        },
        select: {
            id: true,
            nome: true,
            fidelidadeAtiva: true,
            consentimentoFidelidadeEm: true,
            pontosFidelidade: true,
        },
    });
    await registrarAuditoria({
        usuarioId,
        acao: "FIDELIDADE_CONSENTIMENTO_REGISTRADO",
        entidade: "USUARIO",
        entidadeId: usuarioId,
        detalhes: {
            fidelidadeAtiva: true,
            consentimentoFidelidadeEm: usuarioAtualizado.consentimentoFidelidadeEm,
        },
    });
    return usuarioAtualizado;
}
export async function resgatarPontos(usuarioId, pontos) {
    if (!Number.isInteger(pontos) ||
        pontos <= 0) {
        throw new Error("PONTOS_INVALIDOS");
    }
    const usuario = await prisma.usuario.findUnique({
        where: {
            id: usuarioId,
        },
    });
    if (!usuario) {
        throw new Error("USUARIO_NAO_ENCONTRADO");
    }
    if (!usuario.fidelidadeAtiva) {
        throw new Error("FIDELIDADE_NAO_ATIVA");
    }
    if (usuario.pontosFidelidade < pontos) {
        throw new Error("PONTOS_INSUFICIENTES");
    }
    const valorBeneficio = Math.floor(pontos / 100) * 10;
    if (valorBeneficio <= 0) {
        throw new Error("MINIMO_RESGATE_NAO_ATINGIDO");
    }
    const pontosConsumidos = Math.floor(pontos / 100) * 100;
    const usuarioAtualizado = await prisma.usuario.update({
        where: {
            id: usuarioId,
        },
        data: {
            pontosFidelidade: {
                decrement: pontosConsumidos,
            },
        },
        select: {
            id: true,
            nome: true,
            pontosFidelidade: true,
            fidelidadeAtiva: true,
        },
    });
    await registrarAuditoria({
        usuarioId,
        acao: "PONTOS_FIDELIDADE_RESGATADOS",
        entidade: "USUARIO",
        entidadeId: usuarioId,
        detalhes: {
            pontosSolicitados: pontos,
            pontosConsumidos,
            valorBeneficio,
            saldoRestante: usuarioAtualizado.pontosFidelidade,
        },
    });
    return {
        usuario: usuarioAtualizado,
        resgate: {
            pontosConsumidos,
            valorBeneficio,
        },
    };
}
export async function creditarPontosPedido(pedidoId) {
    const pedido = await prisma.pedido.findUnique({
        where: {
            id: pedidoId,
        },
        include: {
            usuario: true,
        },
    });
    if (!pedido) {
        throw new Error("PEDIDO_NAO_ENCONTRADO");
    }
    // Impede crédito duplicado
    if (pedido.pontosCreditados) {
        return {
            pontosCreditados: 0,
            mensagem: "Os pontos deste pedido já foram creditados.",
        };
    }
    // O usuário precisa ter consentido com o programa
    if (!pedido.usuario.fidelidadeAtiva) {
        return {
            pontosCreditados: 0,
            mensagem: "Usuário não aderiu ao programa de fidelidade.",
        };
    }
    // Somente pedidos finalizados geram pontos
    if (pedido.status !== "FINALIZADO") {
        throw new Error("PEDIDO_NAO_FINALIZADO");
    }
    // R$ 1,00 = 1 ponto
    // Ex.: R$ 32,90 = 32 pontos
    const pontos = Math.floor(Number(pedido.valorTotal));
    if (pontos <= 0) {
        return {
            pontosCreditados: 0,
            mensagem: "O pedido não gerou pontos de fidelidade.",
        };
    }
    const resultado = await prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.update({
            where: {
                id: pedido.usuarioId,
            },
            data: {
                pontosFidelidade: {
                    increment: pontos,
                },
            },
            select: {
                id: true,
                nome: true,
                pontosFidelidade: true,
            },
        });
        await tx.pedido.update({
            where: {
                id: pedidoId,
            },
            data: {
                pontosCreditados: true,
            },
        });
        return usuario;
    });
    await registrarAuditoria({
        usuarioId: pedido.usuarioId,
        acao: "PONTOS_FIDELIDADE_CREDITADOS",
        entidade: "PEDIDO",
        entidadeId: pedidoId,
        detalhes: {
            pontos,
            valorPedido: Number(pedido.valorTotal),
            saldoAtual: resultado.pontosFidelidade,
        },
    });
    return {
        pontosCreditados: pontos,
        saldoAtual: resultado.pontosFidelidade,
    };
}
//# sourceMappingURL=fidelidade.service.js.map