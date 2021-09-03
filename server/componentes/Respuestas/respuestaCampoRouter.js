const express = require('express');
const respuestasRouter = express.Router();
// Express Validator
const {body} = require('express-validator');
const { verifyToken } = require('../../middlewares/autenticacion');
// Controllers
const { 
    getRespuestas,
    postRespuestas
} = require('./respuestaCampoController');



respuestasRouter
    .get('/:id',[verifyToken],getRespuestas)
    .post('/',[],[
        body('link').isString().not().isEmpty(),
        body('respuestas').isArray().not().isEmpty()
    ],
    postRespuestas);

module.exports = respuestasRouter;