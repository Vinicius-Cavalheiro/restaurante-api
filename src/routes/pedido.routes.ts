import { Router } from "express";
import { permitirPerfis } from "../middlewares/role.middleware.js";
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

export const pedidoRoutes = Router();

pedidoRoutes.use(authMiddleware);

pedidoRoutes.post("/", create);

pedidoRoutes.post(
  "/:id/pagamento",
  pagar
);

pedidoRoutes.patch(
  "/:id/status",
  permitirPerfis("ADMIN", "GERENTE", "ATENDENTE"),
  updateStatus
);