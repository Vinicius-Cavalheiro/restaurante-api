import type { Request, Response } from "express";
import { listarAuditorias } from "../services/auditoria.service.js";

export async function list(
  req: Request,
  res: Response
) {
  try {
    const auditorias = await listarAuditorias();

    return res.status(200).json({
      auditorias,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ERRO_INTERNO",
      message: "Erro interno do servidor.",
    });
  }
}