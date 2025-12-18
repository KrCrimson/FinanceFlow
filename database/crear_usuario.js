const connectDB = require('./database');
const Usuario = require('./usuario.model');

async function crearUsuario() {
  await connectDB();
  const nuevoUsuario = new Usuario({
    nombre: 'sebastian arce',
    email: 'sebastianarce2010@gmail.com',
    passwordHash: 'Sb27.11.22', // En producción, usa un hash seguro
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    estado: 'activo',
  });
  await nuevoUsuario.save();
  console.log('Usuario creado:', nuevoUsuario);
  process.exit(0);
}

crearUsuario();
