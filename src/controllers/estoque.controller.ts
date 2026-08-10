import type { Request, Response } from "express";

import {
  buscarEstoque,
  listarEstoquePorUnidade,
  entradaEstoque,
  saidaEstoque,
  listarMovimentacoes,
} from "../services/estoque.service.js";

export async function getEstoque(req: Request, res: Response) {
  try {
    const unidadeId = Number(req.params.unidadeId);
    const produtoId = Number(req.params.produtoId);

    if (Number.isNaN(unidadeId) || Number.isNaN(produtoId)) {
      return res.status(400).json({
        error: "ID_INVALIDO",
        message: "Unidade ou produto inválido.",
      });
    }

    const estoque = await buscarEstoque(unidadeId, produtoId);

    if (!estoque) {
      return res.status(404).json({
        error: "ESTOQUE_NAO_ENCONTRADO",
        message: "Estoque não encontrado para esta unidade e produto.",
      });
    }

    return res.status(200).json({
      estoque,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}

export async function getEstoqueUnidade(
  req: Request,
  res: Response
) {
  try {
    const unidadeId = Number(req.params.unidadeId);

    if (Number.isNaN(unidadeId)) {
      return res.status(400).json({
        error: "ID_INVALIDO",
        message: "Unidade inválida.",
      });
    }

    const estoques = await listarEstoquePorUnidade(unidadeId);

    return res.status(200).json({
      estoques,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}

export async function entrada(req: Request, res: Response) {
  try {
    const { unidadeId, produtoId, quantidade } = req.body;

    if (
      unidadeId === undefined ||
      produtoId === undefined ||
      quantidade === undefined
    ) {
      return res.status(400).json({
        error: "CAMPOS_OBRIGATORIOS",
        message: "Unidade, produto e quantidade são obrigatórios.",
      });
    }

    if (
      !Number.isInteger(Number(unidadeId)) ||
      Number(unidadeId) <= 0 ||
      !Number.isInteger(Number(produtoId)) ||
      Number(produtoId) <= 0
    ) {
      return res.status(422).json({
        error: "ID_INVALIDO",
        message: "Unidade e produto devem possuir IDs válidos.",
      });
    }

    if (
      !Number.isInteger(Number(quantidade)) ||
      Number(quantidade) <= 0
    ) {
      return res.status(422).json({
        error: "QUANTIDADE_INVALIDA",
        message: "A quantidade deve ser um número inteiro maior que zero.",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        error: "NAO_AUTENTICADO",
        message: "Usuário não autenticado.",
      });
    }

    const estoque = await entradaEstoque(
      Number(unidadeId),
      Number(produtoId),
      Number(quantidade),
      req.user.id
    );

    return res.status(200).json({
      message: "Entrada de estoque realizada com sucesso.",
      estoque,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}

export async function saida(req: Request, res: Response) {
  try {
    const { unidadeId, produtoId, quantidade } = req.body;

    if (
      unidadeId === undefined ||
      produtoId === undefined ||
      quantidade === undefined
    ) {
      return res.status(400).json({
        error: "CAMPOS_OBRIGATORIOS",
        message: "Unidade, produto e quantidade são obrigatórios.",
      });
    }

    if (
      !Number.isInteger(Number(unidadeId)) ||
      Number(unidadeId) <= 0 ||
      !Number.isInteger(Number(produtoId)) ||
      Number(produtoId) <= 0
    ) {
      return res.status(422).json({
        error: "ID_INVALIDO",
        message: "Unidade e produto devem possuir IDs válidos.",
      });
    }

    if (
      !Number.isInteger(Number(quantidade)) ||
      Number(quantidade) <= 0
    ) {
      return res.status(422).json({
        error: "QUANTIDADE_INVALIDA",
        message: "A quantidade deve ser um número inteiro maior que zero.",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        error: "NAO_AUTENTICADO",
        message: "Usuário não autenticado.",
      });
    }

    const estoque = await saidaEstoque(
      Number(unidadeId),
      Number(produtoId),
      Number(quantidade),
      req.user.id
    );

    return res.status(200).json({
      message: "Saída de estoque realizada com sucesso.",
      estoque,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ESTOQUE_INSUFICIENTE"
    ) {
      return res.status(409).json({
        error: "ESTOQUE_INSUFICIENTE",
        message: "Não há estoque suficiente para realizar esta saída.",
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}

export async function getMovimentacoes(
  req: Request,
  res: Response
) {
  try {
    let unidadeId: number | undefined;

    if (req.query.unidadeId !== undefined) {
      unidadeId = Number(req.query.unidadeId);

      if (
        !Number.isInteger(unidadeId) ||
        unidadeId <= 0
      ) {
        return res.status(400).json({
          error: "UNIDADE_INVALIDA",
          message: "O ID da unidade é inválido.",
        });
      }
    }

    const movimentacoes =
      unidadeId !== undefined
        ? await listarMovimentacoes(unidadeId)
        : await listarMovimentacoes();

    return res.status(200).json({
      movimentacoes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}