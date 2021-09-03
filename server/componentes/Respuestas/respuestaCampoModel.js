/**
 * 
 * MODELO ENCABEZADO ENCUESTA: ESTE MODELO PERMITE ALMACENAR LA INFORMACIÓN GENERAL 
 * DE LAS ENCUESTAS COMO EL NOMBRE,DESCRIPCION Y GENERACIÓN DEL LINK DE ACCESO.
 */
module.exports = (sequelize, Sequelize) => {
    const RespuestaCampo = sequelize.define('RespuestaCampo', {
        idRespuestaCampo: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        respuesta: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        codigoCliente: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true
    });
    return RespuestaCampo;
}