const path = require("path"); 
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const indicadoresRoutes = require("./routes/indicadoresNacionais");
const kpisRoutes = require("./routes/indicadoresKPI");
const indicadoresEstadosRoutes = require('./routes/indicadoresEstados');
const indicadoresRegioesRoutes = require('./routes/indicadoresRegioes');
const regioesCarteira = require('./routes/regioesCarteira')


const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/indicadores-nacionais", indicadoresRoutes);
app.use("/", kpisRoutes);
app.use("/", indicadoresEstadosRoutes);
app.use('/regioes', indicadoresRegioesRoutes);
app.use("/regioes", regioesCarteira)

app.get("/", (req, res) => {
  res.json({ message: "API Node.js rodando 🚀" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});