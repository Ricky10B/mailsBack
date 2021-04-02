import sequelize from 'sequelize';
import db from '../config/database.js';

export const Mails = db.define('mails', {
    userSend: {
        type: sequelize.STRING,
        allowNull: false
    },
    userReceived: {
        type: sequelize.STRING,
        allowNull: false
    },
    message: {
        type: sequelize.STRING,
        allowNull: false
    },
    fecha: {
        type: sequelize.STRING,
        allowNull: false
    },
    leido: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    timestamps: false
})
