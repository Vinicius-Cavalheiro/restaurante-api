import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  sub: string;
  perfil: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "TOKEN_NAO_INFORMADO",
      message: "Token de autenticação não informado.",
    });
  }

  const [tipo, token] = authHeader.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      error: "TOKEN_INVALIDO",
      message: "Token inválido.",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      error: "JWT_NAO_CONFIGURADO",
      message: "Configuração de autenticação inválida.",
    });
  }

  try {
    const payload = jwt.verify(token, secret) as TokenPayload;

    req.user = {
      id: Number(payload.sub),
      perfil: payload.perfil,
    };

    next();
  } catch {
    return res.status(401).json({
      error: "TOKEN_INVALIDO",
      message: "Token inválido ou expirado.",
    });
  }
}