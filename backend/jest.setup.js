const mongoose = require('mongoose');
const Usuario = require('./database/usuario.model');

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
