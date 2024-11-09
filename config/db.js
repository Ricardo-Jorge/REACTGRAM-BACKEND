const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// connection
/* Nesta etapa criamos uma variavel conn, uma função asyncrona, e nela utilizamos um método tryCatch,
 e nele criamos uma nova variavel que representa a conecção com a url do banco de dados mongoDB 
 (devemos utilizar as aspas porque vamos buscar a senha e usuario de outro arquivo por segurança )*/
const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.60gjj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Conectou ao banco de dados!");
    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;
