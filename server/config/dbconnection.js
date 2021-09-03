const Sequelize = require('sequelize');

const sequelize = new Sequelize('encuestas', 'buba', 'buba', {
    host: 'localhost',
    dialect: "mysql",
    operatorAliases: false,
    timezone: "-06:00"
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelo Usuarios
db.usuarios = require('../componentes/Usuarios/usuarioModel')(sequelize, Sequelize);
// Modelo Encabezado Encuesta
db.encuestas = require('../componentes/Encuestas/encabezadoEncuestaModel')(sequelize, Sequelize);
// Modelos campos de encuesta
db.campos = require('../componentes/Encuestas/campoEncuestaModel')(sequelize, Sequelize);
// Modelo de respuestas de campos
db.respuestas = require('../componentes/Respuestas/respuestaCampoModel')(sequelize, Sequelize);

module.exports = db;