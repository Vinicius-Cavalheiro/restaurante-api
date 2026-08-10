import { Router } from "express";

import {
  consultarSaldo,
} from "../controllers/fidelidade.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

export const fidelidadeRoutes = Router();

fidelidadeRoutes.use(authMiddleware);

/**
 * @openapi
 * tags:
 *   - name: Fidelidade
 *     description: Consulta do saldo de pontos de fidelidade do usuário autenticado
 */

/**
 * @openapi
 * /fidelidade/saldo:
 *   get:
 *     tags:
 *       - Fidelidade
 *     summary: Consultar saldo de fidelidade
 *     description: >
 *       Retorna o saldo de pontos de fidelidade do usuário autenticado.
 *       Os pontos são vinculados ao usuário identificado pelo token JWT.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Saldo de fidelidade retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fidelidade:
 *                   type: object
 *                   properties:
 *                     usuarioId:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: João Silva
 *                     pontos:
 *                       type: integer
 *                       example: 32
 *
 *             example:
 *               fidelidade:
 *                 usuarioId: 1
 *                 nome: João Silva
 *                 pontos: 32
 *
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             example:
 *               error: NAO_AUTENTICADO
 *               message: Usuário não autenticado.
 *
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: USUARIO_NAO_ENCONTRADO
 *               message: Usuário não encontrado.
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
fidelidadeRoutes.get(
  "/saldo",
  consultarSaldo
);