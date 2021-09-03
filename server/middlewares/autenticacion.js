// JWT
const jwt = require('jsonwebtoken');
const db = require('../config/dbconnection');
// Modelos
const Usuario = db.usuarios;
/*
* VERIFICAR TOKEN
*/
let verifyToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                message: "Token inválido"
            });
        }
        // Verificar que el usuario sea un usuario existente y activo en la base de datos
        const usuarioEncontrado = await Usuario.findOne({
            where: {
                username: decoded.user,
                estado: true
            }
        });
        if(!usuarioEncontrado){
            return res.status(401).json({
                ok: false,
                message: "Token inválido"
            });
        }
        req.usuario = decoded;
        next();
    });
};

module.exports = {
    verifyToken
};
