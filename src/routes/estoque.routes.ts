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

/**
 * @openapi
 * tags:
 *   - name: Estoque
 *     description: Consulta e movimentação de estoque por unidade
 */

/**
 * @openapi
 * /estoques/movimentacoes:
 *   get:
 *     tags:
 *       - Estoque
 *     summary: Listar movimentações de estoque
 *     description: >
 *       Lista o histórico de entradas e saídas de estoque.
 *       É possível filtrar as movimentações por unidade.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: unidadeId
 *         required: false
 *         description: ID da unidade usada como filtro
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Movimentações retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movimentacoes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                       unidadeId:
 *                         type: integer
 *                         example: 1
 *                       produtoId:
 *                         type: integer
 *                         example: 1
 *                       usuarioId:
 *                         type: integer
 *                         example: 2
 *                       tipo:
 *                         type: string
 *                         enum:
 *                           - ENTRADA
 *                           - SAIDA
 *                         example: SAIDA
 *                       quantidade:
 *                         type: integer
 *                         example: 2
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *
 *       400:
 *         description: ID de unidade inválido
 *         content:
 *           application/json:
 *             example:
 *               error: UNIDADE_INVALIDA
 *               message: O ID da unidade é inválido.
 *
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       403:
 *         description: Usuário sem permissão
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Erro interno do servidor
 */
estoqueRoutes.get(
  "/movimentacoes",
  permitirPerfis("ADMIN"),
  getMovimentacoes
);

/**
 * @openapi
 * /estoques/unidade/{unidadeId}:
 *   get:
 *     tags:
 *       - Estoque
 *     summary: Listar estoque de uma unidade
 *     description: Retorna os produtos e saldos de estoque vinculados a uma unidade.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: unidadeId
 *         required: true
 *         description: ID da unidade
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Estoques da unidade retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estoques:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       unidadeId:
 *                         type: integer
 *                         example: 1
 *                       produtoId:
 *                         type: integer
 *                         example: 1
 *                       quantidade:
 *                         type: integer
 *                         example: 50
 *
 *       400:
 *         description: ID da unidade inválido
 *         content:
 *           application/json:
 *             example:
 *               error: ID_INVALIDO
 *               message: Unidade inválida.
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       500:
 *         description: Erro interno do servidor
 */
estoqueRoutes.get(
  "/unidade/:unidadeId",
  getEstoqueUnidade
);

/**
 * @openapi
 * /estoques/unidade/{unidadeId}/produto/{produtoId}:
 *   get:
 *     tags:
 *       - Estoque
 *     summary: Consultar estoque de um produto em uma unidade
 *     description: >
 *       Consulta o saldo de estoque de um produto específico
 *       em uma unidade específica.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: unidadeId
 *         required: true
 *         description: ID da unidade
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *
 *       - in: path
 *         name: produtoId
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Estoque encontrado
 *         content:
 *           application/json:
 *             example:
 *               estoque:
 *                 id: 1
 *                 unidadeId: 1
 *                 produtoId: 1
 *                 quantidade: 50
 *
 *       400:
 *         description: Unidade ou produto inválido
 *         content:
 *           application/json:
 *             example:
 *               error: ID_INVALIDO
 *               message: Unidade ou produto inválido.
 *
 *       404:
 *         description: Estoque não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: ESTOQUE_NAO_ENCONTRADO
 *               message: Estoque não encontrado para esta unidade e produto.
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       500:
 *         description: Erro interno do servidor
 */
estoqueRoutes.get(
  "/unidade/:unidadeId/produto/:produtoId",
  getEstoque
);

/**
 * @openapi
 * /estoques/entrada:
 *   post:
 *     tags:
 *       - Estoque
 *     summary: Registrar entrada de estoque
 *     description: >
 *       Registra uma entrada de estoque para um produto em uma unidade
 *       e gera uma movimentação do tipo ENTRADA vinculada ao usuário autenticado.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unidadeId
 *               - produtoId
 *               - quantidade
 *             properties:
 *               unidadeId:
 *                 type: integer
 *                 example: 1
 *               produtoId:
 *                 type: integer
 *                 example: 1
 *               quantidade:
 *                 type: integer
 *                 minimum: 1
 *                 example: 50
 *
 *           example:
 *             unidadeId: 1
 *             produtoId: 1
 *             quantidade: 50
 *
 *     responses:
 *       200:
 *         description: Entrada realizada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Entrada de estoque realizada com sucesso.
 *               estoque:
 *                 id: 1
 *                 unidadeId: 1
 *                 produtoId: 1
 *                 quantidade: 100
 *
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             example:
 *               error: CAMPOS_OBRIGATORIOS
 *               message: Unidade, produto e quantidade são obrigatórios.
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       403:
 *         description: Perfil sem permissão
 *
 *       422:
 *         description: IDs ou quantidade inválidos
 *         content:
 *           application/json:
 *             examples:
 *               idInvalido:
 *                 value:
 *                   error: ID_INVALIDO
 *                   message: Unidade e produto devem possuir IDs válidos.
 *
 *               quantidadeInvalida:
 *                 value:
 *                   error: QUANTIDADE_INVALIDA
 *                   message: A quantidade deve ser um número inteiro maior que zero.
 *
 *       500:
 *         description: Erro interno do servidor
 */
estoqueRoutes.post(
  "/entrada",
  permitirPerfis("ADMIN"),
  entrada
);

/**
 * @openapi
 * /estoques/saida:
 *   post:
 *     tags:
 *       - Estoque
 *     summary: Registrar saída de estoque
 *     description: >
 *       Registra uma saída de estoque para um produto em uma unidade.
 *       O sistema impede que o saldo fique negativo e registra uma movimentação do tipo SAIDA.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unidadeId
 *               - produtoId
 *               - quantidade
 *             properties:
 *               unidadeId:
 *                 type: integer
 *                 example: 1
 *               produtoId:
 *                 type: integer
 *                 example: 1
 *               quantidade:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *
 *           example:
 *             unidadeId: 1
 *             produtoId: 1
 *             quantidade: 10
 *
 *     responses:
 *       200:
 *         description: Saída realizada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Saída de estoque realizada com sucesso.
 *               estoque:
 *                 id: 1
 *                 unidadeId: 1
 *                 produtoId: 1
 *                 quantidade: 90
 *
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             example:
 *               error: CAMPOS_OBRIGATORIOS
 *               message: Unidade, produto e quantidade são obrigatórios.
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       403:
 *         description: Perfil sem permissão
 *
 *       409:
 *         description: Estoque insuficiente
 *         content:
 *           application/json:
 *             example:
 *               error: ESTOQUE_INSUFICIENTE
 *               message: Não há estoque suficiente para realizar esta saída.
 *
 *       422:
 *         description: IDs ou quantidade inválidos
 *         content:
 *           application/json:
 *             examples:
 *               idInvalido:
 *                 value:
 *                   error: ID_INVALIDO
 *                   message: Unidade e produto devem possuir IDs válidos.
 *
 *               quantidadeInvalida:
 *                 value:
 *                   error: QUANTIDADE_INVALIDA
 *                   message: A quantidade deve ser um número inteiro maior que zero.
 *
 *       500:
 *         description: Erro interno do servidor
 */
estoqueRoutes.post(
  "/saida",
  permitirPerfis("ADMIN"),
  saida
);