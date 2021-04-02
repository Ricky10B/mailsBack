/* eslint-disable no-async-promise-executor */
"use strict";
import nodemailer from "nodemailer";
import google from 'googleapis';

const sendEmail = (destinatario, url) =>{
    return new Promise( async (resolve, reject) =>{
        try {
            const OAuth = google.google.auth.OAuth2;
    
            const myOAuth2Client = new OAuth(
                // Client id
                "1085934449139-9q078kf9k70rkifn2itdsunbepjbbqj3.apps.googleusercontent.com",
                // Client secret
                "r7zwhCjlex3xcHYz_s89pNw5",
                "https://developers.google.com/oauthplayground"
            )
    
            myOAuth2Client.setCredentials({
                refresh_token: "1//049OMdY9GHJAKCgYIARAAGAQSNwF-L9Ir-Pf2Kx33yejDlhCjaFTNHpcBeJqDtjjAnQ59lTeAmUwnzt-HVZYTZ--zMOzwGRofSHU"
            })
    
            const myAccessToken = await myOAuth2Client.getAccessToken()
                .catch(err =>{
                    console.log(err);
                    return reject('Unexpected Error when sending email');
                })
        
            // transportador
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                    type: 'OAuth2',
                    user: 'rickynel2001@gmail.com',
                    clientId: '1085934449139-9q078kf9k70rkifn2itdsunbepjbbqj3.apps.googleusercontent.com',
                    clientSecret: 'r7zwhCjlex3xcHYz_s89pNw5',
                    refreshToken: '1//049OMdY9GHJAKCgYIARAAGAQSNwF-L9Ir-Pf2Kx33yejDlhCjaFTNHpcBeJqDtjjAnQ59lTeAmUwnzt-HVZYTZ--zMOzwGRofSHU',
                    accessToken: myAccessToken
                },
                tls: {
                    rejectUnauthorized: false
                }
    
                // Tu id de cliente 
                // 1085934449139-9q078kf9k70rkifn2itdsunbepjbbqj3.apps.googleusercontent.com
    
                // Tu secreto de cliente
                // r7zwhCjlex3xcHYz_s89pNw5
    
                // code authorization
                // 4/0AY0e-g4skRJ8j-sE1NdKuGe7v4UhKBQhq-_s5dOGbgptgZHVkUicnKWBiQwOnhZCJOPENA
    
                // Refresh token
                // 1//04zeJGP_zA8JKCgYIARAAGAQSNwF-L9IrY4mjFJKhqNN2P0XBdpFaFFEz8RIKb53AkoTCJ9pJcJFrwPpEuOQoSaLiEpo5HR9Ebs4
    
                // Access token
                // ya29.a0AfH6SMBRw2b4D0zr0FD1cEB5XmxJBexL0_hsFUJTKRWjIEna4qPPMsWiIPJVJPexbnK6-6-B1ZMx1iv34YlfToMn7s7DD7tY_j53TvwNmqrjriXTF0JAqO2XfqNnufxrdu8mvsqP3iuAGIpK3Pk22HYnzHrxzIB0yTuCpPbqL78
            })
        
            let mailOptions = {
                from: 'sendMailsTeam@gmail.com',
                to: destinatario,
                subject: 'Confirm account',
                html: `
                <div>
                    <h3>Confirm your account</h3>
                    <p>
                        please confirm this email to complete your authentication in we app, <a href="${url}">Click here</a> to complete the authentication.
                    </p>
                    <p>
                        Please note that the link is only valid for 24 hours.
                    </p>
                    <p>
                        The link is valid only 1 time, then it will not exist.
                    </p>
                    <span>
                        If the link expires it will send you to a page that does not exist.
                    </span>
                </div>
                `
            }
        
            await transporter.sendMail(mailOptions)
                .catch(err =>{
                    console.log(err);
                    return reject('Unexpected Error when sending email');
                })

            return resolve(true)
            
        } catch (error) {
            console.log(error);
            return reject('Unexpected Error when sending email');
        }
    })
}

export {
    sendEmail
}