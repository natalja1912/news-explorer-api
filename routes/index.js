const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateRegistration } = require('../middlewares/validations');

const usersRouter = require('./users');
const articlesRouter = require('./articles');
const notFoundRouter = require('./notFound');

router.post('/signin', validateLogin, login);

router.post('/signup', validateRegistration, createUser);

router.use(auth);

router.use(usersRouter, articlesRouter, notFoundRouter);

module.exports = router;
