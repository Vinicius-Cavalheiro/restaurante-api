import { criarUsuario, buscarUsuarioPorEmail, } from "../services/usuario.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function register(req, res) {
    try {
        const { nome, email, senha, perfil } = req.body;
        if (!nome || !email || !senha) {
            return res.status(400).json({
                error: "CAMPOS_OBRIGATORIOS",
                message: "Nome, e-mail e senha são obrigatórios.",
            });
        }
        if (senha.length < 8) {
            return res.status(422).json({
                error: "SENHA_INVALIDA",
                message: "A senha deve possuir pelo menos 8 caracteres.",
            });
        }
        const usuario = await criarUsuario({
            nome,
            email,
            senha,
            perfil,
        });
        return res.status(201).json({
            message: "Usuário cadastrado com sucesso.",
            usuario,
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "EMAIL_JA_CADASTRADO") {
            return res.status(409).json({
                error: "EMAIL_JA_CADASTRADO",
                message: "Já existe um usuário cadastrado com este e-mail.",
            });
        }
        console.error(error);
        return res.status(500).json({
            error: "ERRO_INTERNO",
            message: "Erro interno do servidor.",
        });
    }
}
export async function login(req, res) {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({
                error: "CAMPOS_OBRIGATORIOS",
                message: "E-mail e senha são obrigatórios.",
            });
        }
        const usuario = await buscarUsuarioPorEmail(email);
        if (!usuario) {
            return res.status(401).json({
                error: "CREDENCIAIS_INVALIDAS",
                message: "E-mail ou senha inválidos.",
            });
        }
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({
                error: "CREDENCIAIS_INVALIDAS",
                message: "E-mail ou senha inválidos.",
            });
        }
        if (!usuario.ativo) {
            return res.status(403).json({
                error: "USUARIO_INATIVO",
                message: "Usuário inativo.",
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET_NAO_CONFIGURADO");
        }
        const token = jwt.sign({
            perfil: usuario.perfil,
        }, secret, {
            subject: usuario.id.toString(),
            expiresIn: "1h",
        });
        return res.status(200).json({
            accessToken: token,
            tokenType: "Bearer",
            expiresIn: 3600,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "ERRO_INTERNO",
            message: "Erro interno do servidor.",
        });
    }
}
export async function me(req, res) {
    return res.status(200).json({
        usuario: req.user,
    });
}
export async function admin(req, res) {
    return res.status(200).json({
        message: "Área administrativa acessada com sucesso.",
        usuario: req.user,
    });
}
//# sourceMappingURL=auth.controller.js.map