import { prisma } from "../config/prisma.js";

interface ProcessarPagamentoDTO {
  pedidoId: number;
  usuarioId: number;
  metodo: "PIX" | "CARTAO";
  resultado: "APROVADO" | "RECUSADO";
}

export async function processarPagamento(
  dados: ProcessarPagamentoDTO
) {
  const {
    pedidoId,
    usuarioId,
    metodo,
    resultado,
  } = dados;

  // 1. Busca o pedido completo
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

  // 2. Impede pagamento duplicado
  if (pedido.pagamento) {
    throw new Error("PAGAMENTO_JA_PROCESSADO");
  }

  // 3. Pedido precisa estar pendente
  if (pedido.status !== "PENDENTE") {
    throw new Error("STATUS_PEDIDO_INVALIDO");
  }

  // =====================================================
  // PAGAMENTO RECUSADO
  // =====================================================

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

    return {
      pagamento,
      statusPedido: "CANCELADO",
    };
  }

  // =====================================================
  // PAGAMENTO APROVADO
  // =====================================================

  // Antes de aprovar, valida novamente o estoque de todos os itens
  for (const item of pedido.itens) {
    const estoque = await prisma.estoque.findUnique({
      where: {
        unidadeId_produtoId: {
          unidadeId: pedido.unidadeId,
          produtoId: item.produtoId,
        },
      },
    });

    if (
      !estoque ||
      estoque.quantidade < item.quantidade
    ) {
      throw new Error("ESTOQUE_INSUFICIENTE");
    }
  }

  // 4. Cria o pagamento aprovado
  const pagamento = await prisma.pagamento.create({
    data: {
      pedidoId: pedido.id,
      metodo,
      status: "APROVADO",
      valor: pedido.valorTotal,
      transacao: `MOCK-APROVADO-${Date.now()}`,
    },
  });

  // 5. Baixa estoque item por item
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

    // Auditoria automática
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

  // 6. Confirma pedido
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
    },
  });

  return {
    pagamento,
    pedido: pedidoAtualizado,
  };
}