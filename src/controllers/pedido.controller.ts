import type { Request, Response } from "express";
import { criarPedido, 
    atualizarStatusPedido 
 } from "../services/pedido.service.js";

export async function create(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "NAO_AUTENTICADO",
        message: "Usuário não autenticado.",
      });
    }

    const { unidadeId, canalPedido, itens } = req.body;

    if (
      unidadeId === undefined ||
      canalPedido === undefined ||
      itens === undefined
    ) {
      return res.status(400).json({
        error: "CAMPOS_OBRIGATORIOS",
        message: "Unidade, canal e itens são obrigatórios.",
      });
    }

    if (!Number.isInteger(Number(unidadeId)) || Number(unidadeId) <= 0) {
      return res.status(422).json({
        error: "UNIDADE_INVALIDA",
        message: "A unidade informada é inválida.",
      });
    }

    const canaisPermitidos = ["BALCAO", "APP", "DELIVERY"];

    if (!canaisPermitidos.includes(canalPedido)) {
      return res.status(422).json({
        error: "CANAL_INVALIDO",
        message: "O canal deve ser BALCAO, APP ou DELIVERY.",
      });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(422).json({
        error: "PEDIDO_SEM_ITENS",
        message: "O pedido deve possuir pelo menos um item.",
      });
    }

    const pedido = await criarPedido({
      usuarioId: req.user.id,
      unidadeId: Number(unidadeId),
      canalPedido,
      itens,
    });

    return res.status(201).json({
      message: "Pedido criado com sucesso.",
      pedido,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PEDIDO_SEM_ITENS") {
        return res.status(422).json({
          error: "PEDIDO_SEM_ITENS",
          message: "O pedido deve possuir pelo menos um item.",
        });
      }

      if (error.message === "PRODUTO_INVALIDO") {
        return res.status(404).json({
          error: "PRODUTO_INVALIDO",
          message: "Produto não encontrado ou inativo.",
        });
      }

      if (error.message === "QUANTIDADE_INVALIDA") {
        return res.status(422).json({
          error: "QUANTIDADE_INVALIDA",
          message: "A quantidade dos produtos deve ser maior que zero.",
        });
      
    }
        if (error.message === "ESTOQUE_INSUFICIENTE") {
  return res.status(409).json({
    error: "ESTOQUE_INSUFICIENTE",
    message: "Estoque insuficiente para realizar o pedido.",
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
export async function updateStatus(
  req: Request,
  res: Response
) {
  try {
    const pedidoId = Number(req.params.id);

    if (
      !Number.isInteger(pedidoId) ||
      pedidoId <= 0
    ) {
      return res.status(400).json({
        error: "PEDIDO_INVALIDO",
        message: "O ID do pedido é inválido.",
      });
    }

    const { status } = req.body;

    const statusPermitidos = [
      "EM_PREPARO",
      "PRONTO",
      "FINALIZADO",
    ];

    if (!statusPermitidos.includes(status)) {
      return res.status(422).json({
        error: "STATUS_INVALIDO",
        message:
          "O status deve ser EM_PREPARO, PRONTO ou FINALIZADO.",
      });
    }

    const pedido = await atualizarStatusPedido(
      pedidoId,
      status
    );

    return res.status(200).json({
      message: "Status do pedido atualizado com sucesso.",
      pedido,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PEDIDO_NAO_ENCONTRADO") {
        return res.status(404).json({
          error: "PEDIDO_NAO_ENCONTRADO",
          message: "Pedido não encontrado.",
        });
      }

      if (
        error.message ===
        "PEDIDO_AGUARDANDO_PAGAMENTO"
      ) {
        return res.status(409).json({
          error: "PEDIDO_AGUARDANDO_PAGAMENTO",
          message:
            "O pedido precisa ter pagamento aprovado antes de avançar.",
        });
      }

      if (
        error.message ===
        "TRANSICAO_STATUS_INVALIDA"
      ) {
        return res.status(409).json({
          error: "TRANSICAO_STATUS_INVALIDA",
          message:
            "A transição de status solicitada não é permitida.",
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