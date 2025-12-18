
const bcrypt = require('bcryptjs');
const Usuario = require('../../database/usuario.model');

module.exports = {
  // Registro seguro de usuario
  register: async (data) => {
    // Validación robusta
    if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim().length < 2) {
      throw new Error('El nombre es requerido y debe tener al menos 2 caracteres');
    }
    if (!data.email || typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email)) {
      throw new Error('Email inválido');
    }
    if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    const existente = await Usuario.findOne({ email: data.email });
    if (existente) throw new Error('El email ya está registrado');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const usuario = new Usuario({
      nombre: data.nombre.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
      estado: 'activo',
    });
    await usuario.save();
    return {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      estado: usuario.estado,
      creadoEn: usuario.creadoEn,
    };
  },

  // Login seguro de usuario
  login: async (email, password) => {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) throw new Error('Usuario o contraseña incorrectos');
    const ok = await bcrypt.compare(password, usuario.passwordHash);
    if (!ok) throw new Error('Usuario o contraseña incorrectos');
    return {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      estado: usuario.estado,
      creadoEn: usuario.creadoEn,
    };
  },

  crearUsuario: async (data) => {
    // Solo para compatibilidad legacy, no usar en producción
    return module.exports.register(data);
  },

  listarUsuarios: async () => {
    const usuarios = await Usuario.find();
    return usuarios.map(u => ({
      id: u._id,
      nombre: u.nombre,
      email: u.email,
      estado: u.estado,
      creadoEn: u.creadoEn,
    }));
  },

  editarUsuario: async (id, data) => {
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      {
        nombre: data.nombre,
        email: data.email,
        actualizadoEn: new Date(),
      },
      { new: true }
    );
    if (!usuario) throw new Error('Usuario no encontrado');
    return {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      estado: usuario.estado,
      creadoEn: usuario.creadoEn,
    };
  },

  inhabilitarUsuario: async (id) => {
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { estado: 'inactivo', actualizadoEn: new Date() },
      { new: true }
    );
    if (!usuario) throw new Error('Usuario no encontrado');
    return {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      estado: usuario.estado,
      creadoEn: usuario.creadoEn,
    };
  },

  obtenerUsuarioPorId: async (id) => {
    const usuario = await Usuario.findById(id);
    if (!usuario) throw new Error('Usuario no encontrado');
    return {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      estado: usuario.estado,
      creadoEn: usuario.creadoEn,
    };
  },
};
