const express = require("express");
const cors = require("cors");
const indicadoresRoutes = require("./routes/indicadoresNacionais");

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/indicadores-nacionais", indicadoresRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Node.js rodando 🚀" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});