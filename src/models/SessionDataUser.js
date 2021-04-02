import sequelize from 'sequelize';
import db from '../config/database.js';
// import { Users } from './Users.js';

export const SessionDataUsers = db.define('sessionsdatauser', {
    token: {
        type: sequelize.STRING,
        allowNull: false
    },
    usuario: {
        type: sequelize.STRING,
        allowNull: false,
        foreignKey: true
    }
},{
    timestamps: false
})