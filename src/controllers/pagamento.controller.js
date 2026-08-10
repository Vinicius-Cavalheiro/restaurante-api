import { processarPagamento, } from "../services/pagamento.service.js";
export async function pagar(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: "NAO_AUTENTICADO",
                message: "Usuário não autenticado.",
            });
        }
        const pedidoId = Number(req.params.id);
        if (!Number.isInteger(pedidoId) ||
            pedidoId <= 0) {
            return res.status(400).json({
                error: "PEDIDO_INVALIDO",
                message: "O ID do pedido é inválido.",
            });
        }
        const { metodo, resultado, } = req.body;
        const metodosPermitidos = [
            "PIX",
            "CARTAO",
        ];
        if (!metodosPermitidos.includes(metodo)) {
            return res.status(422).json({
                error: "METODO_INVALIDO",
                message: "O método deve ser PIX ou CARTAO.",
            });
        }
        const resultadosPermitidos = [
            "APROVADO",
            "RECUSADO",
        ];
        if (!resultadosPermitidos.includes(resultado)) {
            return res.status(422).json({
                error: "RESULTADO_INVALIDO",
                message: "O resultado deve ser APROVADO ou RECUSADO.",
            });
        }
        const resultadoPagamento = await processarPagamento({
            pedidoId,
            usuarioId: req.user.id,
            metodo,
            resultado,
        });
        return res.status(200).json({
            message: resultado === "APROVADO"
                ? "Pagamento aprovado com sucesso."
                : "Pagamento recusado.",
            ...resultadoPagamento,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message ===
                "PEDIDO_NAO_ENCONTRADO") {
                return res.status(404).json({
                    error: "PEDIDO_NAO_ENCONTRADO",
                    message: "Pedido não encontrado.",
                });
            }
            if (error.message ===
                "PAGAMENTO_JA_PROCESSADO") {
                return res.status(409).json({
                    error: "PAGAMENTO_JA_PROCESSADO",
                    message: "Este pedido já possui um pagamento processado.",
                });
            }
            if (error.message ===
                "STATUS_PEDIDO_INVALIDO") {
                return res.status(409).json({
                    error: "STATUS_PEDIDO_INVALIDO",
                    message: "O pedido não está disponível para pagamento.",
                });
            }
            if (error.message ===
                "ESTOQUE_INSUFICIENTE") {
                return res.status(409).json({
                    error: "ESTOQUE_INSUFICIENTE",
                    message: "O estoque não é suficiente para confirmar o pedido.",
                });
            }
        }
        console.error(error);
        return res.status(500).json({
            error: "ERRO_INTERNO",
            message: "Erro interno do servidor.",
        });
    }
}
//# sourceMappingURL=pagamento.controller.js.map