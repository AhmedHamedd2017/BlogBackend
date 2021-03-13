const express = require('express');

const user = require('../controllers/user');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/index', authMiddleware.admin, user.index);
router.get('/:username',authMiddleware.user, user.show);

router.put('/:username', authMiddleware.user, user.update);

router.delete('/:username', authMiddleware.user, user.delete);

router.post('/ban', authMiddleware.admin, user.ban);
router.post('/unban', authMiddleware.admin, user.unban);
router.post('/create', authMiddleware.admin, user.create);
router.post('/demote', authMiddleware.admin, user.demote);
router.post('/promote', authMiddleware.admin, user.promote);


module.exports = router;