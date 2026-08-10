import { prisma } from "../config/prisma.js";
export async function registrarAuditoria({ usuarioId, acao, entidade, entidadeId, detalhes, }) {
    return prisma.auditoria.create({
        data: {
            usuarioId,
            acao,
            entidade,
            entidadeId,
            ...(detalhes !== undefined
                ? {
                    detalhes,
                }
                : {}),
        },
    });
}
export async function listarAuditorias() {
    return prisma.auditoria.findMany({
        include: {
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    perfil: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
//# sourceMappingURL=auditoria.service.js.map