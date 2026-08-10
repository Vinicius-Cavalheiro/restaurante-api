import { listarAuditorias } from "../services/auditoria.service.js";
export async function list(req, res) {
    try {
        const auditorias = await listarAuditorias();
        return res.status(200).json({
            auditorias,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "ERRO_INTERNO",
            message: "Erro interno do servidor.",
        });
    }
}
//# sourceMappingURL=auditoria.controller.js.map