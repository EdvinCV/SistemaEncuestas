const express = require('express');
const usuarioRouter = express.Router();
// Express Validator
const {body} = require('express-validator');
const { verifyToken } = require('../../middlewares/autenticacion');
// CONTROLADORES
const { 
    getUsuariosController, 
    createUsuarioController,
    loginUserController,
    updateUsuarioController,
    deleteUsuarioController
} = require('./usuarioController');

// RUTAS USUARIO
usuarioRouter
    .get('/',[verifyToken],getUsuariosController)
    .post('/',[
        body('nombre').isString().not().isEmpty(),
        body('apellido').isString().not().isEmpty(),
        body('username').isString().not().isEmpty(),
        body('password').isString().not().isEmpty()
    ],createUsuarioController)
    .post('/login',[
        body('username').isString().not().isEmpty(),
        body('password').isString().not().isEmpty()
    ],loginUserController)
    .put('/',[verifyToken],[
        body('nombre').isString().not().isEmpty(),
        body('apellido').isString().not().isEmpty(),
        body('username').isString().not().isEmpty()
    ],updateUsuarioController)
    .delete('/:id',[verifyToken],deleteUsuarioController);

module.exports = usuarioRouter;