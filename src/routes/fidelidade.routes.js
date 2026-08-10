import { Router } from "express";
import { consultarSaldo, consentirFidelidade, resgatar, } from "../controllers/fidelidade.controller.js";
import { authMiddleware, } from "../middlewares/auth.middleware.js";
export const fidelidadeRoutes = Router();
fidelidadeRoutes.use(authMiddleware);
/**
 * @openapi
 * tags:
 *   - name: Fidelidade
 *     description: Consulta de pontos, consentimento e resgate de benefícios
 */
/**
 * @openapi
 * /fidelidade/saldo:
 *   get:
 *     tags:
 *       - Fidelidade
 *     summary: Consultar saldo de fidelidade
 *     description: >
 *       Retorna o saldo de pontos do usuário autenticado,
 *       além da situação de adesão ao programa de fidelidade.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Saldo retornado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               fidelidade:
 *                 usuarioId: 1
 *                 nome: João Silva
 *                 pontos: 132
 *                 ativa: true
 *                 consentimentoEm: "2026-08-10T10:30:00.000Z"
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
 */
fidelidadeRoutes.get("/saldo", consultarSaldo);
/**
 * @openapi
 * /fidelidade/consentimento:
 *   post:
 *     tags:
 *       - Fidelidade
 *     summary: Registrar consentimento no programa de fidelidade
 *     description: >
 *       Registra a adesão voluntária do usuário autenticado
 *       ao programa de fidelidade.
 *       Após o consentimento, o usuário poderá participar
 *       das regras de crédito e resgate de pontos.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Consentimento registrado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Consentimento de fidelidade registrado com sucesso.
 *               fidelidade:
 *                 id: 1
 *                 nome: João Silva
 *                 fidelidadeAtiva: true
 *                 consentimentoFidelidadeEm: "2026-08-10T10:30:00.000Z"
 *                 pontosFidelidade: 32
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
 *       409:
 *         description: Fidelidade já ativa
 *         content:
 *           application/json:
 *             example:
 *               error: FIDELIDADE_JA_ATIVA
 *               message: O usuário já possui consentimento ativo para o programa de fidelidade.
 *
 *       500:
 *         description: Erro interno do servidor
 */
fidelidadeRoutes.post("/consentimento", consentirFidelidade);
/**
 * @openapi
 * /fidelidade/resgatar:
 *   post:
 *     tags:
 *       - Fidelidade
 *     summary: Resgatar pontos de fidelidade
 *     description: >
 *       Permite ao usuário autenticado trocar pontos de fidelidade
 *       por um benefício simples.
 *       A regra atual considera 100 pontos equivalentes a R$ 10,00 de benefício.
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
 *               - pontos
 *             properties:
 *               pontos:
 *                 type: integer
 *                 minimum: 1
 *                 example: 100
 *
 *           example:
 *             pontos: 100
 *
 *     responses:
 *       200:
 *         description: Pontos resgatados com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Pontos resgatados com sucesso.
 *               usuario:
 *                 id: 1
 *                 nome: João Silva
 *                 pontosFidelidade: 32
 *                 fidelidadeAtiva: true
 *               resgate:
 *                 pontosConsumidos: 100
 *                 valorBeneficio: 10
 *
 *       400:
 *         description: Campo obrigatório ausente
 *         content:
 *           application/json:
 *             example:
 *               error: CAMPOS_OBRIGATORIOS
 *               message: A quantidade de pontos é obrigatória.
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
 *       409:
 *         description: Conflito com a regra de fidelidade
 *         content:
 *           application/json:
 *             examples:
 *               fidelidadeNaoAtiva:
 *                 value:
 *                   error: FIDELIDADE_NAO_ATIVA
 *                   message: O usuário ainda não consentiu com o programa de fidelidade.
 *
 *               pontosInsuficientes:
 *                 value:
 *                   error: PONTOS_INSUFICIENTES
 *                   message: O usuário não possui pontos suficientes para realizar o resgate.
 *
 *       422:
 *         description: Quantidade de pontos inválida
 *         content:
 *           application/json:
 *             examples:
 *               pontosInvalidos:
 *                 value:
 *                   error: PONTOS_INVALIDOS
 *                   message: A quantidade de pontos deve ser um número inteiro maior que zero.
 *
 *               minimoNaoAtingido:
 *                 value:
 *                   error: MINIMO_RESGATE_NAO_ATINGIDO
 *                   message: O resgate mínimo é de 100 pontos.
 *
 *       500:
 *         description: Erro interno do servidor
 */
fidelidadeRoutes.post("/resgatar", resgatar);
//# sourceMappingURL=fidelidade.routes.js.map