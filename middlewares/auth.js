const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');
const { authorizationNeededError } = require('../utils/constants');

const { jwtSecret } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthError(token);
  }

  let payload;

  try {
    payload = jwt.verify(token, (NODE_ENV === 'production' ? JWT_SECRET : jwtSecret));
  } catch (err) {
    return res
      .status(401)
      .send({ message: authorizationNeededError });
  }

  req.user = payload;

  next();
  return payload;
};
