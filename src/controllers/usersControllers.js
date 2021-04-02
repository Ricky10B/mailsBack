import { Users } from '../models/Users.js';
import bcrypt from 'bcrypt';
import { sendEmail } from './mailsSendController.js';
import { v4 as uuidv4 } from 'uuid';
import { Ids } from '../models/Ids.js';
import sqlEscape from 'sql-escape';
import { createToken } from '../jwt/jwt.js';
import { SessionDataUsers } from '../models/SessionDataUser.js';

const userRegister = async (req, res) =>{
    try {
        let { name, surname, age, email, password, confirmPassword } = req.body

        if(!name, !surname, !age, !email, !password, !confirmPassword){
            return res.status(400).json({
                ok: false,
                message: 'All fields are required'
            })
        }else{
            if(typeof name !== 'string' || typeof surname !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string'){
                return res.status(401).json({
                    ok: false,
                    message: 'types of data invalid'
                })
            }else{
                name.trim(), surname.trim(), email.trim(), password.trim(), confirmPassword.trim()
                name = sqlEscape(name);
                surname = sqlEscape(surname)
                email = sqlEscape(email)
                password = sqlEscape(password)
                confirmPassword = sqlEscape(confirmPassword)
            }
        }

        if(typeof age !== "number"){
            return res.status(400).json({
                ok: false,
                message: 'Age must be a number'
            })
        }else{
            age = sqlEscape(age);
        }

        let user = await Users.findOne({ where: { email } })
        if(user){
            return res.status(400).json({
                ok: false,
                message: 'User already exists'
            })
        }

        // check if the email looks like an email
        if(!/^[\w-!"#$%&/()'`*_{}+=?:;,.-]{5,}@[\w-]{3,}\.[\w-]{2,}$/.test(email)){
            return res.status(400).json({
                ok: false,
                message: 'The mail format is wrong'
            })
        }

        if(!/^[\w-!"#$%&+{}_:;'`.,()-@]{6,}$/g.test(password)){
            return res.status(400).json({
                ok: false,
                message: 'Invalid password'
            })
        }

        // check length the password
        if(password.length < 6 || confirmPassword < 6){
            return res.status(400).json({
                ok: false,
                message: 'Password length must be at least 6 characters'
            })
        }

        // Check if passwords are the same
        if(password !== confirmPassword){
            return res.status(400).json({
                ok: false,
                message: 'The passwords are not the same'
            })
        }

        /*
         * crear las urls de autenticación con 24 horas habiles
         * al entrar a la url la cuenta se autentica y se crea en la BD
         * y puede iniciar sesion el usuario
        */

        let id = uuidv4()

        // Guardar el id en la BD
        await Ids.create({
            idsExpire: id,
            nombre: name,
            surname,
            age,
            email,
            pass: password
        })
        .catch(err =>{
            console.log(err);
            return res.status(500).json({
                ok: false,
                message: 'Unexpected Error'
            })
        })

        let url = `http://localhost:4200/api/authenticate/${id}`;

       await sendEmail(email, url)
            .catch(err =>{
                return res.status(500).json({
                    ok: false,
                    message: err
                })
            })

        return res.status(200).json({
            ok: true,
            message: 'We have sent you an email to complete the registration'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Unexpected error'
        })
    }
}

const userLogin = async (req, res) =>{
    try {
        let { email, password } = req.body

        if(!email, !password){
            return res.status(400).json({
                ok: false,
                message: 'All fields are required'
            })
        }else{
            email.trim(), password.trim()
            email = sqlEscape(email)
            password = sqlEscape(password)
        }

        // validation the email
        if(!/^[\w-!"#$%&/()=?'´`+*:;.,_{}-]{5,}@[\w-]{4,}\.[\w-]{2,}$/.test(email)){
            return res.status(400).json({
                ok: false,
                message: 'the user does not exist'
            })
        }

        let user = await Users.findOne({ where: { email } })
        if(!user){
            return res.status(404).json({
                ok: false,
                message: 'User does not exist'
            })
        }

        let validPass = /^[\w-!"#$%&+{}_:;'`.,()-@]{6,}$/g.test(password)
        if(!validPass){
            return res.status(400).json({
                ok: false,
                message: 'Password is incorrect'
            })
        }

        let match = bcrypt.compareSync(password, user.password)
        if(!match){
            return res.status(400).json({
                ok: false,
                message: 'Password is incorrect'
            })
        }

        let dataUserSession = {
            userId: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email
        }

        req.session.user = dataUserSession
        
        let token = await createToken(dataUserSession)
            .catch(err =>{
                return res.status(403).json({
                    ok: false,
                    message: err
                })
            })

        return res.status(200).json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Unexpected error'
        })
    }
}

const userLogout = async (req, res) =>{
    try {
        await SessionDataUsers.destroy({
            where: { usuario: req.session.user.userId }
        })

        req.session.destroy();
        res.clearCookie('connect.sid')

        return res.status(200).json({
            ok: true,
            message: 'User Logout'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Ocurrió un error al cerrar la sesión'
        })
    }
}

export {
    userLogin,
    userRegister,
    userLogout
}