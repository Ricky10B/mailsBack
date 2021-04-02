import sequelize from 'sequelize';
import db from '../config/database.js';

export const Users = db.define('users', {
    name: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            is: /^[a-zA-Z]{4,}$/g,
            isAlphanumeric: true
        }
    },
    surname: {
        type: sequelize.STRING,
        allowNull: false,
        is: /^[a-zA-Z]{3,}$/g
    },
    age: {
        type: sequelize.INTEGER,
        allowNull: false,
        is: /^[0-9]{1,}$/g
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            is: /^[\w-!"#$%&+{}_:;'`.,()-@]{6,}$/g
        }
    }
},{
    timestamps: false,
    tableName: 'users'
});