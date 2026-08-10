import { prisma } from "../config/prisma.js";

export async function consultarPontos(
  usuarioId: number
) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id: usuarioId,
    },

    select: {
      id: true,
      nome: true,
      pontosFidelidade: true,
    },
  });

  if (!usuario) {
    throw new Error("USUARIO_NAO_ENCONTRADO");
  }

  return usuario;
}

export async function creditarPontosPedido(
  pedidoId: number
) {
  const pedido = await prisma.pedido.findUnique({
    where: {
      id: pedidoId,
    },
  });

  if (!pedido) {
    throw new Error("PEDIDO_NAO_ENCONTRADO");
  }

  if (pedido.status !== "FINALIZADO") {
    throw new Error("PEDIDO_NAO_FINALIZADO");
  }

  if (pedido.pontosCreditados) {
    return 0;
  }

  const pontos = Math.floor(
    Number(pedido.valorTotal)
  );

  if (pontos <= 0) {
    return 0;
  }

  await prisma.$transaction([
    prisma.usuario.update({
      where: {
        id: pedido.usuarioId,
      },

      data: {
        pontosFidelidade: {
          increment: pontos,
        },
      },
    }),

    prisma.pedido.update({
      where: {
        id: pedido.id,
      },

      data: {
        pontosCreditados: true,
      },
    }),
  ]);

  return pontos;
}