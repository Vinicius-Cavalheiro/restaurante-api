import { prisma } from "../config/prisma.js";

interface CriarUnidadeDTO {
  nome: string;
  endereco: string;
  cidade: string;
}

interface AtualizarUnidadeDTO {
  nome?: string;
  endereco?: string;
  cidade?: string;
  ativo?: boolean;
}

export async function criarUnidade({
  nome,
  endereco,
  cidade,
}: CriarUnidadeDTO) {
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

export async function buscarUnidadePorId(id: number) {
  return prisma.unidade.findUnique({
    where: {
      id,
    },
  });
}

export async function atualizarUnidade(
  id: number,
  dados: AtualizarUnidadeDTO
) {
  return prisma.unidade.update({
    where: {
      id,
    },
    data: dados,
  });
}

export async function excluirUnidade(id: number) {
  return prisma.unidade.delete({
    where: {
      id,
    },
  });
}