interface ItemPedidoDTO {
    produtoId: number;
    quantidade: number;
}
interface CriarPedidoDTO {
    usuarioId: number;
    unidadeId: number;
    canalPedido: "BALCAO" | "APP" | "DELIVERY";
    itens: ItemPedidoDTO[];
}
export declare function criarPedido(dados: CriarPedidoDTO): Promise<{
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
}>;
type StatusOperacional = "CONFIRMADO" | "EM_PREPARO" | "PRONTO" | "FINALIZADO" | "CANCELADO";
export declare function atualizarStatusPedido(pedidoId: number, novoStatus: StatusOperacional, usuarioId: number): Promise<{
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
}>;
type CanalPedidoFiltro = "BALCAO" | "APP" | "DELIVERY";
export declare function listarPedidos(canalPedido?: CanalPedidoFiltro): Promise<({
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
})[]>;
export {};
//# sourceMappingURL=pedido.service.d.ts.map