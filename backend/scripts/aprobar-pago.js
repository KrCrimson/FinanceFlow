/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/scripts/aprobar-pago.js
 * Capa / módulo ...: Backend · Utilitario de administración
 * Función .........: Script manual que aprueba el pago de un correo y pasa su cuenta al Plan Pro.
 * Requerimientos ..: RF-36  (módulos: Administración)
 * Casos de uso ....: CU-22 Administrar la plataforma
 * Reglas de negocio : RN-17
 * Depende de ......: backend/database/database.js
 *                    backend/database/pago.model.js
 *                    backend/database/usuario.model.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const mongoose = require("mongoose");
const connectDB = require("../database/database");
const Usuario = require("../database/usuario.model");
const Pago = require("../database/pago.model");

const email = process.argv[2];

if (!email) {
  console.error("Uso: node aprobar-pago.js <email_del_usuario>");
  process.exit(1);
}

const run = async () => {
  try {
    await connectDB();

    const user = await Usuario.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.error(`Usuario con email '${email}' no encontrado.`);
      process.exit(1);
    }

    user.esPremium = true;
    user.planTipo = "pro";
    await user.save();

    // Actualizar cualquier pago pendiente del usuario
    await Pago.updateMany(
      { usuario: user._id, estado: "pendiente" },
      { estado: "aprobado", actualizadoEn: new Date() },
    );

    console.log(`\n======================================================`);
    console.log(`🎉 ¡CUENTA PRO ACTIVADA CON ÉXITO!`);
    console.log(`======================================================`);
    console.log(`👤 Usuario: ${user.nombre} (${user.email})`);
    console.log(`⭐ Estado: Premium Pro ACTIVADO (Web y Móvil)`);
    console.log(`======================================================\n`);

    process.exit(0);
  } catch (err) {
    console.error("Error aprobando el pago:", err);
    process.exit(1);
  }
};

run();
