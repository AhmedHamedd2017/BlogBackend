
const userModel = require('../models/user');

//Admin Features
module.exports.index = (async(req,res,next) => {
    await userModel
    .find()
    .then((users) => {
        if(users){
            return res.status(404).send('There is no users.');
        }else{
            res.status(200).send({users});
        }
    })
    .catch((error) => {
        return res.status(500).send('Internal Server Error.');
    })
});

module.exports.create = (async(req,res,next) => {
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
                const randPassword = '_' + Math.random().toString(36).substr(2, 9)
                bcrypt.hash(randPassword, 10 , async(error, hash) => {
                    if(error){
                        return res.status(500).json({
                            message: error
                        })
                    }else{
                        let signupRequest = {...req.body ,password: hash}
                        signupRequest.resetPasswordToken = crypto.randomBytes(20).toString('hex');
                        signupRequest.resetPasswordExpiration = Date.now() + 3600000;
                        signupRequest.save()
                        .then((savedUser) => {
                            const link = process.env.HOST_URL + '/auth/reset/' + savedUser.resetPasswordToken;
                            sendEmail(req,res,process.env.FROM_EMAIL,'Acquire Account', 'Acquire Account Mail',
                            `<p>Hi ${user.username}<p><br><p>A new account has been created for you. Please visit the following ${link} to set your password and login.</p> 
                            <br><p>If you did not request this, please ignore this email.</p>` 
                            , savedUser.email);
                        })
                        .catch((error) => {
                            return res.status(500).send('Internal Server Error.');
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

module.exports.promote = (async(req,res,next) => {
    await userModel
    .findOne({username: req.body.username})
    .then((user) => {
        if(user){
            user.role = 'Admin';
            user.save();
            res.send(200).send(`${user.username} has been promoted to admin`);
        }else{
            return res.status(404).send(`${req.body.username} does not exist`);
        }
    })
    .catch((error) => {
        return res.status(500).send('Internal Server Error.');
    })
});

module.exports.demote = (async(req,res,next) => {
    await userModel
    .findOne({username: req.body.username})
    .then((user) => {
        if(user){
            user.role = 'User';
            user.save();
            res.send(200).send(`${user.username} has been demoted to user`);
        }else{
            return res.status(404).send(`${req.body.username} does not exist`);
        }
    })
    .catch((error) => {
        return res.status(500).send('Internal Server Error.');
    })
});

module.exports.ban = (async(req,res,next) => {
    await userModel
    .findOne({username: req.body.username})
    .then((user) => {
        if(user){
            user.banned = true;
            user.save();
            res.send(200).send(`${user.username} has been banned`);
        }else{
            return res.status(404).send(`${req.body.username} does not exist`);
        }
    })
    .catch((error) => {
        return res.status(500).send('Internal Server Error.');
    })
});

//User Features
module.exports.show = (async(req,res,next) => {
    await userModel
    .findOne({username: req.params.username})
    .then((user) => {
        if(user){
            res.status(200).send({user});
        }else{
            return res.status(404).send(`There is no user with username ${req.params.username}`);
        }
    })
    .catch((error) => {
        return res.status(500).send('Internal Server Error.');
    })
});

module.exports.delete = (async(req,res,next) => {
    if(req.params.username === req.userData.username){
        await userModel
        .findOne({username: req.body.username})
        .then(async(user) => {
            if(user){
                await userModel
                .findByIdAndDelete(user._id)
                .then(() => {
                    res.status(200).send(`${user.username} has been permanently deleted!`);
                })
                .catch((error) => {
                    return res.status(500).send('Internal Server Error.');
                })
            }else{
                return res.status(404).send(`${req.body.username} does not exist!`);
            }
        })
        .catch((error) => {
            return res.status(500).send('Internal Server Error.');
        })
    }else{
        return res.status(401).send('Unauthorized User.');
    }
});

module.exports.update = (async(req,res,next) => {
    if(req.params.username === req.userData.username){
        const update = req.body;
        await userModel
        .findOneAndUpdate({username: req.params.username}, {$set: update}, {new: true})
        .then((updatedRec) => {
            if(!req.file){
                res.status(200).send(`${updatedRec.username} is updated!`);
            }else{
                //const result = await uploader(req);
                updatedRec.profileImage = result;
                updatedRec.save()
                res.status(200).send(`${updatedRec.username} is updated!`);
            }
        })
        .catch((error) => {

        })
    }else{
        return res.status(401).send('Unauthorized User.');
    }
});