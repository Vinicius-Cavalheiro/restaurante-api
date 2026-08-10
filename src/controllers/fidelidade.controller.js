import { consultarPontos, registrarConsentimentoFidelidade, resgatarPontos, } from "../services/fidelidade.service.js";
export async function consultarSaldo(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: "NAO_AUTENTICADO",
                message: "Usuário não autenticado.",
            });
        }
        const fidelidade = await consultarPontos(req.user.id);
        return res.status(200).json({
            fidelidade: {
                usuarioId: fidelidade.id,
                nome: fidelidade.nome,
                pontos: fidelidade.pontosFidelidade,
                ativa: fidelidade.fidelidadeAtiva,
                consentimentoEm: fidelidade.consentimentoFidelidadeEm,
            },
        });
    }
    catch (error) {
        if (error instanceof Error &&
            error.message === "USUARIO_NAO_ENCONTRADO") {
            return res.status(404).json({
                error: "USUARIO_NAO_ENCONTRADO",
                message: "Usuário não encontrado.",
            });
        }
        console.error(error);
        return res.status(500).json({
            error: "ERRO_INTERNO",
            message: "Erro interno do servidor.",
        });
    }
}
export async function consentirFidelidade(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: "NAO_AUTENTICADO",
                message: "Usuário não autenticado.",
            });
        }
        const fidelidade = await registrarConsentimentoFidelidade(req.user.id);
        return res.status(200).json({
            message: "Consentimento de fidelidade registrado com sucesso.",
            fidelidade,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "USUARIO_NAO_ENCONTRADO") {
                return res.status(404).json({
                    error: "USUARIO_NAO_ENCONTRADO",
                    message: "Usuário não encontrado.",
                });
            }
            if (error.message === "FIDELIDADE_JA_ATIVA") {
                return res.status(409).json({
                    error: "FIDELIDADE_JA_ATIVA",
                    message: "O usuário já possui consentimento ativo para o programa de fidelidade.",
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
export async function resgatar(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: "NAO_AUTENTICADO",
                message: "Usuário não autenticado.",
            });
        }
        const { pontos } = req.body;
        if (pontos === undefined) {
            return res.status(400).json({
                error: "CAMPOS_OBRIGATORIOS",
                message: "A quantidade de pontos é obrigatória.",
            });
        }
        const resultado = await resgatarPontos(req.user.id, Number(pontos));
        return res.status(200).json({
            message: "Pontos resgatados com sucesso.",
            ...resultado,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "USUARIO_NAO_ENCONTRADO") {
                return res.status(404).json({
                    error: "USUARIO_NAO_ENCONTRADO",
                    message: "Usuário não encontrado.",
                });
            }
            if (error.message === "PONTOS_INVALIDOS") {
                return res.status(422).json({
                    error: "PONTOS_INVALIDOS",
                    message: "A quantidade de pontos deve ser um número inteiro maior que zero.",
                });
            }
            if (error.message === "FIDELIDADE_NAO_ATIVA") {
                return res.status(409).json({
                    error: "FIDELIDADE_NAO_ATIVA",
                    message: "O usuário ainda não consentiu com o programa de fidelidade.",
                });
            }
            if (error.message === "PONTOS_INSUFICIENTES") {
                return res.status(409).json({
                    error: "PONTOS_INSUFICIENTES",
                    message: "O usuário não possui pontos suficientes para realizar o resgate.",
                });
            }
            if (error.message ===
                "MINIMO_RESGATE_NAO_ATINGIDO") {
                return res.status(422).json({
                    error: "MINIMO_RESGATE_NAO_ATINGIDO",
                    message: "O resgate mínimo é de 100 pontos.",
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
//# sourceMappingURL=fidelidade.controller.js.map