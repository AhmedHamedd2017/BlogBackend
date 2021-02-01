const express = require('express');

const auth = require('../controllers/auth');

const router = express.Router();

router.use('/signup', auth.signup);

module.exports = router;