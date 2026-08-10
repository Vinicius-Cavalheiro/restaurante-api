import { prisma } from "../config/prisma.js";

interface ItemPedidoDTO {
  produtoId: number;
  quantidade: number;
}

interface CriarPedidoDTO {
  usuarioId: number;
  unidadeId: number;
  canal: "BALCAO" | "APP" | "DELIVERY";
  itens: ItemPedidoDTO[];
}

export async function criarPedido(dados: CriarPedidoDTO) {
  const {
    usuarioId,
    unidadeId,
    canal,
    itens,
  } = dados;

  if (itens.length === 0) {
    throw new Error("PEDIDO_SEM_ITENS");
  }

  let valorTotal = 0;

  const itensCalculados = [];

  for (const item of itens) {
    // Valida quantidade
    if (
      !Number.isInteger(item.quantidade) ||
      item.quantidade <= 0
    ) {
      throw new Error("QUANTIDADE_INVALIDA");
    }

    // Busca produto
    const produto = await prisma.produto.findUnique({
      where: {
        id: item.produtoId,
      },
    });

    if (!produto || !produto.ativo) {
      throw new Error("PRODUTO_INVALIDO");
    }

    // Busca estoque do produto na unidade escolhida
    const estoque = await prisma.estoque.findUnique({
      where: {
        unidadeId_produtoId: {
          unidadeId,
          produtoId: item.produtoId,
        },
      },
    });

    // Produto não possui estoque nessa unidade
    if (!estoque) {
      throw new Error("ESTOQUE_INSUFICIENTE");
    }

    // Quantidade solicitada maior que o estoque disponível
    if (estoque.quantidade < item.quantidade) {
      throw new Error("ESTOQUE_INSUFICIENTE");
    }

    // Preço sempre vem do banco
    const precoUnitario = Number(produto.preco);

    const subtotal =
      precoUnitario * item.quantidade;

    valorTotal += subtotal;

    itensCalculados.push({
      produtoId: produto.id,
      quantidade: item.quantidade,
      precoUnitario,
      subtotal,
    });
  }

  // Só cria o pedido depois que TODOS os itens
  // passaram pelas validações
  const pedido = await prisma.pedido.create({
    data: {
      usuarioId,
      unidadeId,
      canal,
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
    },
  });

  return pedido;
}

type StatusPermitido =
  | "CONFIRMADO"
  | "EM_PREPARO"
  | "PRONTO"
  | "FINALIZADO"
  | "CANCELADO";

const transicoesPermitidas: Record<
  StatusPermitido,
  StatusPermitido[]
> = {
  CONFIRMADO: ["EM_PREPARO"],
  EM_PREPARO: ["PRONTO"],
  PRONTO: ["FINALIZADO"],
  FINALIZADO: [],
  CANCELADO: [],
};

export async function atualizarStatusPedido(
  pedidoId: number,
  novoStatus: StatusPermitido
) {
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

  const statusAtual = pedido.status as StatusPermitido;

  const permitidos =
    transicoesPermitidas[statusAtual] ?? [];

  if (!permitidos.includes(novoStatus)) {
    throw new Error("TRANSICAO_STATUS_INVALIDA");
  }

  return prisma.pedido.update({
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
}