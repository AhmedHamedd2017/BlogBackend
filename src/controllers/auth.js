const bcrypt = require('bcrypt');
const user = require('../models/user');

const userModel = require('../models/user');

module.exports.signup = (async(req,res,next) => {
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
                    const signupRequest = {...req.body, password: hash}
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
    .find(req.body)
    .then((result) => {
        if(result){
            res.status(200).send(`Welcome back, ${req.body.username}`);
        }else{
            return res.status(401).send("Wrong credentials!");
        }
    })
    .catch((error) => {
        return res.send(500).json({
            message: error
        })
    })
})