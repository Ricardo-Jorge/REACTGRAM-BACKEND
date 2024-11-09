/* Aqui importamos a bibliteca mongoose, e dela buscamos Schema, que é uma forma que esquematizar um objeto, 
neste caso, usuário: nome, email, password... e um segundo paremetro, é o timestamps, que determina quando o usuario foi criado e atualizado. */
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String,
  },
  {
    timestamps: true,
  }
);

// aqui definimos um model(modelo) para User, e passamos para ele o userSchema criado anteriormente.
const User = mongoose.model("User", userSchema);

module.exports = User;
