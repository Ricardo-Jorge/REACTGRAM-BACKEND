// Nesse middleware importamos o body, dessa forma teremos acesso ao escopo da requisição(nome, email, senha...)
const { body } = require("express-validator");

// aqui iniciamos a validação dos campos da requisição.
const userCreateValidation = () => {
  return [
    body("name")
      .exists()
      .withMessage("O nome é obrigatório.")
      .isString()
      .withMessage("O nome deve ser uma string")
      .notEmpty()
      .withMessage("O nome não pode estar vazio.")
      .isLength({ min: 3, max: 30 })
      .withMessage("O nome precisa ter entre 3 e 30 caracteres."),
    body("email")
      .exists()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido."),
    body("password")
      .exists()
      .withMessage("A senha é obrigatório.")
      .isLength({ min: 4 })
      .withMessage("A senha precisa ter no mínimo 4 caracteres."),
    body("confirmPassword")
      .exists()
      .withMessage("A confirmção de senha é obrigatória.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas não são iguais.");
        }
        return true;
      }),
  ];
};
// Login Validation
const loginValidation = () => {
  return [
    body("email")
      .exists()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido."),
    body("password").exists().withMessage("A senha é obrigatória."),
  ];
};

// User Update
const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),
    body("password")
      .optional()
      .isLength({ min: 4 })
      .withMessage("A senha precisa ter no mínimo 4 caracteres"),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
