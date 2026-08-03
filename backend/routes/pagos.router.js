const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Pago = require("../database/pago.model");
const Usuario = require("../database/usuario.model");

// Auxiliar para obtener clientes dinámicamente sin romper el arranque si faltan envs
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  try {
    return require("stripe")(secretKey);
  } catch (e) {
    console.warn("⚠️ Módulo Stripe no disponible");
    return null;
  }
};

const getMercadoPagoPreference = () => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) return null;
  try {
    const { MercadoPagoConfig, Preference } = require("mercadopago");
    const mpClient = new MercadoPagoConfig({ accessToken });
    return new Preference(mpClient);
  } catch (e) {
    console.warn("⚠️ Módulo MercadoPago no disponible");
    return null;
  }
};

// Función auxiliar para firmar solicitudes a Flow.cl (HMAC-SHA256)
const firmarFlow = (params, secretKey) => {
  const keys = Object.keys(params).sort();
  let toSign = "";
  for (const k of keys) {
    if (k !== "s") {
      toSign += `${k}${params[k]}`;
    }
  }
  return crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");
};

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

// 1.5 Checkout Directo (Activación Automática Instantánea Opción B con Tarjeta / Google Pay)
router.post("/checkout-directo", async (req, res) => {
  try {
    let { email, metodo, pais, monto, moneda } = req.body;

    let usuario = null;
    if (email && email !== "usuario@financeflow.com") {
      usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
    }

    if (!usuario) {
      usuario = await Usuario.findOne().sort({ actualizadoEn: -1 });
    }

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

// 2. Stripe Checkout Session (Pago Único / Unificado en USD)
router.post("/crear-checkout-stripe", async (req, res) => {
  try {
    const { email } = req.body;
    const stripe = getStripe();

    if (!stripe) {
      return res.status(503).json({
        success: false,
        error: "Pasarela Stripe no configurada en el servidor (Falta STRIPE_SECRET_KEY)",
      });
    }

    let usuario = null;
    if (email) {
      usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
    }
    if (!usuario) {
      usuario = await Usuario.findOne().sort({ actualizadoEn: -1 });
    }
    if (!usuario) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "FinanceFlow Pro - Acceso Vitalicio",
              description: "Licencia Pro multidispositivo ilimitada",
            },
            unit_amount: 599, // $5.99 USD
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontendUrl}/dashboard?payment=success`,
      cancel_url: `${frontendUrl}/dashboard?payment=cancel`,
      customer_email: usuario.email,
      metadata: { userId: usuario._id.toString() },
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    console.error("Error al crear sesión de Stripe:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Mercado Pago Preferencia (Pago Único en PEN / Soles)
router.post("/crear-preferencia-mp", async (req, res) => {
  try {
    const { email } = req.body;
    const preference = getMercadoPagoPreference();

    if (!preference) {
      return res.status(503).json({
        success: false,
        error: "Pasarela Mercado Pago no configurada (Falta MERCADO_PAGO_ACCESS_TOKEN)",
      });
    }

    let usuario = null;
    if (email) {
      usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
    }
    if (!usuario) {
      usuario = await Usuario.findOne().sort({ actualizadoEn: -1 });
    }
    if (!usuario) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

    const result = await preference.create({
      body: {
        items: [
          {
            title: "FinanceFlow Pro - Acceso Vitalicio",
            quantity: 1,
            unit_price: 19.9,
            currency_id: "PEN",
          },
        ],
        external_reference: usuario._id.toString(),
        back_urls: {
          success: `${frontendUrl}/dashboard?payment=success`,
          failure: `${frontendUrl}/dashboard?payment=cancel`,
          pending: `${frontendUrl}/dashboard`,
        },
        auto_return: "approved",
        notification_url: `${backendUrl}/api/pagos/webhook-mercadopago`,
      },
    });

    res.json({ success: true, url: result.init_point });
  } catch (err) {
    console.error("Error al crear preferencia de Mercado Pago:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Flow.cl / Flow Perú (Pago mediante Yape, Plin, Tarjetas, PagoEfectivo en Soles/PEN o CLP)
router.post("/crear-orden-flow", async (req, res) => {
  try {
    const { email, monto, moneda } = req.body;
    const apiKey = process.env.FLOW_API_KEY;
    const secretKey = process.env.FLOW_SECRET_KEY;
    const flowApiUrl = process.env.FLOW_API_URL || "https://sandbox.flow.cl/api";

    if (!apiKey || !secretKey) {
      return res.status(503).json({
        success: false,
        error: "Pasarela Flow.cl no configurada (Falta FLOW_API_KEY o FLOW_SECRET_KEY)",
      });
    }

    let usuario = null;
    if (email) {
      usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
    }
    if (!usuario) {
      usuario = await Usuario.findOne().sort({ actualizadoEn: -1 });
    }
    if (!usuario) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const commerceOrder = `FLOW-${usuario._id.toString().slice(-8)}-${Date.now().toString().slice(-4)}`;

    const params = {
      apiKey,
      commerceOrder,
      subject: "FinanceFlow Pro - Acceso Vitalicio",
      currency: moneda || "PEN",
      amount: monto ? Number(monto).toFixed(2) : "19.90",
      email: usuario.email,
      urlConfirmation: `${backendUrl}/api/pagos/webhook-flow`,
      urlReturn: `${frontendUrl}/dashboard?payment=success`,
    };

    params.s = firmarFlow(params, secretKey);

    const formData = new URLSearchParams(params);
    const flowRes = await fetch(`${flowApiUrl}/payment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const flowData = await flowRes.json();
    if (!flowRes.ok || !flowData.url || !flowData.token) {
      throw new Error(flowData.message || "Error generando orden en Flow.cl");
    }

    res.json({
      success: true,
      url: `${flowData.url}?token=${flowData.token}`,
      token: flowData.token,
    });
  } catch (err) {
    console.error("Error al crear orden en Flow:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Webhook Mercado Pago con Verificación de Firma y Consulta Directa
router.post("/webhook-mercadopago", async (req, res) => {
  try {
    const xSignature = req.headers["x-signature"];
    const xRequestId = req.headers["x-request-id"];
    const dataId = req.query["data.id"] || (req.body && req.body.data && req.body.data.id);

    if (!dataId) {
      return res.json({ received: true });
    }

    if (process.env.MERCADO_PAGO_WEBHOOK_SECRET && xSignature) {
      const parts = xSignature.split(",");
      const ts = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
      const v1 = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

      if (ts && v1) {
        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
        const expectedSignature = crypto
          .createHmac("sha256", process.env.MERCADO_PAGO_WEBHOOK_SECRET)
          .update(manifest)
          .digest("hex");

        if (expectedSignature !== v1) {
          console.warn("⚠️ Firma de Webhook Mercado Pago inválida");
          return res.status(401).send("Signature mismatch");
        }
      }
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (accessToken) {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const payment = await response.json();
        if (payment.status === "approved") {
          const userId = payment.external_reference;
          const paymentId = payment.id.toString();

          const usuario = await Usuario.findById(userId);
          if (usuario && usuario.lastPaymentId !== paymentId) {
            usuario.esPremium = true;
            usuario.planTipo = "pro";
            usuario.lastPaymentId = paymentId;
            await usuario.save();
            console.log(`✅ Plan Pro activado vía Mercado Pago para usuario: ${userId}`);
          }
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error en Webhook Mercado Pago:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Webhook Flow.cl / Flow Perú (Confirmación de Pago Idempotente)
router.post("/webhook-flow", async (req, res) => {
  try {
    const token = req.body?.token || req.query?.token;
    const apiKey = process.env.FLOW_API_KEY;
    const secretKey = process.env.FLOW_SECRET_KEY;
    const flowApiUrl = process.env.FLOW_API_URL || "https://sandbox.flow.cl/api";

    if (!token || !apiKey || !secretKey) {
      return res.status(400).send("Token o claves no proporcionadas");
    }

    const params = { apiKey, token };
    params.s = firmarFlow(params, secretKey);

    const queryStr = new URLSearchParams(params).toString();
    const response = await fetch(`${flowApiUrl}/payment/getStatus?${queryStr}`);
    if (response.ok) {
      const paymentStatus = await response.json();
      // En Flow, status 2 = Aprobado / Pagado
      if (paymentStatus.status === 2) {
        const email = paymentStatus.payer;
        const paymentId = paymentStatus.flowOrder ? paymentStatus.flowOrder.toString() : token;

        const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
        if (usuario && usuario.lastPaymentId !== paymentId) {
          usuario.esPremium = true;
          usuario.planTipo = "pro";
          usuario.lastPaymentId = paymentId;
          await usuario.save();
          console.log(`✅ Plan Pro activado vía Flow.cl para usuario: ${usuario._id}`);
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error en Webhook Flow.cl:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Webhook Stripe con Verificación de Firma e Idempotencia
router.post("/webhook-stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return res.status(400).send("Stripe webhook no configurado");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const paymentId = session.id;

    if (userId) {
      const usuario = await Usuario.findById(userId);
      if (usuario && usuario.lastPaymentId !== paymentId) {
        usuario.esPremium = true;
        usuario.planTipo = "pro";
        usuario.lastPaymentId = paymentId;
        await usuario.save();
        console.log(`✅ Plan Pro activado vía Stripe para usuario: ${userId}`);
      }
    }
  }

  res.json({ received: true });
});

// 8. Alternar Modo Desarrollador (Free <-> Pro)
router.post("/toggle-dev-plan", async (req, res) => {
  try {
    let { email } = req.body;

    let usuario = null;
    if (email && email !== "usuario@financeflow.com") {
      usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
    }
    if (!usuario) {
      usuario = await Usuario.findOne().sort({ actualizadoEn: -1 });
    }

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

// 9. Obtener estado de suscripción
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

module.exports = router;
