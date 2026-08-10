import { Router } from "express";

import {
  register,
  login,
  me,
  admin,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { permitirPerfis } from "../middlewares/role.middleware.js";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);

authRoutes.get("/me", authMiddleware, me);

authRoutes.get(
  "/admin",
  authMiddleware,
  permitirPerfis("ADMIN"),
  admin
);