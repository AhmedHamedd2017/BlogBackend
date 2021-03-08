const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');


const userModel = require('../models/user');

module.exports.signup = (async(req,res,next) => {
    req.body.email = req.body.email.toLowerCase();
    await userModel
    .findOne({email : req.body.email})
    .then(async(rec) => {
        if(rec){
            return res.status(409).json({
                message: "User already exists!"
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
                    .then((result) => {
                        res.status(201).send("User created!");
                    })
                    .catch((error) => {
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
});

module.exports.login = (async(req,res,next) => {
    await userModel
    .findOne({email: req.body.email})
    .then((result) => {
        if(result){
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