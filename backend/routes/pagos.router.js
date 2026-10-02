const express = require("express");
const router = express.Router();
const Pago = require("../database/pago.model");
const Usuario = require("../database/usuario.model");
const auth = require("../middlewares/auth");

// 1. Solicitar aprobación de pago manual (Yape / BCP)
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

// 1.5 Checkout Directo (solo entornos de desarrollo, nunca en producción)
router.post("/checkout-directo", async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, error: "Este endpoint no está disponible en producción" });
  }

  try {
    let { email, metodo, monto } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "El email es requerido" });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    usuario.esPremium = true;
    usuario.planTipo = "pro";
    await usuario.save();

    const nroOpAutogenerado = `AUT-${Date.now().toString().slice(-6)}`;
    const nuevoPago = new Pago({
      usuario: usuario._id,
      email: usuario.email,
      metodo: metodo || "card",
      nroOperacion: nroOpAutogenerado,
      monto: Number(monto) || 19.9,
      estado: "aprobado",
    });
    await nuevoPago.save();

    res.json({
      success: true,
      message: "¡Pago procesado con éxito! Tu cuenta ahora es FinanceFlow Pro.",
      esPremium: true,
      planTipo: "pro",
    });
  } catch (err) {
    console.error("Error en checkout directo:", err);
    res
      .status(500)
      .json({ success: false, error: "Error procesando el pago instantáneo" });
  }
});

// 2. Culqi — cargo directo con tarjeta (token generado por Culqi Checkout.js en el frontend)
router.post("/crear-cargo-culqi", auth, async (req, res) => {
  try {
    const { token, monto, moneda } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: "Falta el token de Culqi (source_id)" });
    }

    const secretKey = process.env.CULQI_SECRET_KEY;
    if (!secretKey) {
      return res.status(503).json({
        success: false,
        error: "Pasarela Culqi no configurada en el servidor (falta CULQI_SECRET_KEY)",
      });
    }

    const usuario = await Usuario.findById(req.user.id);
    if (!usuario) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    const amountInCents = Math.round(Number(monto || 19.9) * 100);

    const culqiRes = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency_code: moneda || "PEN",
        email: usuario.email,
        source_id: token,
      }),
    });
    const culqiData = await culqiRes.json();

    if (!culqiRes.ok) {
      return res.status(402).json({
        success: false,
        error: culqiData.user_message || culqiData.merchant_message || "El cargo fue rechazado por Culqi",
      });
    }

    const paymentId = culqiData.id;
    if (usuario.lastPaymentId !== paymentId) {
      usuario.esPremium = true;
      usuario.planTipo = "pro";
      usuario.lastPaymentId = paymentId;
      await usuario.save();

      const nuevoPago = new Pago({
        usuario: usuario._id,
        email: usuario.email,
        metodo: "culqi",
        nroOperacion: paymentId,
        monto: amountInCents / 100,
        estado: "aprobado",
      });
      await nuevoPago.save();
    }

    res.json({
      success: true,
      message: "¡Pago procesado con éxito! Tu cuenta ahora es FinanceFlow Pro.",
      esPremium: true,
      planTipo: "pro",
    });
  } catch (err) {
    console.error("Error al crear cargo en Culqi:", err);
    res.status(500).json({ success: false, error: "Error interno al procesar el pago con Culqi" });
  }
});

// 3. Alternar Modo Desarrollador (Free <-> Pro)
router.post("/toggle-dev-plan", async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, error: "Este endpoint no está disponible en producción" });
  }

  try {
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "El email es requerido" });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    usuario.esPremium = !usuario.esPremium;
    usuario.planTipo = usuario.esPremium ? "pro" : "free";
    await usuario.save();

    res.json({
      success: true,
      message: `Modo Desarrollador: Tu cuenta ahora es ${usuario.esPremium ? "PRO (Premium)" : "FREE (Gratuita)"}`,
      esPremium: usuario.esPremium,
      planTipo: usuario.planTipo,
    });
  } catch (err) {
    console.error("Error al alternar plan dev:", err);
    res
      .status(500)
      .json({ success: false, error: "Error al alternar modo desarrollador" });
  }
});

// 4. Obtener estado de suscripción (Protegido con auth)
router.get("/estado-plan", auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id);
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

module.exports = router;
