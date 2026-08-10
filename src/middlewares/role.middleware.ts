import type { NextFunction, Request, Response } from "express";

export function permitirPerfis(...perfisPermitidos: string[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        error: "NAO_AUTENTICADO",
        message: "Usuário não autenticado.",
      });
    }

    if (!perfisPermitidos.includes(req.user.perfil)) {
      return res.status(403).json({
        error: "ACESSO_NEGADO",
        message: "Você não possui permissão para acessar este recurso.",
      });
    }

    next();
  };
}