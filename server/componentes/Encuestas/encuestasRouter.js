const express = require('express');
const encuestasRouter = express.Router();
// Express Validator
const {body} = require('express-validator');
const { verifyToken } = require('../../middlewares/autenticacion');
// Controllers
const { 
    getObtenerEncuestas, 
    getObtenerEncuesta,
    createEncuestaController,
    deleteEncuestaController,
    updateEncuestaController,
} = require('./encuestasController');


encuestasRouter
    .get('/',[verifyToken],getObtenerEncuestas)
    .get('/:id',getObtenerEncuesta)
    .post('/',[verifyToken],[
        body('nombre').isString().not().isEmpty(),
        body('campos').isArray().not().isEmpty()
    ],createEncuestaController)
    .put('/:id',[verifyToken], [
        body('nombre').isString().not().isEmpty(),
        body('campos').isArray().not().isEmpty()
    ],updateEncuestaController)
    .delete('/:id',[verifyToken], deleteEncuestaController);

module.exports = encuestasRouter;