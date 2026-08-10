import { prisma } from "../config/prisma.js";

interface CriarProdutoDTO {
  nome: string;
  descricao?: string;
  categoria: string;
  sku: string;
  preco: number;
  custo: number;
}

interface AtualizarProdutoDTO {
  nome?: string;
  descricao?: string;
  categoria?: string;
  sku?: string;
  preco?: number;
  custo?: number;
  ativo?: boolean;
}

export async function criarProduto(dados: CriarProdutoDTO) {
  return prisma.produto.create({
    data: dados,
  });
}

export async function listarProdutos() {
  return prisma.produto.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}

export async function buscarProdutoPorId(id: number) {
  return prisma.produto.findUnique({
    where: { id },
  });
}

export async function buscarProdutoPorSku(sku: string) {
  return prisma.produto.findUnique({
    where: { sku },
  });
}

export async function atualizarProduto(
  id: number,
  dados: AtualizarProdutoDTO
) {
  return prisma.produto.update({
    where: { id },
    data: dados,
  });
}

export async function excluirProduto(id: number) {
  return prisma.produto.delete({
    where: { id },
  });
}