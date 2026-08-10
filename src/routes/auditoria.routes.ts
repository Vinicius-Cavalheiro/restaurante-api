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

/**
 * @openapi
 * tags:
 *   - name: Auditoria
 *     description: Consulta de registros de auditoria de ações sensíveis do sistema
 */

/**
 * @openapi
 * /auditorias:
 *   get:
 *     tags:
 *       - Auditoria
 *     summary: Listar registros de auditoria
 *     description: >
 *       Retorna os registros de auditoria gerados por ações sensíveis,
 *       como criação de pedidos, pagamentos, mudanças de status
 *       e crédito de pontos de fidelidade.
 *       A consulta é restrita ao perfil ADMIN.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Registros de auditoria retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auditorias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       usuarioId:
 *                         type: integer
 *                         example: 2
 *                       acao:
 *                         type: string
 *                         example: STATUS_PEDIDO_ALTERADO
 *                       entidade:
 *                         type: string
 *                         example: PEDIDO
 *                       entidadeId:
 *                         type: integer
 *                         example: 6
 *                       detalhes:
 *                         type: object
 *                         additionalProperties: true
 *                         example:
 *                           statusAnterior: CONFIRMADO
 *                           statusNovo: EM_PREPARO
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       usuario:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           nome:
 *                             type: string
 *                             example: Administrador
 *                           email:
 *                             type: string
 *                             example: admin@restaurante.com
 *                           perfil:
 *                             type: string
 *                             example: ADMIN
 *
 *             example:
 *               auditorias:
 *                 - id: 3
 *                   usuarioId: 2
 *                   acao: STATUS_PEDIDO_ALTERADO
 *                   entidade: PEDIDO
 *                   entidadeId: 6
 *                   detalhes:
 *                     statusAnterior: CONFIRMADO
 *                     statusNovo: EM_PREPARO
 *                   createdAt: "2026-08-10T07:46:56.806Z"
 *                   usuario:
 *                     id: 2
 *                     nome: Administrador
 *                     email: admin@restaurante.com
 *                     perfil: ADMIN
 *
 *                 - id: 2
 *                   usuarioId: 2
 *                   acao: PAGAMENTO_APROVADO
 *                   entidade: PEDIDO
 *                   entidadeId: 6
 *                   detalhes:
 *                     metodo: PIX
 *                     valor: 32.9
 *                     statusAnterior: PENDENTE
 *                     statusNovo: CONFIRMADO
 *
 *                 - id: 1
 *                   usuarioId: 2
 *                   acao: PEDIDO_CRIADO
 *                   entidade: PEDIDO
 *                   entidadeId: 6
 *
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       403:
 *         description: Usuário autenticado sem perfil ADMIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
auditoriaRoutes.get(
  "/",
  permitirPerfis("ADMIN"),
  list
);