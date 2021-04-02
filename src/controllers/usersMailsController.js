import { Users } from '../models/Users.js';
import { Mails } from '../models/Mails.js';
import sqlEscape from 'sql-escape';
import htmlspecialchars from 'htmlspecialchars';
import sequelize from 'sequelize';
const { Op } = sequelize;

export const sendMailsUsers = async (req, res) =>{
    try {
        let { email, message } = req.body;

        if(!email || !message){
            return res.status(400).json({
                ok: false,
                message: 'All data is requried'
            })
        }else{
            email = sqlEscape(email.trim())
            message = sqlEscape(message.trim())
            email = htmlspecialchars(email)
            message = htmlspecialchars(message)
        }

        let userReceived = await Users.findOne({ where: { email } })

        if(!userReceived){
            return res.status(404).json({
                ok: false,
                message: 'There is no user with that email'
            })
        }

        let fecha = new Date().toString();
        let mail = await Mails.create({ userSend: req.session.user.email, userReceived: email, message, fecha, leido: false })

        if(!mail){
            return res.status(500).json({
                ok: false,
                message: 'an error ocurred while saving the mail'
            })
        }

        return res.status(200).json({
            ok: true,
            message: 'mail sent successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        })
    }
}

export const getAllMailsSends = async (req, res) =>{
    try {
        let mailsSends = await Mails.findAll({ where: { userSend: req.session.user.email } })

        return res.status(200).json({
            ok: true,
            data: mailsSends
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        })
    }
}

export const getAllMailsReceived = async (req, res) =>{
    try {
        let mailsReceived = await Mails.findAll({ where: { userReceived: req.session.user.email } })

        return res.status(200).json({
            ok: true,
            data: mailsReceived
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        })
    }
}

export const getSingleMail = async (req, res) =>{
    try {
        let { id } = req.params;
        
        id = sqlEscape(id);
        id = htmlspecialchars(id);

        const userSession = req.session.user.email

        await Mails.update({ leido: true },
            { where: { id, [Op.or]: [{ userSend: userSession }, { userReceived: userSession }] } }
        );

        const newMail = await Mails.findOne({ where: { id } })
        
        return res.status(200).json({
            ok: true,
            data: newMail
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        })
    }
}

export const deleteMail = async (req, res) =>{
    try {
        let { id } = req.params
        let { email } = req.body

        id = sqlEscape(id)
        id = htmlspecialchars(id)
        email = sqlEscape(email)
        email = htmlspecialchars(email)

        if(email !== req.session.user.email){
            return res.status(403).json({
                ok: false,
                message: 'Cannot perform this action'
            })
        }
        
        const mail = await Mails.findOne({ id })

        if(!mail){
            return res.sattus(404).json({
                ok: false,
                message: "This Mail doesn't exist"
            })
        }

        await Mails.destroy({
            where: { id, [Op.or]: [ { userSend: email }, { userReceived: email }] }
        })

        return res.status(200).json({
            ok: true,
            message: 'The mail was deleted'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        })
    }
}