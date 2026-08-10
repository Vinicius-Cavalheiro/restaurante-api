import { Router } from "express";
import { create, list, getById, update, remove, } from "../controllers/produto.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { permitirPerfis } from "../middlewares/role.middleware.js";
export const produtoRoutes = Router();
produtoRoutes.use(authMiddleware);
/**
 * @openapi
 * tags:
 *   - name: Produtos
 *     description: Cadastro, consulta, atualização e exclusão de produtos
 */
/**
 * @openapi
 * /produtos:
 *   get:
 *     tags:
 *       - Produtos
 *     summary: Listar produtos
 *     description: Retorna todos os produtos cadastrados.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Produtos retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produtos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: X-Burger
 *                       descricao:
 *                         type: string
 *                         example: Hambúrguer, queijo, molho da casa e pão especial
 *                       categoria:
 *                         type: string
 *                         example: Lanches
 *                       sku:
 *                         type: string
 *                         example: LAN-XBURGER-001
 *                       preco:
 *                         type: number
 *                         example: 32.90
 *                       custo:
 *                         type: number
 *                         example: 12.50
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
produtoRoutes.get("/", list);
/**
 * @openapi
 * /produtos/{id}:
 *   get:
 *     tags:
 *       - Produtos
 *     summary: Buscar produto por ID
 *     description: Retorna um produto específico pelo identificador.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             example:
 *               produto:
 *                 id: 1
 *                 nome: X-Burger
 *                 descricao: Hambúrguer, queijo, molho da casa e pão especial
 *                 categoria: Lanches
 *                 sku: LAN-XBURGER-001
 *                 preco: 32.90
 *                 custo: 12.50
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
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: PRODUTO_NAO_ENCONTRADO
 *               message: Produto não encontrado.
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       500:
 *         description: Erro interno do servidor
 */
produtoRoutes.get("/:id", getById);
/**
 * @openapi
 * /produtos:
 *   post:
 *     tags:
 *       - Produtos
 *     summary: Cadastrar produto
 *     description: Cadastra um novo produto. Operação restrita ao perfil ADMIN.
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
 *               - categoria
 *               - sku
 *               - preco
 *               - custo
 *             properties:
 *               nome:
 *                 type: string
 *                 example: X-Burger
 *               descricao:
 *                 type: string
 *                 example: Hambúrguer, queijo e molho da casa
 *               categoria:
 *                 type: string
 *                 example: Lanches
 *               sku:
 *                 type: string
 *                 example: LAN-XBURGER-001
 *               preco:
 *                 type: number
 *                 minimum: 0
 *                 example: 32.90
 *               custo:
 *                 type: number
 *                 minimum: 0
 *                 example: 12.50
 *
 *           example:
 *             nome: X-Burger
 *             descricao: Hambúrguer, queijo e molho da casa
 *             categoria: Lanches
 *             sku: LAN-XBURGER-001
 *             preco: 32.90
 *             custo: 12.50
 *
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Produto cadastrado com sucesso.
 *               produto:
 *                 id: 1
 *                 nome: X-Burger
 *                 categoria: Lanches
 *                 sku: LAN-XBURGER-001
 *                 preco: 32.90
 *                 custo: 12.50
 *                 ativo: true
 *
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             example:
 *               error: CAMPOS_OBRIGATORIOS
 *               message: Nome, categoria, SKU, preço e custo são obrigatórios.
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       403:
 *         description: Usuário sem permissão
 *
 *       409:
 *         description: SKU já cadastrado
 *         content:
 *           application/json:
 *             example:
 *               error: SKU_JA_CADASTRADO
 *               message: Já existe um produto com este SKU.
 *
 *       422:
 *         description: Preço ou custo inválido
 *         content:
 *           application/json:
 *             example:
 *               error: VALOR_INVALIDO
 *               message: Preço e custo não podem ser negativos.
 *
 *       500:
 *         description: Erro interno do servidor
 */
produtoRoutes.post("/", permitirPerfis("ADMIN"), create);
/**
 * @openapi
 * /produtos/{id}:
 *   put:
 *     tags:
 *       - Produtos
 *     summary: Atualizar produto
 *     description: Atualiza os dados de um produto existente. Restrito ao perfil ADMIN.
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
 *                 example: X-Burger Especial
 *               descricao:
 *                 type: string
 *                 example: Hambúrguer, queijo, molho da casa e pão especial
 *               categoria:
 *                 type: string
 *                 example: Lanches
 *               sku:
 *                 type: string
 *                 example: LAN-XBURGER-001
 *               preco:
 *                 type: number
 *                 minimum: 0
 *                 example: 34.90
 *               custo:
 *                 type: number
 *                 minimum: 0
 *                 example: 13.50
 *               ativo:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Produto atualizado com sucesso.
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
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: PRODUTO_NAO_ENCONTRADO
 *               message: Produto não encontrado.
 *
 *       409:
 *         description: SKU já utilizado
 *         content:
 *           application/json:
 *             example:
 *               error: SKU_JA_CADASTRADO
 *               message: Já existe um produto com este SKU.
 *
 *       422:
 *         description: Preço ou custo inválido
 *         content:
 *           application/json:
 *             example:
 *               error: VALOR_INVALIDO
 *               message: Preço e custo não podem ser negativos.
 *
 *       500:
 *         description: Erro interno do servidor
 */
produtoRoutes.put("/:id", permitirPerfis("ADMIN"), update);
/**
 * @openapi
 * /produtos/{id}:
 *   delete:
 *     tags:
 *       - Produtos
 *     summary: Excluir produto
 *     description: Exclui um produto pelo ID. Operação restrita ao perfil ADMIN.
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
 *         description: Produto excluído com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Produto excluído com sucesso.
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
 *         description: Produto não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */
produtoRoutes.delete("/:id", permitirPerfis("ADMIN"), remove);
//# sourceMappingURL=produto.routes.js.map