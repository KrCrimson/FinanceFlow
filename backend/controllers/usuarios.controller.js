/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/controllers/usuarios.controller.js
 * Capa / módulo ...: Backend · Controladores
 * Función .........: Recibe las solicitudes de cuenta y de verificación en dos pasos; con MFA activo el inicio de sesión entrega solo un token temporal de 5 minutos y la sesión de 7 días se emite al verificar el código.
 * Requerimientos ..: RF-01, RF-02, RF-04, RF-05, RF-07, RF-08, RF-41, RF-42, RF-43, RF-44  (módulos: Cuenta, Perfil)
 * Calidad (RNF) ...: RNF-01, RNF-02
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-12 Gestionar información de perfil
 *                    CU-18 Eliminar cuenta
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-01, RN-07, RN-09, RN-20, RN-23, RN-26, RN-28
 * Depende de ......: backend/services/usuarios.service.js
 * Lo usan .........: backend/routes/usuarios.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Controlador de usuarios (esqueleto)
const usuariosService = require('../services/usuarios.service');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-jwt-secret-32-chars-minimum-key' : undefined);

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
        const id = usuario._id || usuario.id;
        // Con verificación en dos pasos activa NO se abre sesión todavía: se entrega un token temporal (5 min)
        // que solo sirve para el paso 2 (/login/mfa) y que el middleware de sesión rechaza.
        if (usuario.mfaActivo) {
          const mfaToken = jwt.sign({ id, tipo: 'mfa' }, JWT_SECRET, { expiresIn: '5m' });
          return res.json({ mfaRequerido: true, mfaToken });
        }
        // Generar JWT con más información del usuario (mfa:false = sesión sin segundo factor)
        const token = jwt.sign({
          id,
          email: usuario.email,
          nombre: usuario.nombre,
          mfa: false
        }, JWT_SECRET, { expiresIn: '7d' });
        // Un administrador sin MFA entra, pero no puede usar el portal hasta activarlo (lo exige isAdmin)
        res.json({ token, usuario, mfaObligatorioPendiente: Boolean(usuario.esAdmin) });
      } catch (error) {
        res.status(401).json({ message: error.message });
      }
    },

    // Paso 2 del inicio de sesión con verificación en dos pasos
    loginMfa: async (req, res) => {
      try {
        const { mfaToken, codigo } = req.body;
        let decodificado;
        try {
          decodificado = jwt.verify(mfaToken, JWT_SECRET);
        } catch (_) {
          return res.status(401).json({ message: 'La verificación expiró. Inicie sesión de nuevo' });
        }
        if (!decodificado || decodificado.tipo !== 'mfa' || !decodificado.id) {
          return res.status(401).json({ message: 'La verificación expiró. Inicie sesión de nuevo' });
        }
        const resultado = await usuariosService.mfaVerificarLogin(decodificado.id, codigo);
        const usuario = await usuariosService.obtenerUsuarioPorId(decodificado.id);
        const token = jwt.sign({
          id: decodificado.id,
          email: usuario.email,
          nombre: usuario.nombre,
          mfa: true
        }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, usuario, metodo: resultado.metodo, codigosRestantes: resultado.codigosRestantes });
      } catch (error) {
        res.status(401).json({ message: error.message });
      }
    },

    // Activación y desactivación del MFA desde el perfil
    mfaConfigurar: async (req, res) => {
      try {
        res.json(await usuariosService.mfaIniciarConfiguracion(req.user.id));
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },

    mfaActivar: async (req, res) => {
      try {
        const { codigosRecuperacion } = await usuariosService.mfaActivar(req.user.id, req.body.codigo);
        const usuario = await usuariosService.obtenerUsuarioPorId(req.user.id);
        // La sesión actual pasa a ser una sesión con segundo factor (el usuario acaba de demostrarlo)
        const token = jwt.sign({ id: req.user.id, email: usuario.email, nombre: usuario.nombre, mfa: true }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, usuario, codigosRecuperacion });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },

    mfaDesactivar: async (req, res) => {
      try {
        res.json(await usuariosService.mfaDesactivar(req.user.id, req.body.password, req.body.codigo));
      } catch (error) {
        res.status(400).json({ message: error.message });
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
