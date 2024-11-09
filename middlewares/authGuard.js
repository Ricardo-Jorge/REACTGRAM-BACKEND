const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Bearer ofdeiownfuiYikncvdik - aqui separamos o Bearer que não nos interessa do Token se o usuário tiver autorização de login. Requisições que não tem autorização, não tem token.
  const token = authHeader && authHeader.split(" ")[1];

  // check if header has a token - após realizar o split(), verificamos se a requisição possui um token.
  if (!token) return res.status(401).json({ errors: ["Acesso negado."] });

  // Check if token is valid
  try {
    // Aqui jogamos em uma variavel verified uma verificação se o token enviado na requisição é igual ao nosso segredo do arquivo .env, se ele for, o usuário pode ser considerado verificado.
    const verified = jwt.verify(token, jwtSecret);

    // aqui fazemos uma outra verificação buscando pelo id da requisição verificada anteriormente, e ao passar essa requisição retiramos a senha.
    req.user = await User.findById(verified.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ errors: ["Token inválido."] });
  }
};

module.exports = authGuard;
