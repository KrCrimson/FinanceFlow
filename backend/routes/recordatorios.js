const express = require("express");
const router = express.Router();
const Recordatorio = require("../database/recordatorio.model");
const auth = require("../middlewares/auth");

// Listar todos los recordatorios del usuario
router.get("/", auth, async (req, res) => {
  try {
    const recordatorios = await Recordatorio.find({ userId: req.user.id }).sort({
      fechaVencimiento: 1,
    });
    res.json(recordatorios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un recordatorio
router.post("/", auth, async (req, res) => {
  try {
    const { tipo, descripcion, monto, fechaVencimiento, contacto } = req.body;
    if (!tipo || !descripcion || !monto || !fechaVencimiento) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const nuevo = new Recordatorio({
      userId: req.user.id,
      tipo,
      descripcion,
      monto,
      fechaVencimiento,
      contacto: contacto || "",
      estado: "pendiente",
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cambiar estado o editar
router.put("/:id", auth, async (req, res) => {
  try {
    const { estado, descripcion, monto, fechaVencimiento, contacto } = req.body;
    const recordatorio = await Recordatorio.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!recordatorio) {
      return res.status(404).json({ error: "Recordatorio no encontrado" });
    }

    if (estado !== undefined) recordatorio.estado = estado;
    if (descripcion !== undefined) recordatorio.descripcion = descripcion;
    if (monto !== undefined) recordatorio.monto = monto;
    if (fechaVencimiento !== undefined) recordatorio.fechaVencimiento = fechaVencimiento;
    if (contacto !== undefined) recordatorio.contacto = contacto;

    await recordatorio.save();
    res.json(recordatorio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un recordatorio
router.delete("/:id", auth, async (req, res) => {
  try {
    const recordatorio = await Recordatorio.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!recordatorio) {
      return res.status(404).json({ error: "Recordatorio no encontrado" });
    }

    res.json({ success: true, message: "Recordatorio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
