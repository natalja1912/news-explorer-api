require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');
const ConflictError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request');
const { salt, jwtSecret } = require('../utils/config');

const { NODE_ENV, JWT_SECRET, SALT_ROUND } = process.env;
const {
  notFoundUserError,
  invalidEmailPasswordError,
  userAlreadyExistsError,
  userNotCreatedError,
  emailPasswordNotCorrectError,
} = require('../utils/constants');

const getProfile = (req, res, next) => {
  console.log(req);
  if (!req.user) {
    throw new AuthError(notFoundUserError);
  }
  const userId = req.user;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new AuthError(notFoundUserError);
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(invalidEmailPasswordError);
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(userAlreadyExistsError);
      }
      return bcrypt.hash(req.body.password, Number((NODE_ENV === 'production' ? SALT_ROUND : salt)))
        .then((hash) => User.create({
          email: req.body.email,
          password: hash,
          name: req.body.name,
        }))
        .then((userData) => {
          if (!userData) {
            throw new NotFoundError(userNotCreatedError);
          }
          const token = jwt.sign({ _id: userData._id }, (NODE_ENV === 'production' ? JWT_SECRET : jwtSecret), { expiresIn: '6d' });
          return res
            .cookie('jwt', token, {
              maxAge: 1000 * 60 * 60 * 24 * 6,
              sameSite: 'None',
              secure: true,
            })
            .status(200).send({
              email: userData.email,
              name: userData.name,
            });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestError(`message: ${Object.values(err.errors).map((error) => (error.message)).join(', ')}`);
          }
          next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: invalidEmailPasswordError });
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(emailPasswordNotCorrectError);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError(emailPasswordNotCorrectError);
          }
          const token = jwt.sign({ _id: user._id }, (NODE_ENV === 'production' ? JWT_SECRET : jwtSecret), { expiresIn: '6d' });
          return res
            .cookie('jwt', token, {
              maxAge: 1000 * 60 * 60 * 24 * 6,
              sameSite: 'None',
              secure: true,
            })
            .send({ token });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch(next);
};

module.exports = {
  getProfile,
  createUser,
  login,
};
