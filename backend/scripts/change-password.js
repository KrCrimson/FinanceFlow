/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/scripts/change-password.js
 * Capa / módulo ...: Backend · Utilitario de administración
 * Función .........: Script manual que cambia la contraseña de una cuenta.
 * Requerimientos ..: RF-05  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-01
 * Casos de uso ....: CU-04 Restablecer contraseña
 * Depende de ......: backend/database/database.js
 *                    backend/database/usuario.model.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
