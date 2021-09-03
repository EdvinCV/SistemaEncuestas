/**
 * 
 * MODELO ENCABEZADO ENCUESTA: ESTE MODELO PERMITE ALMACENAR LA INFORMACIÓN GENERAL 
 * DE LAS ENCUESTAS COMO EL NOMBRE,DESCRIPCION Y GENERACIÓN DEL LINK DE ACCESO.
 */
module.exports = (sequelize, Sequelize) => {
    const EncabezadoEncuesta = sequelize.define('EncabezadoEncuesta', {
        idEncabezadoEncuesta: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        link: {
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
    return EncabezadoEncuesta;
}