const express = require("express");
//Aqui chamamos o express e jogamos esse framework na variável router
const router = express();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotoRoutes"));

//teste route
//um teste, utilizando o metodo get(para buscar), e enviamos por uma arrow function uma resposta através do res.send
router.get("/", (req, res) => {
  res.send("API WORKING!");
});

module.exports = router;
