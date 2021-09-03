/**
 * 
 * MODELO ENCABEZADO ENCUESTA: ESTE MODELO PERMITE ALMACENAR LA INFORMACIÓN GENERAL 
 * DE LAS ENCUESTAS COMO EL NOMBRE,DESCRIPCION Y GENERACIÓN DEL LINK DE ACCESO.
 */
module.exports = (sequelize, Sequelize) => {
    const CampoEncuesta = sequelize.define('CampoEncuesta', {
        idCampoEncuesta: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        label: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        tipo: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        requerido: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true
    });
    return CampoEncuesta;
}