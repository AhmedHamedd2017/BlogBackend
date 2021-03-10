const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt  = require('jsonwebtoken');
const mailjet = require ('node-mailjet').connect(process.env.MAILJET_API2,process.env.MAILJET_KEY2)

const userModel = require('../models/user');
const tokenModel = require('../models/token');

const sendVerificationEmail = async(req,res) => {
    const token = req.token;
    const link = process.env.HOST_URL + '/auth/verify/' + token.token;
    await tokenModel
    .create(token)
    .then((savedToken) => {
        const request = mailjet.post('send').request({
            FromEmail: process.env.FROM_EMAIL,
            FromName: '@noreply',
            Subject: 'Please verify your email account!',
            'Text-part':
              'Dear user, welcome to blog! please verify your account!',
            'Html-part':
            `<p>Hi ${req.userData.username}<p><br><p>Please click on the following ${link} to verify your account.</p><br><p>If you did not request this, please ignore this email.</p>`,
            Recipients: [{ Email: req.userData.email }],
          })
        .then(() => {
            res.status(200).send(`Thier is verification email sent to ${req.userData.email} please verify your account!`)
        })
        .catch((error) =>{
            console.log('1' + error);
            return res.status(500).json({
                message: error
            })
        })
    })
    .catch((error) => {
        console.log('2' + error);
        return res.status(500).json({
            message: error
        })
    })
};

module.exports.signup = (async(req,res,next) => {
    const usn = await userModel.findOne({username:req.body.username})
    if (!usn){
        req.body.email = req.body.email.toLowerCase();
        await userModel
        .findOne({email : req.body.email})
        .then(async(rec) => {
            if(rec){
                return res.status(409).json({
                    message: "Email already exists!"
                })
            }else{
                bcrypt.hash(req.body.password, 10 , async(error, hash) => {
                    if(error){
                        return res.status(500).json({
                            message: error
                        })
                    }else{
                        const signupRequest = {...req.body ,password: hash}
                        await userModel
                        .create(signupRequest)
                        .then(async(result) => {
                            const genToken = crypto.randomBytes(20).toString('hex');
                            const token = {
                                token: genToken,
                                userId: result._id
                            };
                            req.token = token;
                            req.userData = result;
                            await sendVerificationEmail(req,res);
                        })
                        .catch((error) => {
                            console.log('3' + error);
                            return res.status(500).json({
                                message: error
                            })
                        })
                    }
                })
            }
        })
        .catch((error) => {
            return res.status(500).json({
                message: error
            })
        })
    }else{
        return res.status(409).json({
            message: "Username already exists!"
        });
    }
});

module.exports.verify = async(req,res,next) => {
    if(req.params.token){
        await tokenModel
        .findOne({token: req.params.token})
        .then(async(returnedToken) => {
            if(returnedToken){
                await userModel
                .findById(returnedToken.userId)
                .then((user) => {
                    if(user){
                        user.isVerified = true;
                        user.save((error, result) => {
                            if(error){
                                return res.status(500).send(error);
                            }else if(result){
                                res.status(200).send("The account has been verified. Please log in.");
                            }
                        })

                    }else{
                        return res.status(400).send('We were unable to find a valid user.')
                    }
                })
                .catch(() => {
                    return res.status(500).send('Internal server error!');
                })
            }else{
                return res.status(400).send('We were unable to find a valid token. Your token my have expired.')
            }
        })
        .catch(() => {
            return res.status(500).send('Internal server error!');
        })
    }else{
        return res.status(400).json({
            message: "No token found to verify!"
        });
    }
};

module.exports.login = (async(req,res,next) => {
    await userModel
    .findOne({username: req.body.username})
    .then((result) => {
        if(result){
            if(result.isVerified){
                bcrypt.compare(req.body.password, result.password, (error, hashed) => {
                    if(error){
                        console.log(error);
                        return res.status(401).send("Auth Failed!");
                    }else if(hashed){
                        const token = jwt.sign({
                            email: result.email,
                            firstName: result.firstName,
                            lastName: result.lastName
                        }, process.env.JWT_PASSWORD,{
                            expiresIn: "1h"
                        })
                        res.status(200).json({
                            message: `Welcome back, ${result.firstName}`,
                            token: token
                        })
                    }else{
                        return res.status(401).send("Wrong credentials!");
                    }
                })
            }
            else{
                res.status(401).json({ type: 'not-verified', message: 'Your account has not been verified.' });
            }
        }else{
            return res.status(401).send("Wrong credentials!");
        }
    })
    .catch((error) => {
        console.log(error);
        return res.status(500).json({
            message: "internal server error!"
        })
    })
})