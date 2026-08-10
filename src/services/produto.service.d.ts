interface CriarProdutoDTO {
    nome: string;
    descricao?: string;
    categoria: string;
    sku: string;
    preco: number;
    custo: number;
}
interface AtualizarProdutoDTO {
    nome?: string;
    descricao?: string;
    categoria?: string;
    sku?: string;
    preco?: number;
    custo?: number;
    ativo?: boolean;
}
export declare function criarProduto(dados: CriarProdutoDTO): Promise<{
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
}>;
export declare function listarProdutos(): Promise<{
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
}[]>;
export declare function buscarProdutoPorId(id: number): Promise<{
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
} | null>;
export declare function buscarProdutoPorSku(sku: string): Promise<{
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
} | null>;
export declare function atualizarProduto(id: number, dados: AtualizarProdutoDTO): Promise<{
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
}>;
export declare function excluirProduto(id: number): Promise<{
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
}>;
export {};
//# sourceMappingURL=produto.service.d.ts.map