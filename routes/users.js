const router = require('express').Router();
const { getProfile, logout } = require('../controllers/users');

router.get('/users/me', getProfile);
router.get('/logout', logout);

module.exports = router;
