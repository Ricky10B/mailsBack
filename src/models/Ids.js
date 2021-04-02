import sequelize from 'sequelize';
import db from '../config/database.js';

export const Ids = db.define('ids', {
    idsExpire: {
        type: sequelize.STRING,
        allowNull: false
    },
    nombre: {
        type: sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: sequelize.STRING,
        allowNull: false
    },
    age: {
        type: sequelize.NUMBER,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    pass: {
        type: sequelize.STRING,
        allowNull: false
    }
},{
    timestamps: false,
    tableName: 'ids'
})

let hook= {
    setExpires: (instance, options, done) =>{
        if(instance.get('expires')){
            return done()
        }
        // eslint-disable-next-line no-undef
        instance.set('expires', moment().add(1, 'day'))
        // instance.set('expires', sequelize.literal('NOW() + INTERVAL 1 DAY'))
        return done()
    }
}

Ids.afterCreate(hook.setExpires)