export declare function consultarPontos(usuarioId: number): Promise<{
    consentimentoFidelidadeEm: Date | null;
    fidelidadeAtiva: boolean;
    id: number;
    nome: string;
    pontosFidelidade: number;
}>;
export declare function registrarConsentimentoFidelidade(usuarioId: number): Promise<{
    consentimentoFidelidadeEm: Date | null;
    fidelidadeAtiva: boolean;
    id: number;
    nome: string;
    pontosFidelidade: number;
}>;
export declare function resgatarPontos(usuarioId: number, pontos: number): Promise<{
    usuario: {
        fidelidadeAtiva: boolean;
        id: number;
        nome: string;
        pontosFidelidade: number;
    };
    resgate: {
        pontosConsumidos: number;
        valorBeneficio: number;
    };
}>;
export declare function creditarPontosPedido(pedidoId: number): Promise<{
    pontosCreditados: number;
    mensagem: string;
    saldoAtual?: never;
} | {
    mensagem?: never;
    pontosCreditados: number;
    saldoAtual: number;
}>;
//# sourceMappingURL=fidelidade.service.d.ts.map