const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

/* Generate user token - criamos uma função para gerar um token que vai usar como parametro um id criado no sistema, 
com essa id juntamos o segredo criado no nosso arquivo .env e retornamos esse token com um praso de expiração */
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Register user and sign in
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists - vamos verificar se um email ao cadastrar ja existe no banco de daos através do findOne()
  const user = await User.findOne({ email });
  if (user) {
    //no caso desse email já existir no banco de dados retornamos no array de errors a mensagem a seguir.
    res
      .status(422)
      .json({ errors: ["Por favor, utilize e-mail não cadastrado."] });
  }

  // Generate password hash - geramos um salt atraves do bcrypt que serve para "poluir" a senha criada pelo usuário, um conjunto de dados aleatórios, juntamos a senha e criptografamos antes de salvar no banco de dados.
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Create User - criamos um novo usuário utilizando a função do mongoose baseado no Model de User, e em um primeiro momento enviamos ao DB name, email e o passwordHash como o password.
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  // if user was created successfully, return token - Se o novo usuário não for criado, retornamos uma mensagem de erro e identificamos o erro do nosso sistema.
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde."] });
    return;
  }

  // se obtiver sucesso na criação do novo usuário, criamos um user id, e em seguida utilizamos a função anterior de gerar um token com esse novo id.
  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// Sign user in
const login = async (req, res) => {
  // primeiro buscamos o email e a senha da requisição do usuário
  const { email, password } = req.body;

  // Comparamos o email da requisição e buscamos um equiparavel no DB para validação do login
  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }

  // Check if password matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida."] });
    return;
  }

  // Return user with token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

// Get current logged in user
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

// Update an user
const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  // Se o usuário fizer uma requisição de upload de imagem, aqui determinamos que profileImage(do model de user) sera atualizado.
  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  // Aqui retornamos o user da requisição encontrado pela id, menos a password por segurança
  const user = await User.findById(reqUser._id).select("-password");

  // Se o usuário fizer uma requisição de alterção de nome, aqui determinamos que name(do model de user) sera atualizado.
  if (name) {
    user.name = name;
  }

  // Se o usuário fizer uma requisição de alterção de senha, aqui determinamos que password(do model de user) sera atualizado(com o hash)
  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  // Se o usuário fizer uma requisição de alterção de imagem de profile, aqui determinamos que profileImage(do model de user) sera atualizado
  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

// Get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(
      new mongoose.Types.ObjectId(`${id}`)
    ).select("-password");

    // Check if user exists
    if (!user) {
      res.status(400).json({ errors: ["Id de Usuário solicitada incorreta"] });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["Usuário não encontrado!"] });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
