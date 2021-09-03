/**
 * 
 * MODELO USUARIO: ESTE MODELO PERMITE ALMACENAR LA INFORMACIÓN RELACIONADA A 
 * LOS USUARIOS ADMINISTRADORES QUE ACCEDERAN AL SISTEMA PARA CREAR ENCUESTAS.
 */
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('Usuario', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        apellido: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        username: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true
    });
    return User;
}