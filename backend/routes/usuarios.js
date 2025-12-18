const express = require('express');
const router = express.Router();
// Controlador de usuarios se importará aquí
const usuariosController = require('../controllers/usuarios.controller');
const auth = require('../middlewares/auth');

// Ejemplo de endpoint:

// Registro de usuario
router.post('/register', usuariosController.register);
// Login de usuario
router.post('/login', usuariosController.login);
// Rutas protegidas para el perfil del usuario actual
router.get('/me', auth, usuariosController.getProfile);
router.put('/me', auth, usuariosController.updateProfile);
// Crear usuario (legacy)
router.post('/', usuariosController.crearUsuario);
// Listar usuarios
router.get('/', usuariosController.listarUsuarios);
// Editar usuario
router.put('/:id', usuariosController.editarUsuario);
// Inhabilitar usuario
router.patch('/:id/inhabilitar', usuariosController.inhabilitarUsuario);

module.exports = router;
