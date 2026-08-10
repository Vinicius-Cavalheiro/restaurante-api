import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
const adapter = new PrismaMariaDb({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "restaurante_db",
});
const prisma = new PrismaClient({
    adapter,
});
async function main() {
    console.log("🌱 Iniciando seed...");
    // ==========================================
    // USUÁRIO ADMIN
    // ==========================================
    const senhaAdmin = await bcrypt.hash("Admin@123", 10);
    const admin = await prisma.usuario.upsert({
        where: {
            email: "admin@restaurante.com",
        },
        update: {
            nome: "Administrador",
            perfil: "ADMIN",
            ativo: true,
        },
        create: {
            nome: "Administrador",
            email: "admin@restaurante.com",
            senha: senhaAdmin,
            perfil: "ADMIN",
            ativo: true,
        },
    });
    // ==========================================
    // CLIENTE
    // ==========================================
    const senhaCliente = await bcrypt.hash("Cliente@123", 10);
    const cliente = await prisma.usuario.upsert({
        where: {
            email: "cliente@restaurante.com",
        },
        update: {
            nome: "Cliente Teste",
            perfil: "CLIENTE",
            ativo: true,
        },
        create: {
            nome: "Cliente Teste",
            email: "cliente@restaurante.com",
            senha: senhaCliente,
            perfil: "CLIENTE",
            ativo: true,
        },
    });
    // ==========================================
    // UNIDADE
    // ==========================================
    let unidade = await prisma.unidade.findFirst({
        where: {
            nome: "Restaurante Centro",
        },
    });
    if (!unidade) {
        unidade = await prisma.unidade.create({
            data: {
                nome: "Restaurante Centro",
                endereco: "Rua Principal, 100",
                cidade: "Curitiba",
                ativo: true,
            },
        });
    }
    // ==========================================
    // PRODUTOS
    // ==========================================
    const xBurger = await prisma.produto.upsert({
        where: {
            sku: "LAN-XBURGER-001",
        },
        update: {
            nome: "X-Burger",
            descricao: "Hambúrguer, queijo, molho da casa e pão especial",
            categoria: "Lanches",
            preco: 32.9,
            custo: 12.5,
            ativo: true,
        },
        create: {
            nome: "X-Burger",
            descricao: "Hambúrguer, queijo, molho da casa e pão especial",
            categoria: "Lanches",
            sku: "LAN-XBURGER-001",
            preco: 32.9,
            custo: 12.5,
            ativo: true,
        },
    });
    const refrigerante = await prisma.produto.upsert({
        where: {
            sku: "BEB-REFRI-001",
        },
        update: {
            nome: "Refrigerante",
            descricao: "Refrigerante lata 350ml",
            categoria: "Bebidas",
            preco: 7.5,
            custo: 3,
            ativo: true,
        },
        create: {
            nome: "Refrigerante",
            descricao: "Refrigerante lata 350ml",
            categoria: "Bebidas",
            sku: "BEB-REFRI-001",
            preco: 7.5,
            custo: 3,
            ativo: true,
        },
    });
    // ==========================================
    // ESTOQUE
    // ==========================================
    await prisma.estoque.upsert({
        where: {
            unidadeId_produtoId: {
                unidadeId: unidade.id,
                produtoId: xBurger.id,
            },
        },
        update: {},
        create: {
            unidadeId: unidade.id,
            produtoId: xBurger.id,
            quantidade: 100,
        },
    });
    await prisma.estoque.upsert({
        where: {
            unidadeId_produtoId: {
                unidadeId: unidade.id,
                produtoId: refrigerante.id,
            },
        },
        update: {},
        create: {
            unidadeId: unidade.id,
            produtoId: refrigerante.id,
            quantidade: 100,
        },
    });
    console.log("");
    console.log("✅ Seed concluído com sucesso!");
    console.log("");
    console.log("Usuários de demonstração:");
    console.log("ADMIN   -> admin@restaurante.com / Admin@123");
    console.log("CLIENTE -> cliente@restaurante.com / Cliente@123");
    console.log("");
    console.log(`Unidade: ${unidade.nome} (ID ${unidade.id})`);
    console.log(`Produto: ${xBurger.nome} (ID ${xBurger.id})`);
    console.log(`Produto: ${refrigerante.nome} (ID ${refrigerante.id})`);
}
main()
    .catch((error) => {
    console.error("❌ Erro ao executar seed:");
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map