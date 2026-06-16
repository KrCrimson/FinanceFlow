// Middleware de autenticación JWT
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';
const Usuario = require('../database/usuario.model');

module.exports = async function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verificar si el usuario ha sido eliminado o desactivado en la base de datos
    const user = await Usuario.findById(decoded.id);
    if (!user || user.estado === 'eliminado' || user.estado === 'inactivo') {
      return res.status(401).json({ error: 'Token inválido o usuario inhabilitado' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
