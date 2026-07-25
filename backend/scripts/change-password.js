const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../database/database');
const Usuario = require('../database/usuario.model');

// Leer argumentos
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Uso: node change-password.js <email> <nueva_contraseña>');
  process.exit(1);
}

const run = async () => {
  try {
    await connectDB();
    
    const user = await Usuario.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.error(`Usuario con email ${email} no encontrado.`);
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    console.log(`✅ Contraseña cambiada con éxito para el usuario: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    process.exit(1);
  }
};

run();
