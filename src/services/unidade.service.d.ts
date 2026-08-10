interface CriarUnidadeDTO {
    nome: string;
    endereco: string;
    cidade: string;
}
interface AtualizarUnidadeDTO {
    nome?: string;
    endereco?: string;
    cidade?: string;
    ativo?: boolean;
}
export declare function criarUnidade({ nome, endereco, cidade, }: CriarUnidadeDTO): Promise<{
    id: number;
    nome: string;
    endereco: string;
    cidade: string;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function listarUnidades(): Promise<{
    id: number;
    nome: string;
    endereco: string;
    cidade: string;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare function buscarUnidadePorId(id: number): Promise<{
    id: number;
    nome: string;
    endereco: string;
    cidade: string;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare function atualizarUnidade(id: number, dados: AtualizarUnidadeDTO): Promise<{
    id: number;
    nome: string;
    endereco: string;
    cidade: string;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function excluirUnidade(id: number): Promise<{
    id: number;
    nome: string;
    endereco: string;
    cidade: string;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export {};
//# sourceMappingURL=unidade.service.d.ts.map