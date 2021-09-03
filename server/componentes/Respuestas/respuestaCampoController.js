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
const RespuestaCampo = db.respuestas;
const EncabezadoEncuesta = db.encuestas;
const CampoEncuesta = db.campos;
const { sequelize } = require('../../config/dbconnection');

exports.getRespuestas = async (req, res) => {
    try {
        const encuestaEncontrada = await EncabezadoEncuesta.findOne({
            where: {
                link: req.params.id,
                estado: true
            }
        });
        if(!encuestaEncontrada){
            res.status(400).json({
                ok: false,
                message: "Encuesta no válida"
            });
        }
        const respuestas = await CampoEncuesta.findAll({
            attributes: ['nombre','label','descripcion'],
            include: [
                {
                    model: EncabezadoEncuesta,
                    as: "EncabezadoEncuestum"
                },
                {
                    attributes: ['respuesta','codigoCliente'],
                    model: RespuestaCampo,
                }
            ],
            where: {
                "$EncabezadoEncuestum.link$": req.params.id
            },
            raw: true,
            nest: true
        });
        const respuestasFormat = respuestas.map((r) => ({
            nombre: r.nombre,
            label: r.label,
            respuesta: r.RespuestaCampos
        }));


        res.status(200).json({
            ok: true,
            data: respuestasFormat
        })
    }catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error"
        });
    }
}

exports.postRespuestas = async (req, res) => {
    // Si existen errores de validación de campos se devuelven.
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    const {respuestas} = req.body;
    try {
        const encuestaEncontrada = await EncabezadoEncuesta.findOne({
            where: {
                link: req.body.link,
                estado: true
            }
        });
        if(!encuestaEncontrada){
            res.status(400).json({
                ok: false,
                message: "Encuesta no válida"
            });
        }
        // Creación de transacción
        await sequelize.transaction(async (t) => {
            // Creación de respuestas
            const codigoCliente = uuidv4();
            for(const respuesta of respuestas){
                const campoEncontrado = await CampoEncuesta.findOne({
                    include: [{
                        model: EncabezadoEncuesta,
                        as: 'EncabezadoEncuestum'
                    }
                    ],
                    where: {
                        idCampoEncuesta: respuesta.idCampo,
                        '$EncabezadoEncuestum.link$': req.body.link
                    }
                });
                if(!campoEncontrado){
                    throw new Error("Campo inválido");
                }
                const respuestaCreada = {
                    respuesta: respuesta.respuesta,
                    codigoCliente,
                    CampoEncuestumIdCampoEncuesta: respuesta.idCampo
                }
                await RespuestaCampo.create(respuestaCreada, {transaction: t});
            }
            return res.status(201).json({
                ok: true,
                message:"Respuestas almacenadas correctamente"
            });
        });        
    }catch(error){
        console.log("ERROR AL CREAR RESPUESTAS:",error);
            return res.status(400).json({
                ok: false,
                message:"Ha ocurrido un error"
            });
    }
}