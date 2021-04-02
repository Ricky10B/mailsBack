/* eslint-disable no-async-promise-executor */
import jwt from 'jsonwebtoken';
import { SessionDataUsers } from '../models/SessionDataUser.js';

export const createToken = (payload) => {
    return new Promise( async (resolve, reject) =>{
        try {
            if(!payload) return reject('Missing payload');

            let token = jwt.sign(payload, process.env.JSONWEBTOKEN, { expiresIn: 60 * 60 * 24 });

            await SessionDataUsers.create({ token, usuario: payload.userId })

            return resolve(token)

        } catch (error) {
            console.log(error);
            return reject('Unexpected Error');
        }
    })
}

export const verifyToken = (token) =>{
    return new Promise((resolve, reject) =>{
        try {
            if(!token) return reject('Missing token');

            jwt.verify(token, process.env.JSONWEBTOKEN, async (err, decoded) =>{
                if(err){
                    return reject('Token expirado');
                }

                let session = await SessionDataUsers.findOne({ where: { token, usuario: decoded.userId } });
                if(!session){
                    return reject('Unauthorized')
                }

                return resolve(decoded)
            })

        } catch (error) {
            console.log(error);
            return reject('Unexpected Error')
        }
    })
}