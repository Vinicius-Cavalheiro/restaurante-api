import { Router } from "express";

import {
  create,
  list,
  getById,
  update,
  remove,
} from "../controllers/unidade.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { permitirPerfis } from "../middlewares/role.middleware.js";

export const unidadeRoutes = Router();

unidadeRoutes.use(authMiddleware);

unidadeRoutes.get("/", list);
unidadeRoutes.get("/:id", getById);
unidadeRoutes.put(
  "/:id",
  permitirPerfis("ADMIN"),
  update
);

unidadeRoutes.delete(
  "/:id",
  permitirPerfis("ADMIN"),
  remove
);
unidadeRoutes.post(
  "/",
  permitirPerfis("ADMIN"),
  create
);

