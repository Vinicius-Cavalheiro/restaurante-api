import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
export async function criarUsuario({ nome, email, senha, perfil = "CLIENTE", }) {
    const usuarioExistente = await prisma.usuario.findUnique({
        where: {
            email,
        },
    });
    if (usuarioExistente) {
        throw new Error("EMAIL_JA_CADASTRADO");
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            senha: senhaHash,
            perfil,
        },
        select: {
            id: true,
            nome: true,
            email: true,
            perfil: true,
            ativo: true,
            createdAt: true,
        },
    });
    return usuario;
}
export async function buscarUsuarioPorEmail(email) {
    return prisma.usuario.findUnique({
        where: {
            email,
        },
    });
}
//# sourceMappingURL=usuario.service.js.map