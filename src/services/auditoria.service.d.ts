import type { Prisma } from "../../generated/prisma/client.js";
interface RegistrarAuditoriaDTO {
    usuarioId: number;
    acao: string;
    entidade: string;
    entidadeId: number;
    detalhes?: Prisma.InputJsonValue;
}
export declare function registrarAuditoria({ usuarioId, acao, entidade, entidadeId, detalhes, }: RegistrarAuditoriaDTO): Promise<{
    id: number;
    usuarioId: number;
    acao: string;
    entidade: string;
    entidadeId: number;
    detalhes: import("@prisma/client/runtime/client").JsonValue | null;
    createdAt: Date;
}>;
export declare function listarAuditorias(): Promise<({
    usuario: {
        email: string;
        id: number;
        nome: string;
        perfil: import("../../generated/prisma/enums.js").Perfil;
    };
} & {
    id: number;
    usuarioId: number;
    acao: string;
    entidade: string;
    entidadeId: number;
    detalhes: import("@prisma/client/runtime/client").JsonValue | null;
    createdAt: Date;
})[]>;
export {};
//# sourceMappingURL=auditoria.service.d.ts.map