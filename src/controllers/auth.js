
const userModel = require('../models/user');

module.exports.signup = (async(req,res,next) => {
    await userModel
    .create(req.body)
    .then((result) => {
        res.status(201).send("User created!");
    })
    .catch((error) => {
        console.log(error);
    })
});

module.exports.login = (async(req,res,next) => {
    await userModel
    .find(req.body)
    .then((result) => {
        if(result){
            res.status(200).send(`Welcome back, ${req.body.username}`);
        }else{
            res.status(401).send("Wrong credentials!");
        }
    })
    .catch((error) => {

    })
})