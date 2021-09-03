/*
* 
* CONTROLADORES PARA LAS DISTINTAS RUTAS DE USUARIOS
*  
*/
// Express validator
const {validationResult} = require('express-validator');
// Bcryptjs
const bcrypt = require('bcrypt');
const db = require("../../config/dbconnection")
// Modelos
const Usuario = db.usuarios;
// JWT
const jwt = require('jsonwebtoken');

// Obtener los usuarios existentes en el sistema
exports.getUsuariosController = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            where: {
                estado: true
            }
        });
        res.status(200).json({
            ok: true,
            data: usuarios
        });

    } catch(error){
        console.log("ERROR AL OBTENER USUARIOS:",error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error."
        });
    }
}

// Crear nuevo usuario
exports.createUsuarioController = async (req, res) => {
    // Si existen errores de validación de campos se devuelven.
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    
    let {nombre,apellido, username, password} = req.body;

    // Verificar que el nombre de usuario no exista.
    const usernameEncontrado = await Usuario.findOne({where: {username}});
    if(usernameEncontrado){
        return res.status(400).json({
            ok: false,
            msg: "Nombre de usuario existente."
        });
    }

    // Hash password
    var salt = await bcrypt.genSalt(10);
    password = await bcrypt.hashSync(password, salt);
    // Crear el nuevo usuario
    Usuario.create({nombre,apellido, username, password})
        .then((data) => {
            res.status(200).json({
                ok: true,
                msg: 'Usuario creado correctamente.',
                data: {
                    data
                }
            });
        })
        .catch((error) => {
            console.log("ERROR AL CREAR USUARIO:",error);
            return res.status(400).json({
                ok: false,
                message: "Ha ocurrido un error."
            });
        })
}

// Controlador para loguearse.
exports.loginUserController = async (req, res) => {
    // Si existen errores son devueltos
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    const {username, password} = req.body;
    try {
        // Verificar que el usuario exista
        const usuario = await Usuario.findOne({ where: {username, estado: true} });
        // Si el usuario no existe
        if(!usuario){
            return res.status(400).json({
                ok: false,
                message: "Usuario o contraseña incorrecta."
            });
        }
        // Verificar que la contraseña es correcta
        const valida = bcrypt.compareSync(password, usuario.password);
        if(!valida){
            return res.status(400).json({
                ok: true,
                msg: "Usuario o contraseña incorrecta."
            });
        }
        // Generar nuevo access token
        const access_token = jwt.sign({user: usuario.username, id: usuario.id}, process.env.SECRET_KEY, { expiresIn: "10h" });

        res.status(200).json({
            ok: true,
            msg: "Logueo realizado correctamente.",
            access_token,
            usuario
        });
    } catch (error) {
        console.log("ERROR LOGIN",error);
        return res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error"
        });
    }
}

exports.updateUsuarioController = async (req, res) => {
    // Si existen errores se retornan
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const usuario = {
            nombre: req.body.nombre,
            apellido: req.body.apellido
        }
        // Buscar el producto
        const usuarioEditado = await Usuario.update(usuario, {
            where: {
                username: req.body.username
            }
        });
        if(usuarioEditado[0] == 1){
            res.status(200).json({
                ok: true,
                message: "Usuario editado correctamente.",
            });
        } else {
            res.status(400).json({
                ok: false,
                message: "Usuario no encontrado.",
            });
        }
    } catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error.",
            error
        });
    }
}

exports.deleteUsuarioController = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const usuario = {
            estado: false
        }
        // Buscar el producto
        const usuarioEditado = await Usuario.update(usuario, {
            where: {
                username: req.params.id
            }
        });
        if(usuarioEditado[0] == 1){
            res.status(200).json({
                ok: true,
                message: "Usuario eliminado correctamente.",
            });
        } else {
            res.status(400).json({
                ok: false,
                message: "Usuario no encontrado.",
            });
        }
    } catch(error){
        console.log("ERROR AL ELIMINAR USUARIO:",error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error"
        });
    }
}