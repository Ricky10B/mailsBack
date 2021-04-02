import { verifyToken } from "../jwt/jwt.js";

export const authenticated = async (req, res, next) =>{
    if(req.session && req.session.user){
        return next()
    }

    return res.status(403).json({
        ok: false,
        message: 'Unauthenticated'
    });
}

export const authorization = async (req, res, next) =>{
    try {
        let token = req.headers.authorization
        
        if(!token){
            return res.status(401).json({
                ok: false,
                message: 'Unauthorized'
            })
        }

        if(token.indexOf(' ') === -1){
            return res.sattus(401).json({
                ok: true,
                message: 'Unauthorized'
            })
        }
    
        token = token.split(' ')[1]
    
        verifyToken(token)
            .then(() =>{
                return next()
            })
            .catch(err =>{
                return res.status(500).json({
                    ok: false,
                    message: err
                })
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        })
    }
}