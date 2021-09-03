// Variables .env
require('dotenv').config();
// Morgan
const morgan = require('morgan');
// Express
const express = require('express');
// App
const app = express();
// DB
const db = require('./config/dbconnection');
// Modelos
const Usuario = db.usuarios;
const EncabezadoEncuesta = db.encuestas;
const CampoEncuesta = db.campos;
const RespuestaCampo = db.respuestas;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
// Registro de rutas
app.use('/api/usuario', require('./componentes/Usuarios/usuarioRouter'));
app.use('/api/encuesta', require('./componentes/Encuestas/encuestasRouter'));
app.use('/api/respuestas',require('./componentes/Respuestas/respuestaCampoRouter'));

// Inicialización de la base de datos
//Usuario -> EncabezadoEncuesta
EncabezadoEncuesta.belongsTo(Usuario);
Usuario.hasMany(EncabezadoEncuesta);
// EncabezadoEncuesta -> CampoEncuesta
CampoEncuesta.belongsTo(EncabezadoEncuesta);
EncabezadoEncuesta.hasMany(CampoEncuesta);
// CampoEncuesta -> RespuestaCampo
RespuestaCampo.belongsTo(CampoEncuesta);
CampoEncuesta.hasMany(RespuestaCampo);

db.sequelize.sync().then(async () => {
    console.log("BASE DE DATOS CONECTADA");
});

app.listen(process.env.PORT, (error) => {
    // Si existe un error se finaliza la aplicación
    if(error){
        console.log("ERROR:",error);
        process.exit(1);
    }
    console.log("SERVIDOR CORRIENDO EN PUERTO:",process.env.PORT);
});