import { prisma } from "../config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

interface RegistrarAuditoriaDTO {
  usuarioId: number;
  acao: string;
  entidade: string;
  entidadeId: number;
  detalhes?: Prisma.InputJsonValue;
}

export async function registrarAuditoria({
  usuarioId,
  acao,
  entidade,
  entidadeId,
  detalhes,
}: RegistrarAuditoriaDTO) {
  return prisma.auditoria.create({
    data: {
      usuarioId,
      acao,
      entidade,
      entidadeId,
      ...(detalhes !== undefined
        ? {
            detalhes,
          }
        : {}),
    },
  });
}

export async function listarAuditorias() {
  return prisma.auditoria.findMany({
    include: {
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