interface ProcessarPagamentoDTO {
    pedidoId: number;
    usuarioId: number;
    metodo: "PIX" | "CARTAO";
    resultado: "APROVADO" | "RECUSADO";
}
export declare function processarPagamento(dados: ProcessarPagamentoDTO): Promise<{
    pagamento: {
        id: number;
        pedidoId: number;
        metodo: import("../../generated/prisma/enums.js").MetodoPagamento;
        status: import("../../generated/prisma/enums.js").StatusPagamento;
        valor: import("@prisma/client-runtime-utils").Decimal;
        transacao: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    statusPedido: string;
    pedido?: never;
} | {
    statusPedido?: never;
    pagamento: {
        id: number;
        pedidoId: number;
        metodo: import("../../generated/prisma/enums.js").MetodoPagamento;
        status: import("../../generated/prisma/enums.js").StatusPagamento;
        valor: import("@prisma/client-runtime-utils").Decimal;
        transacao: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    pedido: {
        itens: ({
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
            pedidoId: number;
            produtoId: number;
            quantidade: number;
            precoUnitario: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
        })[];
        pagamento: {
            id: number;
            pedidoId: number;
            metodo: import("../../generated/prisma/enums.js").MetodoPagamento;
            status: import("../../generated/prisma/enums.js").StatusPagamento;
            valor: import("@prisma/client-runtime-utils").Decimal;
            transacao: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
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
        usuarioId: number;
        unidadeId: number;
        status: import("../../generated/prisma/enums.js").StatusPedido;
        canalPedido: import("../../generated/prisma/enums.js").CanalPedido;
        valorTotal: import("@prisma/client-runtime-utils").Decimal;
        pontosCreditados: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
export {};
//# sourceMappingURL=pagamento.service.d.ts.map