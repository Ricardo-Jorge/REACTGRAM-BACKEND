// Pacote de upload de arquivos
const multer = require("multer");
const path = require("path");

// Destination to store image - Uma função que recebe uma propriedade destination. onde vamos determinar o caminho para endereço da imagem
const imageStorage = multer.diskStorage({
  // Iniciamos uma variavel folder como "vazio" para preencher esse valor de maneira condicional posteriormente, depois determinamos aonde vai ser inserida as imagens baseado em qual caminho das URL da requisição (user ou photos)
  destination: (req, res, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("photos")) {
      folder = "photos";
    }

    // Criação do destino para salvar as imagens
    cb(null, `uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    // Aqui determinamos o nome do arquivo, que basicamente vai ser data de criação + tipo de extenção do arquiivo (jpeg, jpg, png, etc..)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Criamos um filtro que limita o upload de imagens apenas das extenções png e jpg
const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg fprmats
      return cb(new Error("Por favor, envie apenas png ou jpg!"));
    }
    cb(null, true);
  },
});

module.exports = { imageUpload };
