import { Users } from '../models/Users.js';
import { Ids } from '../models/Ids.js';
import bcrypt from 'bcrypt';

const userVerifiedSuccess = async (req, res) =>{
    try {
        const { id } = req.params;

        if(!id){
            return res.status(401).redirect('http://localhost:4200/error/user/created')
        }

        if(typeof id !== 'string'){
            return res.status(401).redirect('http://localhost:4200/error/user/created')
        }

        const token = await Ids.findOne({ where: { idsExpire: id } })
            .catch(err =>{
                console.log(err)
                return res.status(500).redirect('http://localhost:4200/error/user/created')
            })

        if(!token){
            return res.status(404).redirect('http://localhost:4200/error/user/created')
        }

        let pass = bcrypt.hashSync(token.password, 10)
        
        await Users.create({
            name: token.name,
            surname: token.surname,
            age: token.age,
            email: token.email,
            password: pass
        })
            .catch(err => {
                console.log(err)
                return res.status(400).redirect('http://localhost:4200/error/user/created')
            })

        await Ids.destroy({ where: { idsExpire: id } })
            .catch(err =>{
                console.log(err)
                return res.status(500).redirect('http://localhost:4200/error/user/created')
            })

        return res.status(201).redirect('http://localhost:4200/home')

    } catch (error) {
        console.log(error);
        return res.status(500).redirect('http://localhost:4200/error/user/created')
    }
}

export {
    userVerifiedSuccess
}