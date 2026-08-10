import { Router } from "express";

import {
  list,
} from "../controllers/auditoria.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

import {
  permitirPerfis,
} from "../middlewares/role.middleware.js";

export const auditoriaRoutes = Router();

auditoriaRoutes.use(authMiddleware);

auditoriaRoutes.get(
  "/",
  permitirPerfis("ADMIN"),
  list
);