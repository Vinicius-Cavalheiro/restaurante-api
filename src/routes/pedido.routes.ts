import { Router } from "express";

import {
  create,
  updateStatus,
  list,
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

/**
 * @openapi
 * tags:
 *   - name: Pedidos
 *     description: Criação, consulta, pagamento e atualização de pedidos
 */

/**
 * @openapi
 * /pedidos:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Listar pedidos
 *     description: Lista os pedidos cadastrados e permite filtrar pelo canal de origem.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: canalPedido
 *         required: false
 *         description: Canal de origem do pedido
 *         schema:
 *           type: string
 *           enum:
 *             - BALCAO
 *             - APP
 *             - DELIVERY
 *         example: APP
 *
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedidos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 8
 *                       usuarioId:
 *                         type: integer
 *                         example: 1
 *                       unidadeId:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: CONFIRMADO
 *                       canalPedido:
 *                         type: string
 *                         enum:
 *                           - BALCAO
 *                           - APP
 *                           - DELIVERY
 *                         example: APP
 *                       valorTotal:
 *                         type: number
 *                         format: double
 *                         example: 32.90
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *
 *       400:
 *         description: canalPedido inválido
 *         content:
 *           application/json:
 *             example:
 *               error: CANAL_PEDIDO_INVALIDO
 *               message: O canalPedido informado é inválido.
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
pedidoRoutes.get(
  "/",
  permitirPerfis(
    "ADMIN",
    "GERENTE",
    "ATENDENTE"
  ),
  list
);

/**
 * @openapi
 * /pedidos:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Criar pedido
 *     description: >
 *       Cria um novo pedido para o usuário autenticado.
 *       O sistema valida a unidade, produtos, quantidades e estoque disponível.
 *       Os preços são obtidos diretamente do banco de dados.
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
 *               - canalPedido
 *               - itens
 *             properties:
 *               unidadeId:
 *                 type: integer
 *                 example: 1
 *
 *               canalPedido:
 *                 type: string
 *                 enum:
 *                   - BALCAO
 *                   - APP
 *                   - DELIVERY
 *                 example: APP
 *
 *               itens:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - produtoId
 *                     - quantidade
 *                   properties:
 *                     produtoId:
 *                       type: integer
 *                       example: 1
 *                     quantidade:
 *                       type: integer
 *                       minimum: 1
 *                       example: 1
 *
 *           example:
 *             unidadeId: 1
 *             canalPedido: APP
 *             itens:
 *               - produtoId: 1
 *                 quantidade: 1
 *
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Pedido criado com sucesso.
 *               pedido:
 *                 id: 8
 *                 usuarioId: 1
 *                 unidadeId: 1
 *                 status: PENDENTE
 *                 canalPedido: APP
 *                 valorTotal: 32.90
 *
 *       400:
 *         description: Campos obrigatórios não informados
 *         content:
 *           application/json:
 *             example:
 *               error: CAMPOS_OBRIGATORIOS
 *               message: Unidade, canalPedido e itens são obrigatórios.
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
 *         description: Unidade ou produto inexistente/inativo
 *         content:
 *           application/json:
 *             examples:
 *               unidade:
 *                 value:
 *                   error: UNIDADE_INVALIDA
 *                   message: Unidade não encontrada ou inativa.
 *               produto:
 *                 value:
 *                   error: PRODUTO_INVALIDO
 *                   message: Produto não encontrado ou inativo.
 *
 *       409:
 *         description: Estoque insuficiente
 *         content:
 *           application/json:
 *             example:
 *               error: ESTOQUE_INSUFICIENTE
 *               message: Estoque insuficiente para realizar o pedido.
 *
 *       422:
 *         description: Dados do pedido inválidos
 *         content:
 *           application/json:
 *             examples:
 *               unidadeInvalida:
 *                 value:
 *                   error: UNIDADE_INVALIDA
 *                   message: A unidade informada é inválida.
 *
 *               canalInvalido:
 *                 value:
 *                   error: CANAL_INVALIDO
 *                   message: O canalPedido deve ser BALCAO, APP ou DELIVERY.
 *
 *               semItens:
 *                 value:
 *                   error: PEDIDO_SEM_ITENS
 *                   message: O pedido deve possuir pelo menos um item.
 *
 *               quantidadeInvalida:
 *                 value:
 *                   error: QUANTIDADE_INVALIDA
 *                   message: A quantidade dos produtos deve ser maior que zero.
 *
 *       500:
 *         description: Erro interno do servidor
 */
pedidoRoutes.post(
  "/",
  create
);

/**
 * @openapi
 * /pedidos/{id}/pagamento:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Processar pagamento mock
 *     description: >
 *       Simula a integração com um serviço externo de pagamento.
 *       O resultado pode ser APROVADO ou RECUSADO.
 *       Quando aprovado, o pedido passa para CONFIRMADO e ocorre a baixa de estoque.
 *       Quando recusado, o pedido passa para CANCELADO.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: integer
 *         example: 8
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - metodo
 *               - resultado
 *             properties:
 *               metodo:
 *                 type: string
 *                 enum:
 *                   - PIX
 *                   - CARTAO
 *                 example: PIX
 *
 *               resultado:
 *                 type: string
 *                 enum:
 *                   - APROVADO
 *                   - RECUSADO
 *                 example: APROVADO
 *
 *           example:
 *             metodo: PIX
 *             resultado: APROVADO
 *
 *     responses:
 *       200:
 *         description: Pagamento processado
 *         content:
 *           application/json:
 *             examples:
 *               aprovado:
 *                 summary: Pagamento aprovado
 *                 value:
 *                   message: Pagamento aprovado com sucesso.
 *                   pagamento:
 *                     pedidoId: 8
 *                     metodo: PIX
 *                     status: APROVADO
 *                     valor: 32.90
 *                     transacao: MOCK-APROVADO-1786348001380
 *
 *               recusado:
 *                 summary: Pagamento recusado
 *                 value:
 *                   message: Pagamento recusado.
 *                   pagamento:
 *                     pedidoId: 8
 *                     metodo: PIX
 *                     status: RECUSADO
 *                     valor: 32.90
 *                   statusPedido: CANCELADO
 *
 *       400:
 *         description: ID do pedido inválido
 *         content:
 *           application/json:
 *             example:
 *               error: PEDIDO_INVALIDO
 *               message: O ID do pedido é inválido.
 *
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: PEDIDO_NAO_ENCONTRADO
 *               message: Pedido não encontrado.
 *
 *       409:
 *         description: Conflito de regra de negócio
 *         content:
 *           application/json:
 *             examples:
 *               pagamentoDuplicado:
 *                 value:
 *                   error: PAGAMENTO_JA_PROCESSADO
 *                   message: Este pedido já possui um pagamento processado.
 *
 *               statusInvalido:
 *                 value:
 *                   error: STATUS_PEDIDO_INVALIDO
 *                   message: O pedido não está disponível para pagamento.
 *
 *               estoqueInsuficiente:
 *                 value:
 *                   error: ESTOQUE_INSUFICIENTE
 *                   message: O estoque não é suficiente para confirmar o pedido.
 *
 *       422:
 *         description: Método ou resultado inválido
 *
 *       500:
 *         description: Erro interno do servidor
 */
pedidoRoutes.post(
  "/:id/pagamento",
  pagar
);

/**
 * @openapi
 * /pedidos/{id}/status:
 *   patch:
 *     tags:
 *       - Pedidos
 *     summary: Atualizar status do pedido
 *     description: >
 *       Avança o pedido através do fluxo operacional permitido.
 *       O fluxo esperado após pagamento aprovado é:
 *       CONFIRMADO → EM_PREPARO → PRONTO → FINALIZADO.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: integer
 *         example: 8
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - EM_PREPARO
 *                   - PRONTO
 *                   - FINALIZADO
 *
 *           example:
 *             status: EM_PREPARO
 *
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Status do pedido atualizado com sucesso.
 *               pedido:
 *                 id: 8
 *                 status: EM_PREPARO
 *
 *       400:
 *         description: ID do pedido inválido
 *         content:
 *           application/json:
 *             example:
 *               error: PEDIDO_INVALIDO
 *               message: O ID do pedido é inválido.
 *
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       403:
 *         description: Perfil sem permissão para atualizar status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: PEDIDO_NAO_ENCONTRADO
 *               message: Pedido não encontrado.
 *
 *       409:
 *         description: Transição de status não permitida
 *         content:
 *           application/json:
 *             examples:
 *               aguardandoPagamento:
 *                 value:
 *                   error: PEDIDO_AGUARDANDO_PAGAMENTO
 *                   message: O pedido precisa ter pagamento aprovado antes de avançar.
 *
 *               transicaoInvalida:
 *                 value:
 *                   error: TRANSICAO_STATUS_INVALIDA
 *                   message: A transição de status solicitada não é permitida.
 *
 *       422:
 *         description: Status solicitado inválido
 *         content:
 *           application/json:
 *             example:
 *               error: STATUS_INVALIDO
 *               message: O status deve ser EM_PREPARO, PRONTO ou FINALIZADO.
 *
 *       500:
 *         description: Erro interno do servidor
 */
pedidoRoutes.patch(
  "/:id/status",
  permitirPerfis(
    "ADMIN",
    "GERENTE",
    "ATENDENTE"
  ),
  updateStatus
);