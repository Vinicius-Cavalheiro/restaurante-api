import type { Request, Response } from "express";

import {
  criarUnidade,
  listarUnidades,
  buscarUnidadePorId,
  atualizarUnidade,
  excluirUnidade
} from "../services/unidade.service.js";

export async function create(req: Request, res: Response) {
  try {
    const { nome, endereco, cidade } = req.body;

    if (!nome || !endereco || !cidade) {
      return res.status(400).json({
        error: "CAMPOS_OBRIGATORIOS",
        message: "Nome, endereço e cidade são obrigatórios.",
      });
    }

    const unidade = await criarUnidade({
      nome,
      endereco,
      cidade,
    });

    return res.status(201).json({
      message: "Unidade cadastrada com sucesso.",
      unidade,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const unidades = await listarUnidades();

    return res.status(200).json({
      unidades,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "ID_INVALIDO",
        message: "O ID informado é inválido.",
      });
    }

    const unidade = await buscarUnidadePorId(id);

    if (!unidade) {
      return res.status(404).json({
        error: "UNIDADE_NAO_ENCONTRADA",
        message: "Unidade não encontrada.",
      });
    }

    return res.status(200).json({
      unidade,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}
export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "ID_INVALIDO",
        message: "O ID informado é inválido.",
      });
    }

    const unidadeExistente = await buscarUnidadePorId(id);

    if (!unidadeExistente) {
      return res.status(404).json({
        error: "UNIDADE_NAO_ENCONTRADA",
        message: "Unidade não encontrada.",
      });
    }

    const { nome, endereco, cidade, ativo } = req.body;

    const unidade = await atualizarUnidade(id, {
      nome,
      endereco,
      cidade,
      ativo,
    });

    return res.status(200).json({
      message: "Unidade atualizada com sucesso.",
      unidade,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "ID_INVALIDO",
        message: "O ID informado é inválido.",
      });
    }

    const unidadeExistente = await buscarUnidadePorId(id);

    if (!unidadeExistente) {
      return res.status(404).json({
        error: "UNIDADE_NAO_ENCONTRADA",
        message: "Unidade não encontrada.",
      });
    }

    await excluirUnidade(id);

    return res.status(200).json({
      message: "Unidade excluída com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}