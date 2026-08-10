import { Router } from "express";
import { register, login, me, admin, } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { permitirPerfis } from "../middlewares/role.middleware.js";
export const authRoutes = Router();
/**
 * @openapi
 * tags:
 *   - name: Autenticação
 *     description: Cadastro, login e autenticação de usuários
 */
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Cadastrar usuário
 *     description: Cadastra um novo usuário no sistema.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: Senha@123
 *               perfil:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - GERENTE
 *                   - ATENDENTE
 *                   - CLIENTE
 *                 example: CLIENTE
 *
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário cadastrado com sucesso.
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: João Silva
 *                     email:
 *                       type: string
 *                       example: joao@email.com
 *                     perfil:
 *                       type: string
 *                       example: CLIENTE
 *
 *       400:
 *         description: Campos obrigatórios não informados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       409:
 *         description: E-mail já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Erro interno do servidor
 */
authRoutes.post("/register", register);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Realizar login
 *     description: Autentica o usuário por e-mail e senha e retorna um token JWT.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: Senha@123
 *
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 tokenType:
 *                   type: string
 *                   example: Bearer
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: João Silva
 *                     email:
 *                       type: string
 *                       example: joao@email.com
 *                     perfil:
 *                       type: string
 *                       example: CLIENTE
 *
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       401:
 *         description: E-mail ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Erro interno do servidor
 */
authRoutes.post("/login", login);
/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Autenticação
 *     summary: Consultar usuário autenticado
 *     description: Retorna os dados do usuário identificado pelo token JWT.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: João Silva
 *                     email:
 *                       type: string
 *                       example: joao@email.com
 *                     perfil:
 *                       type: string
 *                       example: CLIENTE
 *
 *       401:
 *         description: Token ausente, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoutes.get("/me", authMiddleware, me);
/**
 * @openapi
 * /auth/admin:
 *   get:
 *     tags:
 *       - Autenticação
 *     summary: Testar acesso administrativo
 *     description: Endpoint protegido disponível somente para usuários com perfil ADMIN.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Acesso administrativo autorizado
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
 */
authRoutes.get("/admin", authMiddleware, permitirPerfis("ADMIN"), admin);
//# sourceMappingURL=auth.routes.js.map