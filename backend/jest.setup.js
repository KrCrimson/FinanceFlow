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
