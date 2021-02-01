
const userModel = require('../models/user');

module.exports.signup = ((req,res,next) => {
    const newUser = new userModel(req.body);
    newUser.save()
    .then((result) => {
        res.status(201).send("User created!");
    })
    .catch((error) => {
        console.log(error);
    })
});