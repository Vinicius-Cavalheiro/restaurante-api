import express from "express";
import cors from "cors";
import { unidadeRoutes } from "./routes/unidade.routes.js";
import { authRoutes }  from "./routes/auth.routes.js";
import "dotenv/config";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API do sistema de restaurante funcionando!",
  });
});

app.use("/auth", authRoutes);
app.use("/unidades", unidadeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});