export function permitirPerfis(...perfisPermitidos) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: "NAO_AUTENTICADO",
                message: "Usuário não autenticado.",
            });
        }
        if (!perfisPermitidos.includes(req.user.perfil)) {
            return res.status(403).json({
                error: "ACESSO_NEGADO",
                message: "Você não possui permissão para acessar este recurso.",
            });
        }
        next();
    };
}
//# sourceMappingURL=role.middleware.js.map