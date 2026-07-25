const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const Usuario = require("./database/usuario.model");

const srvUri =
  "mongodb+srv://Arce:Sb27.11.22@asistencias.b3qq2et.mongodb.net/SistemaBalance";

const emailsToKeep = [
  "sebastianarce2010@gmail.com",
  "solangearce1999@gmail.com",
  "votskz.8@gmail.com",
  "rks_19_10@hotmail.com",
  "victorcaceres200170@gmail.com",
  "vickymoon1509@gmail.com",
  "sa2019062986@virtual.upt.pe",
  "linoantonioarcechocano@gmail.com",
  "kcherodelsebas@gmail.com",
  "annelbrq123@gmail.com",
  "diegomoisesmamani167@gmail.com",
  "pene123@gmail.com",
  "pene124@gmail.com",
  "nel@gmail.com",
];

console.log("Conectando a MongoDB Atlas para limpieza de cuentas de prueba...");

mongoose
  .connect(srvUri)
  .then(async () => {
    const res = await Usuario.deleteMany({ email: { $nin: emailsToKeep } });
    console.log(
      "✅ Limpieza completada. Cuentas de prueba eliminadas:",
      res.deletedCount
    );

    const restantes = await Usuario.countDocuments();
    console.log("✅ Total cuentas conservadas en la base de datos:", restantes);

    process.exit(0);
  })
  .catch((e) => {
    console.error("Error en la eliminación:", e);
    process.exit(1);
  });
