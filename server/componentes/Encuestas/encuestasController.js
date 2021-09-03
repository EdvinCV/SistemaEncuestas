/*
* 
* CONTROLADORES PARA LAS DISTINTAS RUTAS DE USUARIOS
*  
*/
// Express validator
const {validationResult} = require('express-validator');
// UUID
const {v4:uuidv4} = require('uuid');
const db = require("../../config/dbconnection")
// Modelos
const EncabezadoEncuesta = db.encuestas;
const CampoEncuesta = db.campos;
const RespuestaCampo = db.respuestas;
// JWT
const jwt = require('jsonwebtoken');
const { campos, sequelize } = require('../../config/dbconnection');

// Obtener los usuarios existentes en el sistema
exports.getObtenerEncuesta = async (req, res) => {
    try {
        const encuesta = await EncabezadoEncuesta.findOne({
            attributes: ['idEncabezadoEncuesta','nombre','descripcion','link','createdAt'],
            include: [
                {
                    model: CampoEncuesta,
                    as: "CampoEncuesta",
                    attributes: ['idCampoEncuesta','nombre','label','descripcion','tipo','requerido'],
                    where: {
                        estado: true
                    }
                }
            ],
            where: {
                link: req.params.id,
                estado: true
            }
        });
        if(!encuesta){
            res.status(400).json({
                ok: false,
                message: "Encuesta no existente."
            });    
        }else {
            res.status(200).json({
                ok: true,
                data: encuesta
            });
        }

    } catch(error){
        console.log("ERROR AL OBTENER ENCUESTA:",error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error."
        });
    }
}

exports.getObtenerEncuestas = async (req,res) => {
    try {
        const encuesta = await EncabezadoEncuesta.findAll({
            attributes: ['nombre','descripcion','link','createdAt'],
            where: {
                estado: true
            }
        });
        res.status(200).json({
            ok: true,
            data: encuesta
        });
    } catch(error){
        console.log("ERROR AL OBTENER ENCUESTAS:",error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error."
        });
    }
}

// Crear nuevo usuario
exports.createEncuestaController = async (req, res) => {
    // Si existen errores de validación de campos se devuelven.
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    const {campos} = req.body;
    const encuesta = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        link: uuidv4(),
        UsuarioId: req.usuario.id
    }
    try {
        // Verificar que no exista alguna encuesta con el mismo nombre
        const encuestaExistente = await EncabezadoEncuesta.findOne({
            where: {
                nombre: encuesta.nombre
            }
        });
        if(encuestaExistente){
            return res.status(400).json({
                ok: false,
                message:"Ya existe una encuesta con este nombre."
            });
        }
        // Creación de transacción
        const result = await sequelize.transaction(async (t) => {
            const encuestaCreada = await EncabezadoEncuesta.create(encuesta, {transaction: t});
            // Creación de encuesta
            for(const campo of campos){
                const campoCreado = {
                    nombre: campo.nombre,
                    label: campo.label,
                    descripcion: campo.descripcion,
                    tipo: campo.tipo,
                    requerido: campo.requerido,
                    EncabezadoEncuestumIdEncabezadoEncuesta: encuestaCreada.dataValues.idEncabezadoEncuesta
                }        
                await CampoEncuesta.create(campoCreado, {transaction: t});
            }
            return res.status(201).json({
                ok: true,
                message:"Encuesta creada correctamente"
            });
        });        
    }catch(error){
        console.log("ERROR AL CREAR ENCUESTA:",error);
            return res.status(400).json({
                ok: false,
                message:"Ha ocurrido un error"
            });
    }
}

exports.updateEncuestaController = async (req, res) => {
    // Si existen errores se retornan
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const encuesta = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
        }
        // Verificar que no exista la encuesta.
        const encuestaExistente = await EncabezadoEncuesta.findOne({
            where: {
                link: req.params.id,
                estado: true
            }
        });
        if(!encuestaExistente){
            return res.status(400).json({
                ok: false,
                message:"Encuesta no existente."
            });
        }
        // Creación de transacción
        const result = await sequelize.transaction(async (t) => {
            // Buscar la encuesta
            const encuestaEditada = await EncabezadoEncuesta.update(encuesta, {
                where: {
                    link: req.params.id
                }
            });
            console.log("ENCED",encuestaEditada);
            if(encuestaEditada[0] == 1){
                const {campos} = req.body;
                // Actualización de los campos
                for(const campo of campos){
                    const campoCreado = {
                        nombre: campo.nombre,
                        label: campo.label,
                        descripcion: campo.descripcion,
                        tipo: campo.tipo,
                        requerido: campo.requerido,
                        eliminado: campo.eliminado
                    }
                    if(campoCreado.eliminado === true){
                        await RespuestaCampo.destroy({
                            where: {
                                CampoEncuestumIdCampoEncuesta: campo.idCampo
                            }
                        });
                        await CampoEncuesta.destroy({
                            where: {
                                idCampoEncuesta: campo.idCampo
                            }
                        });
                    } else {
                        await CampoEncuesta.update(campoCreado, {
                            where: {
                                idCampoEncuesta: campo.idCampo
                            }
                        });
                    }
                }
                res.status(200).json({
                    ok: true,
                    message: "Encuesta editada correctamente.",
                });
            } else {
                res.status(400).json({
                    ok: false,
                    message: "Usuario no encontrado.",
                });
            }
        });
    } catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error.",
            error
        });
    }
}

// Delete encuesta
exports.deleteEncuestaController = async (req, res) => {
    try {
        // Verificar que la encuesta exista
        const encuesta = await EncabezadoEncuesta.findOne({
            where: {
                link: req.params.id,
                estado: true
            }
        });
        if(!encuesta){
            return res.status(200).json({
                ok: true,
                message: "Encuesta inválida"
            });
        }else {
            encuesta.estado = false;
            await encuesta.save();
            return res.status(200).json({
                ok: true,
                message: "Encuesta eliminada correctamente."
            });
        }
    }catch(error){
        console.log("ERROR AL ELIMINAR ENCUESTA:",error);
        return res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error"
        });
    }
}
