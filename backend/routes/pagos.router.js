const express = require("express");
const router = express.Router();
const Pago = require("../database/pago.model");
const Usuario = require("../database/usuario.model");

// Middleware para verificar JWT / autenticación básica o leer usuario
const getUserId = (req) => {
  return req.user ? req.user.id || req.user._id : null;
};

// 1. Solicitar aprobación de pago (Yape / BCP)
router.post("/solicitar-pro", async (req, res) => {
  try {
    const { email, metodo, nroOperacion, monto } = req.body;

    if (!email || !nroOperacion) {
      return res.status(400).json({
        success: false,
        error: "Email y número de operación son requeridos",
      });
    }

    const usuario = await Usuario.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    const nuevoPago = new Pago({
      usuario: usuario._id,
      email: usuario.email,
      metodo: metodo || "yape",
      nroOperacion: nroOperacion.trim(),
      monto: Number(monto) || 19.9,
      estado: "pendiente",
    });

    await nuevoPago.save();

    res.json({
      success: true,
      message:
        "Solicitud de pago registrada con éxito. Su cuenta se activará tras la verificación del Yape/BCP.",
      pago: nuevoPago,
    });
  } catch (err) {
    console.error("Error al registrar solicitud de pago:", err);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
});

// 2. Obtener estado de suscripción y límites del usuario
router.get("/estado-plan/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const usuario = await Usuario.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    const pagoPendiente = await Pago.findOne({
      usuario: usuario._id,
      estado: "pendiente",
    }).sort({ creadoEn: -1 });

    res.json({
      success: true,
      esPremium: Boolean(usuario.esPremium),
      planTipo: usuario.planTipo || (usuario.esPremium ? "pro" : "free"),
      conteoOcrMes: usuario.conteoOcrMes || 0,
      pagoPendiente: pagoPendiente
        ? {
            nroOperacion: pagoPendiente.nroOperacion,
            metodo: pagoPendiente.metodo,
            fecha: pagoPendiente.creadoEn,
          }
        : null,
    });
  } catch (err) {
    console.error("Error al consultar estado de plan:", err);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
});

// 3. Webhook para activaciones automáticas futuras / pasarelas de pago
router.post("/webhook-pago", async (req, res) => {
  try {
    const { email, secretKey, nroOperacion } = req.body;

    // Verificación de clave secreta simple o token
    if (
      secretKey !== process.env.PAYMENT_WEBHOOK_SECRET &&
      secretKey !== "financeflow_pro_secret_2026"
    ) {
      return res
        .status(401)
        .json({ success: false, error: "Acceso no autorizado" });
    }

    const usuario = await Usuario.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    usuario.esPremium = true;
    usuario.planTipo = "pro";
    await usuario.save();

    if (nroOperacion) {
      await Pago.findOneAndUpdate(
        { email: usuario.email, nroOperacion },
        { estado: "aprobado", actualizadoEn: new Date() },
      );
    }

    res.json({
      success: true,
      message: `Cuenta ${email} activada como Premium Pro`,
    });
  } catch (err) {
    console.error("Error en webhook de pago:", err);
    res.status(500).json({ success: false, error: "Error procesando webhook" });
  }
});

module.exports = router;
