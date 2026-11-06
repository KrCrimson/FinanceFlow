/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/jest.setup.js
 * Capa / módulo ...: Backend · Configuración de pruebas
 * Función .........: Prepara el entorno (variables y datos de prueba) antes de cada ejecución de pruebas.
 * Calidad (RNF) ...: RNF-13
 * Depende de ......: backend/database/usuario.model.js
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const mongoose = require('mongoose');
const Usuario = require('./database/usuario.model');

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecretkey1234567890';

beforeEach(() => {
  if (!jest.isMockFunction(Usuario.findById)) {
    jest.spyOn(Usuario, 'findById').mockImplementation((id) => {
      if (!id) return Promise.resolve(null);
      return Promise.resolve({
        _id: id,
        nombre: 'Default Test User',
        email: 'test@user.com',
        estado: 'activo',
        esPremium: false
      });
    });
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
