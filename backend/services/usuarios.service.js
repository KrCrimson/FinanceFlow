
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Usuario = require('../database/usuario.model');

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

  // Configuración del transportador de email
  createMailTransporter: () => {
    return nodemailer.createTransport({
      service: 'gmail', // Puedes cambiarlo por otro proveedor
      auth: {
        user: process.env.EMAIL_USER || 'tu-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'tu-contraseña-de-aplicación',
      },
    });
  },

  // Solicitar recuperación de contraseña
  forgotPassword: async (email) => {
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Email inválido');
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
    if (!usuario) {
      throw new Error('No existe un usuario con ese email');
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutos

    // Guardar token en la base de datos
    usuario.resetPasswordToken = resetPasswordToken;
    usuario.resetPasswordExpires = resetPasswordExpires;
    await usuario.save();

    // Configurar email
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3001';
    const resetURL = `${frontendURL}/reset-password?token=${resetToken}`;

    // Verificar si el email está configurado
    const isEmailUnconfigured = !process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
                                 process.env.EMAIL_USER === 'tu-email-real@gmail.com';

    if (isEmailUnconfigured) {
      if (process.env.NODE_ENV === 'development') {
        const fs = require('fs');
        const path = require('path');
        const logMsg = `[${new Date().toISOString()}] Email: ${usuario.email} | URL: ${resetURL}\n`;
        fs.appendFileSync(path.join(__dirname, '../dev_recovery_links.log'), logMsg);
        
        console.log('----------------------------------------------------');
        console.log('🛠️ [MODO DESARROLLO] Enlace de recuperación simulado:');
        console.log(`Email: ${usuario.email}`);
        console.log(`Enlace: ${resetURL}`);
        console.log('----------------------------------------------------');
        
        return { 
          message: 'Simulación de envío activa en modo desarrollo.', 
          devResetUrl: resetURL 
        };
      } else {
        throw new Error('El sistema de email no está configurado. Contacta al administrador.');
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@financeflow.com',
      to: usuario.email,
      subject: '🔐 Recuperación de Contraseña - FinanceFlow',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">🔐 Recuperación de Contraseña</h1>
              <p style="color: #64748b; margin: 10px 0 0 0;">FinanceFlow</p>
            </div>
            
            <p style="color: #334155; font-size: 16px; line-height: 1.5;">
              Hola <strong>${usuario.nombre}</strong>,
            </p>
            
            <p style="color: #334155; font-size: 16px; line-height: 1.5;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú quien hizo esta solicitud, haz clic en el botón de abajo para crear una nueva contraseña:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                🔑 Restablecer Contraseña
              </a>
            </div>
            
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>⚠️ Importante:</strong> Este enlace expirará en 10 minutos por seguridad.
              </p>
            </div>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
              Si no solicitaste restablecer tu contraseña, puedes ignorar este email. Tu contraseña no será modificada.
            </p>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
              Si tienes problemas con el botón, copia y pega este enlace en tu navegador:<br>
              <a href="${resetURL}" style="color: #2563eb; word-break: break-all;">${resetURL}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <div style="text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Este es un email automático, por favor no respondas a este mensaje.
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0;">
                © 2026 FinanceFlow - Sistema de Balance Personal
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Enviar email
    try {
      const transporter = module.exports.createMailTransporter();
      console.log('Enviando email a:', usuario.email);
      console.log('Configuración de email:', {
        service: 'gmail',
        user: process.env.EMAIL_USER ? '***configurado***' : 'NO_CONFIGURADO',
        pass: process.env.EMAIL_PASS ? '***configurado***' : 'NO_CONFIGURADO'
      });
      
      await transporter.sendMail(mailOptions);
      console.log('Email enviado exitosamente a:', usuario.email);
    } catch (error) {
      console.error('Error detallado al enviar email:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      });
      
      // Limpiar token si falla el envío
      usuario.resetPasswordToken = null;
      usuario.resetPasswordExpires = null;
      await usuario.save();
      
      throw new Error(`Error al enviar el email: ${error.message}. Verifica la configuración de EMAIL_USER y EMAIL_PASS.`);
    }

    return { message: 'Email de recuperación enviado exitosamente' };
  },

  // Verificar token de recuperación
  verifyResetToken: async (token) => {
    if (!token) {
      throw new Error('Token requerido');
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const usuario = await Usuario.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!usuario) {
      throw new Error('Token inválido o expirado');
    }

    return { message: 'Token válido' };
  },

  // Resetear contraseña
  resetPassword: async (token, newPassword) => {
    if (!token) {
      throw new Error('Token requerido');
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const usuario = await Usuario.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!usuario) {
      throw new Error('Token inválido o expirado');
    }

    // Actualizar contraseña
    usuario.passwordHash = await bcrypt.hash(newPassword, 10);
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpires = null;
    usuario.actualizadoEn = new Date();
    
    await usuario.save();

    return { message: 'Contraseña actualizada exitosamente' };
  },
};
