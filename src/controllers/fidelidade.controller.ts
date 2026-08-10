import type { Request, Response } from "express";

import {
  consultarPontos,
} from "../services/fidelidade.service.js";

export async function consultarSaldo(
  req: Request,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "NAO_AUTENTICADO",
        message: "Usuário não autenticado.",
      });
    }

    const fidelidade = await consultarPontos(
      req.user.id
    );

    return res.status(200).json({
      fidelidade: {
        usuarioId: fidelidade.id,
        nome: fidelidade.nome,
        pontos: fidelidade.pontosFidelidade,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USUARIO_NAO_ENCONTRADO"
    ) {
      return res.status(404).json({
        error: "USUARIO_NAO_ENCONTRADO",
        message: "Usuário não encontrado.",
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}