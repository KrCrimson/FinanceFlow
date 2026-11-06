/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/usuarios.service.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de usuarios.service: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-01, RF-02, RF-04, RF-05, RF-07, RF-08, RF-16, RF-33, RF-40  (módulos: Cuenta, Perfil, Comprobantes, Plan Pro, Cierres)
 * Calidad (RNF) ...: RNF-01
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-12 Gestionar información de perfil
 *                    CU-18 Eliminar cuenta
 *                    CU-19 Contratar el Plan Pro
 * Reglas de negocio : RN-01, RN-09, RN-15, RN-20, RN-23, RN-24
 * Depende de ......: backend/database/usuario.model.js
 *                    backend/services/usuarios.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const bcrypt = require('bcryptjs');
const Usuario = require('../database/usuario.model');
const usuariosService = require('../services/usuarios.service');

const usuarioDoc = (extra = {}) => ({
  _id: 'u1',
  nombre: 'Ana',
  email: 'ana@test.com',
  estado: 'activo',
  fondoFijo: 1000,
  creadoEn: new Date('2026-01-01'),
  ...extra,
});

afterEach(() => jest.restoreAllMocks());

describe('usuarios.service - register', () => {
  beforeEach(() => {
    jest.spyOn(Usuario, 'findOne').mockResolvedValue(null);
    jest.spyOn(Usuario.prototype, 'save').mockResolvedValue();
  });

  it.each([
    [{ nombre: 'A' }, /nombre/i],
    [{ nombre: undefined }, /nombre/i],
    [{ email: 'sin-arroba' }, /Email inválido/],
    [{ email: undefined }, /Email inválido/],
    [{ password: '12345' }, /al menos 6 caracteres/],
    [{ password: undefined }, /al menos 6 caracteres/],
  ])('rechaza datos inválidos %j', async (cambio, mensaje) => {
    const data = { nombre: 'Ana', email: 'ana@test.com', password: 'secreta1', ...cambio };
    await expect(usuariosService.register(data)).rejects.toThrow(mensaje);
    expect(Usuario.prototype.save).not.toHaveBeenCalled();
  });

  it('rechaza un email ya registrado', async () => {
    Usuario.findOne.mockResolvedValue(usuarioDoc());
    await expect(
      usuariosService.register({ nombre: 'Ana', email: 'ana@test.com', password: 'secreta1' })
    ).rejects.toThrow('ya está registrado');
  });

  it('guarda la contraseña con hash, normaliza el email y no la devuelve', async () => {
    const r = await usuariosService.register({ nombre: '  Ana  ', email: ' Ana@Test.com ', password: 'secreta1' });
    expect(Usuario.prototype.save).toHaveBeenCalledTimes(1);
    expect(r.email).toBe('ana@test.com');
    expect(r.nombre).toBe('Ana');
    expect(r.estado).toBe('activo');
    expect(r).not.toHaveProperty('passwordHash');
    expect(r).not.toHaveProperty('password');
  });
});

describe('usuarios.service - login', () => {
  let hash;
  beforeAll(async () => {
    hash = await bcrypt.hash('secreta1', 4);
  });

  it('inicia sesión con credenciales correctas y no expone el hash', async () => {
    jest.spyOn(Usuario, 'findOne').mockResolvedValue(usuarioDoc({ passwordHash: hash }));
    const r = await usuariosService.login('ana@test.com', 'secreta1');
    expect(r.email).toBe('ana@test.com');
    expect(r).not.toHaveProperty('passwordHash');
  });

  it('rechaza una contraseña incorrecta con un mensaje genérico', async () => {
    jest.spyOn(Usuario, 'findOne').mockResolvedValue(usuarioDoc({ passwordHash: hash }));
    await expect(usuariosService.login('ana@test.com', 'mala')).rejects.toThrow('Usuario o contraseña incorrectos');
  });

  it('rechaza un correo inexistente con el mismo mensaje (no revela si la cuenta existe)', async () => {
    jest.spyOn(Usuario, 'findOne').mockResolvedValue(null);
    await expect(usuariosService.login('nadie@test.com', 'x')).rejects.toThrow('Usuario o contraseña incorrectos');
  });

  it('una cuenta eliminada no puede iniciar sesión aunque la contraseña sea correcta', async () => {
    jest.spyOn(Usuario, 'findOne').mockResolvedValue(usuarioDoc({ passwordHash: hash, estado: 'eliminado' }));
    await expect(usuariosService.login('ana@test.com', 'secreta1')).rejects.toThrow('Usuario o contraseña incorrectos');
  });
});

describe('usuarios.service - eliminación de cuenta (Sprint 7)', () => {
  it('marca la cuenta como eliminada (borrado lógico) y no la borra físicamente', async () => {
    const upd = jest
      .spyOn(Usuario, 'findByIdAndUpdate')
      .mockResolvedValue(usuarioDoc({ estado: 'eliminado' }));
    const del = jest.spyOn(Usuario, 'findByIdAndDelete').mockResolvedValue(null);
    const r = await usuariosService.eliminarUsuario('u1');
    expect(upd.mock.calls[0][1]).toMatchObject({ estado: 'eliminado' });
    expect(del).not.toHaveBeenCalled();
    expect(r.estado).toBe('eliminado');
    expect(r).not.toHaveProperty('passwordHash');
  });

  it('falla si el usuario no existe', async () => {
    jest.spyOn(Usuario, 'findByIdAndUpdate').mockResolvedValue(null);
    await expect(usuariosService.eliminarUsuario('nope')).rejects.toThrow('Usuario no encontrado');
  });
});

describe('usuarios.service - edición e inhabilitación', () => {
  it('editarUsuario actualiza solo los campos enviados y convierte el fondo fijo a número', async () => {
    const upd = jest.spyOn(Usuario, 'findByIdAndUpdate').mockResolvedValue(usuarioDoc({ fondoFijo: 1500 }));
    const r = await usuariosService.editarUsuario('u1', { fondoFijo: '1500' });
    const payload = upd.mock.calls[0][1];
    expect(payload.fondoFijo).toBe(1500);
    expect(payload).not.toHaveProperty('nombre');
    expect(r.fondoFijo).toBe(1500);
  });

  it('editarUsuario falla si no existe', async () => {
    jest.spyOn(Usuario, 'findByIdAndUpdate').mockResolvedValue(null);
    await expect(usuariosService.editarUsuario('x', { nombre: 'N' })).rejects.toThrow('Usuario no encontrado');
  });

  it('inhabilitarUsuario deja la cuenta como inactiva', async () => {
    const upd = jest.spyOn(Usuario, 'findByIdAndUpdate').mockResolvedValue(usuarioDoc({ estado: 'inactivo' }));
    const r = await usuariosService.inhabilitarUsuario('u1');
    expect(upd.mock.calls[0][1]).toMatchObject({ estado: 'inactivo' });
    expect(r.estado).toBe('inactivo');
  });

  it('listarUsuarios no incluye datos sensibles', async () => {
    jest.spyOn(Usuario, 'find').mockResolvedValue([usuarioDoc({ passwordHash: 'secreto' })]);
    const r = await usuariosService.listarUsuarios();
    expect(r).toHaveLength(1);
    expect(r[0]).not.toHaveProperty('passwordHash');
  });

  it('obtenerUsuarioPorId falla si no existe', async () => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue(null);
    await expect(usuariosService.obtenerUsuarioPorId('x')).rejects.toThrow('Usuario no encontrado');
  });
});
