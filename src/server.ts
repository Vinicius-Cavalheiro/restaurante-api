import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { auditoriaRoutes } from "./routes/auditoria.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { unidadeRoutes } from "./routes/unidade.routes.js";
import { produtoRoutes } from "./routes/produto.routes.js";
import { estoqueRoutes } from "./routes/estoque.routes.js";
import { pedidoRoutes } from "./routes/pedido.routes.js";
import { fidelidadeRoutes } from "./routes/fidelidade.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API do sistema de restaurante funcionando!",
  });
});
app.use("/auditorias", auditoriaRoutes);
app.use("/auth", authRoutes);
app.use("/unidades", unidadeRoutes);
app.use("/produtos", produtoRoutes);
app.use("/estoques", estoqueRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/fidelidade", fidelidadeRoutes);
const PORT = process.env.PORT || 3000;
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});