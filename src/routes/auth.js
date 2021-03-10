const express = require('express');

const auth = require('../controllers/auth');

const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.get('/verify/:token', auth.verify);

module.exports = router;