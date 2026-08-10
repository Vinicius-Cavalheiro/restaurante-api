import { Router } from "express";

import {
  create,
  updateStatus,
} from "../controllers/pedido.controller.js";

import {
  pagar,
} from "../controllers/pagamento.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

import {
  permitirPerfis,
} from "../middlewares/role.middleware.js";

export const pedidoRoutes = Router();

pedidoRoutes.use(authMiddleware);

pedidoRoutes.post(
  "/",
  create
);

pedidoRoutes.post(
  "/:id/pagamento",
  pagar
);

pedidoRoutes.patch(
  "/:id/status",
  permitirPerfis(
    "ADMIN",
    "GERENTE",
    "ATENDENTE"
  ),
  updateStatus
);