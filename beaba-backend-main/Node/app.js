import express from "express";
import { sequelize } from "./database/conecta.js";
import routes from "./routes.js";
import { sincroniza_db } from "./database/sincroniza_db.js";
import { criarDadosPadroes } from "./controllers/dadosPadroes.js";
import cors from "cors";

const app = express();
const port = 3300;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.get("/", (req, res) => {
  res.send("Teste");
});

async function conecta_db() {
  try {
    await sequelize
      .authenticate()
      .catch((error) => console.log(error))
      .then(() => console.log("Conectado ao banco de dados com sucesso!"));
    await sincroniza_db()
      .catch((error) => console.log(error))
      .then(() => console.log("Tabelas criadas com sucesso!"));
    await criarDadosPadroes()
      .then(() => console.log("Dados padrões criados com sucesso!"))
      .catch((error) => console.log(error));
  } catch (error) {
    console.error("Erro ao conectar o banco de dados:", error);
  }
}

conecta_db();

app.listen(port, () => {
  console.log(`Servidor Rodando na Porta: ${port}`);
});
