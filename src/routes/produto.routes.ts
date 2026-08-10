import { Router } from "express";

import {
  create,
  list,
  getById,
  update,
  remove,
} from "../controllers/produto.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { permitirPerfis } from "../middlewares/role.middleware.js";

export const produtoRoutes = Router();

produtoRoutes.use(authMiddleware);

produtoRoutes.get("/", list);
produtoRoutes.get("/:id", getById);

produtoRoutes.post(
  "/",
  permitirPerfis("ADMIN"),
  create
);

produtoRoutes.put(
  "/:id",
  permitirPerfis("ADMIN"),
  update
);

produtoRoutes.delete(
  "/:id",
  permitirPerfis("ADMIN"),
  remove
);