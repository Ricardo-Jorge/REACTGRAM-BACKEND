require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

// Definição da porta que vai ser rodada a aplicação atraves do arquivo .env utilizando a propriendade process.env que busca um parametro criado no arquivo.
const port = process.env.PORT;
const frontPort = process.env.FRONT_PORT;

// Inicialização do app, através da função express(), e atribuimos ela a variável app.
const app = express();

// config JSON and form data response, configuramos o app para receber dados em ambos formatos, JSON e form data(imagens).
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Solve CORS - quando executamos as requisiçoes pelo mesmo caminho. origin(onde esta vindo a requisição)
app.use(
  cors({
    credentials: true,
    origin: `http://localhost:${frontPort}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Upload directory - utilizamos o express.static, para dizer que nessas pastas vamos utilizar arquivos estaticos
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// DB connection
require("./config/db.js");

// routes
const router = require("./routes/Router.js");

app.use(router);

app.listen(port, () => {
  console.log(`APP rodando na porta ${port}`);
});
