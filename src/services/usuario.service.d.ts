interface CriarUsuarioDTO {
    nome: string;
    email: string;
    senha: string;
    perfil?: "ADMIN" | "GERENTE" | "ATENDENTE" | "CLIENTE";
}
export declare function criarUsuario({ nome, email, senha, perfil, }: CriarUsuarioDTO): Promise<{
    ativo: boolean;
    createdAt: Date;
    email: string;
    id: number;
    nome: string;
    perfil: import("../../generated/prisma/enums.js").Perfil;
}>;
export declare function buscarUsuarioPorEmail(email: string): Promise<{
    id: number;
    nome: string;
    email: string;
    senha: string;
    perfil: import("../../generated/prisma/enums.js").Perfil;
    ativo: boolean;
    pontosFidelidade: number;
    fidelidadeAtiva: boolean;
    consentimentoFidelidadeEm: Date | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export {};
//# sourceMappingURL=usuario.service.d.ts.map