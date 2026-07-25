const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const Usuario = require("./database/usuario.model");
const Movimiento = require("./database/movimiento.model");

const srvUri =
  "mongodb+srv://Arce:Sb27.11.22@asistencias.b3qq2et.mongodb.net/SistemaBalance";

console.log("Conectando a MongoDB Atlas con Google DNS...");
mongoose
  .connect(srvUri, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log("✅ Conectado a MongoDB Atlas!");
    const usuarios = await Usuario.find().lean();
    const movimientos = await Movimiento.find().lean();

    const result = [];
    for (const u of usuarios) {
      const movsCount = movimientos.filter(
        (m) =>
          String(m.usuarioId) === String(u._id) ||
          String(m.usuario) === String(u._id)
      ).length;
      result.push({
        id: String(u._id),
        nombre: u.nombre || "Sin Nombre",
        email: (u.email || "").toLowerCase().trim(),
        esPremium: Boolean(u.esPremium),
        creadoEn: u.creadoEn
          ? u.creadoEn.toISOString().split("T")[0]
          : "Desconocido",
        totalMovimientos: movsCount,
      });
    }

    console.log("TOTAL_USUARIOS_FOUND:", result.length);
    console.log("JSON_USERS_DATA_START");
    console.log(JSON.stringify(result));
    console.log("JSON_USERS_DATA_END");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Error conectando a Mongo:", e);
    process.exit(1);
  });
