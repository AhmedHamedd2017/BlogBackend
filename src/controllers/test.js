const express = require('express');
const router = express.Router();


router.get('/home', (req,res) => {
    res.send("home");
});

router.get('/aboutus', (req,res) => {
    res.send("aboutus");
});

router.get('/', (req,res) => {
    res.send("welcome");
});

module.exports.router = router;