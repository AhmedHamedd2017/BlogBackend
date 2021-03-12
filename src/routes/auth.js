const express = require('express');

const auth = require('../controllers/auth');

const router = express.Router();

router.get('/reset/:token', auth.reset);
router.get('/verify/:token', auth.verify);


router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.post('/recover',auth.recover);
router.post('/resendToken' , auth.resendToken);
router.post('/reset/:token', auth.resetPassword);

module.exports = router;