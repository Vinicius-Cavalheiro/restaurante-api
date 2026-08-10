import { Router } from "express";
import { create, list, getById, update, remove, } from "../controllers/unidade.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { permitirPerfis } from "../middlewares/role.middleware.js";
export const unidadeRoutes = Router();
unidadeRoutes.use(authMiddleware);
/**
 * @openapi
 * tags:
 *   - name: Unidades
 *     description: Gerenciamento das unidades da rede
 */
/**
 * @openapi
 * /unidades:
 *   get:
 *     tags:
 *       - Unidades
 *     summary: Listar unidades
 *     description: Retorna todas as unidades cadastradas na rede.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Unidades retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unidades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: Restaurante Centro
 *                       endereco:
 *                         type: string
 *                         example: Rua Principal, 100
 *                       cidade:
 *                         type: string
 *                         example: Curitiba
 *                       ativo:
 *                         type: boolean
 *                         example: true
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       500:
 *         description: Erro interno do servidor
 */
unidadeRoutes.get("/", list);
/**
 * @openapi
 * /unidades/{id}:
 *   get:
 *     tags:
 *       - Unidades
 *     summary: Buscar unidade por ID
 *     description: Retorna uma unidade específica pelo identificador.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Unidade encontrada
 *         content:
 *           application/json:
 *             example:
 *               unidade:
 *                 id: 1
 *                 nome: Restaurante Centro
 *                 endereco: Rua Principal, 100
 *                 cidade: Curitiba
 *                 ativo: true
 *
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             example:
 *               error: ID_INVALIDO
 *               message: O ID informado é inválido.
 *
 *       404:
 *         description: Unidade não encontrada
 *         content:
 *           application/json:
 *             example:
 *               error: UNIDADE_NAO_ENCONTRADA
 *               message: Unidade não encontrada.
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       500:
 *         description: Erro interno do servidor
 */
unidadeRoutes.get("/:id", getById);
/**
 * @openapi
 * /unidades:
 *   post:
 *     tags:
 *       - Unidades
 *     summary: Cadastrar unidade
 *     description: Cadastra uma nova unidade da rede. Restrito ao perfil ADMIN.
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
 *               - nome
 *               - endereco
 *               - cidade
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Restaurante Centro
 *               endereco:
 *                 type: string
 *                 example: Rua Principal, 100
 *               cidade:
 *                 type: string
 *                 example: Curitiba
 *
 *           example:
 *             nome: Restaurante Centro
 *             endereco: Rua Principal, 100
 *             cidade: Curitiba
 *
 *     responses:
 *       201:
 *         description: Unidade cadastrada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Unidade cadastrada com sucesso.
 *               unidade:
 *                 id: 1
 *                 nome: Restaurante Centro
 *                 endereco: Rua Principal, 100
 *                 cidade: Curitiba
 *                 ativo: true
 *
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             example:
 *               error: CAMPOS_OBRIGATORIOS
 *               message: Nome, endereço e cidade são obrigatórios.
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       403:
 *         description: Usuário sem permissão
 *
 *       500:
 *         description: Erro interno do servidor
 */
unidadeRoutes.post("/", permitirPerfis("ADMIN"), create);
/**
 * @openapi
 * /unidades/{id}:
 *   put:
 *     tags:
 *       - Unidades
 *     summary: Atualizar unidade
 *     description: Atualiza uma unidade existente. Restrito ao perfil ADMIN.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Restaurante Centro Atualizado
 *               endereco:
 *                 type: string
 *                 example: Rua Principal, 150
 *               cidade:
 *                 type: string
 *                 example: Curitiba
 *               ativo:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Unidade atualizada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Unidade atualizada com sucesso.
 *
 *       400:
 *         description: ID inválido
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       403:
 *         description: Usuário sem permissão
 *
 *       404:
 *         description: Unidade não encontrada
 *         content:
 *           application/json:
 *             example:
 *               error: UNIDADE_NAO_ENCONTRADA
 *               message: Unidade não encontrada.
 *
 *       500:
 *         description: Erro interno do servidor
 */
unidadeRoutes.put("/:id", permitirPerfis("ADMIN"), update);
/**
 * @openapi
 * /unidades/{id}:
 *   delete:
 *     tags:
 *       - Unidades
 *     summary: Excluir unidade
 *     description: Exclui uma unidade cadastrada. Restrito ao perfil ADMIN.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Unidade excluída com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Unidade excluída com sucesso.
 *
 *       400:
 *         description: ID inválido
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       403:
 *         description: Usuário sem permissão
 *
 *       404:
 *         description: Unidade não encontrada
 *
 *       500:
 *         description: Erro interno do servidor
 */
unidadeRoutes.delete("/:id", permitirPerfis("ADMIN"), remove);
//# sourceMappingURL=unidade.routes.js.map