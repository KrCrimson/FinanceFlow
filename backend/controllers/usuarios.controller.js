// Controlador de usuarios (esqueleto)
const usuariosService = require('../services/usuarios.service');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

module.exports = {
    // Registro de usuario
    register: async (req, res) => {
      try {
        const usuario = await usuariosService.register(req.body);
        res.status(201).json(usuario);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },

    // Login de usuario
    login: async (req, res) => {
      try {
        const { email, password } = req.body;
        const usuario = await usuariosService.login(email, password);
        // Generar JWT con más información del usuario
        const token = jwt.sign({ 
          id: usuario._id || usuario.id,
          email: usuario.email,
          nombre: usuario.nombre
        }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, usuario });
      } catch (error) {
        res.status(401).json({ message: error.message });
      }
    },
  crearUsuario: async (req, res) => {
    try {
      const usuario = await usuariosService.crearUsuario(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  listarUsuarios: async (req, res) => {
    try {
      const usuarios = await usuariosService.listarUsuarios();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  editarUsuario: async (req, res) => {
    try {
      const usuario = await usuariosService.editarUsuario(req.params.id, req.body);
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  inhabilitarUsuario: async (req, res) => {
    try {
      const usuario = await usuariosService.inhabilitarUsuario(req.params.id);
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Obtener perfil del usuario actual
  getProfile: async (req, res) => {
    try {
      const usuario = await usuariosService.obtenerUsuarioPorId(req.user.id);
      res.json(usuario);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // Actualizar perfil del usuario actual
  updateProfile: async (req, res) => {
    try {
      const usuario = await usuariosService.editarUsuario(req.user.id, req.body);
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Eliminar perfil del usuario actual (borrado lógico)
  deleteProfile: async (req, res) => {
    try {
      const usuario = await usuariosService.eliminarUsuario(req.user.id);
      res.json({ message: 'Cuenta eliminada exitosamente', usuario });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Solicitar recuperación de contraseña
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const origin = req.headers.origin || req.headers.referer;
      const result = await usuariosService.forgotPassword(email, origin);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Verificar token de recuperación
  verifyResetToken: async (req, res) => {
    try {
      const { token } = req.body;
      await usuariosService.verifyResetToken(token);
      res.json({ message: 'Token válido' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Resetear contraseña
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      await usuariosService.resetPassword(token, newPassword);
      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
