const jwt = require('jsonwebtoken');

module.exports.user = (req, res, next) => {
    if(req.headers['authorization'])
    {
        try{
            const token = req.headers["authorization"].split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_PASSWORD);
            req.userData = decoded;
            next();
        }catch{
            res.status(401).send("Bad Token!");
        }
    }else{
        res.status(401).send('Unauthorized User!');
    }
}

module.exports.admin = (req,res,next) => {
    if(req.headers['authorization'])
    {
        try{
            const token = req.headers["authorization"].split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_PASSWORD);
            req.userData = decoded;
            if(decoded.role === 'Admin'){
                next();
            }else{
                res.status(401).send('Unauthorized User!');
            }
        }catch{
            res.status(401).send("Bad Token!");
        }
    }else{
        res.status(401).send('Unauthorized User!');
    }
}