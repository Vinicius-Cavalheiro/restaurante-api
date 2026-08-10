import { Router } from "express";

import {
  entrada,
  saida,
  getEstoque,
  getEstoqueUnidade,
  getMovimentacoes,
} from "../controllers/estoque.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { permitirPerfis } from "../middlewares/role.middleware.js";

export const estoqueRoutes = Router();

estoqueRoutes.use(authMiddleware);

estoqueRoutes.get(
  "/movimentacoes",
  permitirPerfis("ADMIN"),
  getMovimentacoes
);

estoqueRoutes.get(
  "/unidade/:unidadeId",
  getEstoqueUnidade
);

estoqueRoutes.get(
  "/unidade/:unidadeId/produto/:produtoId",
  getEstoque
);

estoqueRoutes.post(
  "/entrada",
  permitirPerfis("ADMIN"),
  entrada
);

estoqueRoutes.post(
  "/saida",
  permitirPerfis("ADMIN"),
  saida
);