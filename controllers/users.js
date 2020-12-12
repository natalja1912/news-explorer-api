require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request');

const { SALT_ROUND = 10 } = process.env;
const { JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b' } = process.env;

// eslint-disable-next-line func-names
// eslint-disable-next-line consistent-return
module.exports.getProfile = async function (req, res, next) {
  if (!req.user) {
    throw new AuthError('Пользователь не найден');
  }
  const userId = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AuthError('Пользователь не найден');
    }
    return res.status(200).send({ data: user });
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Невалидные почта или пароль');
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Такой email уже существует');
      }
      return bcrypt.hash(req.body.password, SALT_ROUND)
        .then((hash) => User.create({
          email: req.body.email,
          password: hash,
          name: req.body.name,
        }))
        .then((userData) => {
          if (!userData) {
            throw new NotFoundError('Пользователь не был создан');
          }
          const token = jwt.sign({ _id: userData._id }, JWT_SECRET, { expiresIn: '7d' });
          // eslint-disable-next-line max-len
          return res.status(200).send({ userData, token: token.toString() });
        })
        .catch((err) => {
          const ERROR_CODE = 400;
          if (err.name === 'ValidationError') {
            // eslint-disable-next-line no-param-reassign
            err.statusCode = ERROR_CODE;
            // eslint-disable-next-line no-param-reassign
            err.message = `message: ${Object.values(err.errors)}`;
          }
          next(err);
        });
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Невалидные почта или пароль' });
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          return res.send({ token });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch(next);
};
