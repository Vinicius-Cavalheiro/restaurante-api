import { criarProduto, listarProdutos, buscarProdutoPorId, buscarProdutoPorSku, atualizarProduto, excluirProduto, } from "../services/produto.service.js";
export async function create(req, res) {
    try {
        const { nome, descricao, categoria, sku, preco, custo, } = req.body;
        if (!nome || !categoria || !sku || preco == null || custo == null) {
            return res.status(400).json({
                error: "CAMPOS_OBRIGATORIOS",
                message: "Nome, categoria, SKU, preço e custo são obrigatórios.",
            });
        }
        if (Number(preco) < 0 || Number(custo) < 0) {
            return res.status(422).json({
                error: "VALOR_INVALIDO",
                message: "Preço e custo não podem ser negativos.",
            });
        }
        const produtoExistente = await buscarProdutoPorSku(sku);
        if (produtoExistente) {
            return res.status(409).json({
                error: "SKU_JA_CADASTRADO",
                message: "Já existe um produto com este SKU.",
            });
        }
        const produto = await criarProduto({
            nome,
            descricao,
            categoria,
            sku,
            preco: Number(preco),
            custo: Number(custo),
        });
        return res.status(201).json({
            message: "Produto cadastrado com sucesso.",
            produto,
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
export async function list(req, res) {
    try {
        const produtos = await listarProdutos();
        return res.status(200).json({
            produtos,
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
export async function getById(req, res) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                error: "ID_INVALIDO",
                message: "O ID informado é inválido.",
            });
        }
        const produto = await buscarProdutoPorId(id);
        if (!produto) {
            return res.status(404).json({
                error: "PRODUTO_NAO_ENCONTRADO",
                message: "Produto não encontrado.",
            });
        }
        return res.status(200).json({
            produto,
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
export async function update(req, res) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                error: "ID_INVALIDO",
                message: "O ID informado é inválido.",
            });
        }
        const produtoExistente = await buscarProdutoPorId(id);
        if (!produtoExistente) {
            return res.status(404).json({
                error: "PRODUTO_NAO_ENCONTRADO",
                message: "Produto não encontrado.",
            });
        }
        const { nome, descricao, categoria, sku, preco, custo, ativo, } = req.body;
        if ((preco !== undefined && Number(preco) < 0) ||
            (custo !== undefined && Number(custo) < 0)) {
            return res.status(422).json({
                error: "VALOR_INVALIDO",
                message: "Preço e custo não podem ser negativos.",
            });
        }
        if (sku && sku !== produtoExistente.sku) {
            const produtoComSku = await buscarProdutoPorSku(sku);
            if (produtoComSku) {
                return res.status(409).json({
                    error: "SKU_JA_CADASTRADO",
                    message: "Já existe um produto com este SKU.",
                });
            }
        }
        const dadosAtualizacao = {};
        if (nome !== undefined) {
            dadosAtualizacao.nome = nome;
        }
        if (descricao !== undefined) {
            dadosAtualizacao.descricao = descricao;
        }
        if (categoria !== undefined) {
            dadosAtualizacao.categoria = categoria;
        }
        if (sku !== undefined) {
            dadosAtualizacao.sku = sku;
        }
        if (preco !== undefined) {
            dadosAtualizacao.preco = Number(preco);
        }
        if (custo !== undefined) {
            dadosAtualizacao.custo = Number(custo);
        }
        if (ativo !== undefined) {
            dadosAtualizacao.ativo = ativo;
        }
        const produto = await atualizarProduto(id, dadosAtualizacao);
        return res.status(200).json({
            message: "Produto atualizado com sucesso.",
            produto,
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
export async function remove(req, res) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                error: "ID_INVALIDO",
                message: "O ID informado é inválido.",
            });
        }
        const produto = await buscarProdutoPorId(id);
        if (!produto) {
            return res.status(404).json({
                error: "PRODUTO_NAO_ENCONTRADO",
                message: "Produto não encontrado.",
            });
        }
        await excluirProduto(id);
        return res.status(200).json({
            message: "Produto excluído com sucesso.",
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
//# sourceMappingURL=produto.controller.js.map