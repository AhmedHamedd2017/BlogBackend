const express = require('express');

const auth = require('../controllers/auth');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', auth.signup, auth.sendVerificationEmail);
router.post('/login', auth.login)

module.exports = router;