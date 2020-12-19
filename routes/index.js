const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const checkPassword = require('../middlewares/check-password');
const { validateLogin, validateRegistration } = require('../middlewares/validations');

const usersRouter = require('./users');
const articlesRouter = require('./articles');
const notFoundRouter = require('./notFound');

router.post('/signin', validateLogin, checkPassword, login);

router.post('/signup', validateRegistration, checkPassword, createUser);

router.use(auth);

router.use(usersRouter, articlesRouter, notFoundRouter);

module.exports = router;
