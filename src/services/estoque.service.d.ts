export declare function buscarEstoque(unidadeId: number, produtoId: number): Promise<({
    produto: {
        id: number;
        nome: string;
        descricao: string | null;
        categoria: string;
        sku: string;
        preco: import("@prisma/client-runtime-utils").Decimal;
        custo: import("@prisma/client-runtime-utils").Decimal;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    unidade: {
        id: number;
        nome: string;
        endereco: string;
        cidade: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: number;
    unidadeId: number;
    produtoId: number;
    quantidade: number;
    createdAt: Date;
    updatedAt: Date;
}) | null>;
export declare function listarEstoquePorUnidade(unidadeId: number): Promise<({
    produto: {
        id: number;
        nome: string;
        descricao: string | null;
        categoria: string;
        sku: string;
        preco: import("@prisma/client-runtime-utils").Decimal;
        custo: import("@prisma/client-runtime-utils").Decimal;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: number;
    unidadeId: number;
    produtoId: number;
    quantidade: number;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare function entradaEstoque(unidadeId: number, produtoId: number, quantidade: number, usuarioId: number): Promise<{
    produto: {
        id: number;
        nome: string;
        descricao: string | null;
        categoria: string;
        sku: string;
        preco: import("@prisma/client-runtime-utils").Decimal;
        custo: import("@prisma/client-runtime-utils").Decimal;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    unidade: {
        id: number;
        nome: string;
        endereco: string;
        cidade: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: number;
    unidadeId: number;
    produtoId: number;
    quantidade: number;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function saidaEstoque(unidadeId: number, produtoId: number, quantidade: number, usuarioId: number): Promise<{
    produto: {
        id: number;
        nome: string;
        descricao: string | null;
        categoria: string;
        sku: string;
        preco: import("@prisma/client-runtime-utils").Decimal;
        custo: import("@prisma/client-runtime-utils").Decimal;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    unidade: {
        id: number;
        nome: string;
        endereco: string;
        cidade: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: number;
    unidadeId: number;
    produtoId: number;
    quantidade: number;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function listarMovimentacoes(unidadeId?: number): Promise<({
    produto: {
        id: number;
        nome: string;
        descricao: string | null;
        categoria: string;
        sku: string;
        preco: import("@prisma/client-runtime-utils").Decimal;
        custo: import("@prisma/client-runtime-utils").Decimal;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    unidade: {
        id: number;
        nome: string;
        endereco: string;
        cidade: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    usuario: {
        email: string;
        id: number;
        nome: string;
        perfil: import("../../generated/prisma/enums.js").Perfil;
    };
} & {
    id: number;
    unidadeId: number;
    produtoId: number;
    usuarioId: number;
    tipo: import("../../generated/prisma/enums.js").TipoMovimentacao;
    quantidade: number;
    createdAt: Date;
})[]>;
//# sourceMappingURL=estoque.service.d.ts.map