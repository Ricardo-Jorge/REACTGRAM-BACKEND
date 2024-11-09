const { validationResult } = require("express-validator");

/* Nesse arquivo vamos criar uma validação que poderá ser usada no decorrer do projeto.*/
const validate = (req, res, next) => {
  // aqui usamos a função validationResult que extrai os erros de validação de uma requisição e jogamos na variavel errrors.
  const errors = validationResult(req);

  // se errors estiver "vazio", podemos prosseguir(next())
  if (errors.isEmpty()) {
    return next();
  }

  // no caso de error, criamos um array extractedErrors, mapeamor os erros extraidos, jogamos todas as mensagens de erro no array criado atraves do metodo push.
  const extractedErrors = [];

  errors.array().map((err) => extractedErrors.push(err.msg));

  // por fim, retornamos uma resposta com status 422, que significa a incidencia de erro na requisição, e esse erro é enviado em formato json a atribuimos a errors o nossso array extractedErrors.(esses errors vai ser utilizado futuramente pelo front-end)
  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = validate;
