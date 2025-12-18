// Middleware de validación de datos con Zod
const { z } = require('zod');

function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ error: error.errors || error.message });
    }
  };
}

module.exports = validate;
