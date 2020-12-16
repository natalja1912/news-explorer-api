const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');
const { authorizationNeededError } = require('../utils/constants');

const { JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError(authorizationNeededError);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: authorizationNeededError });
  }

  req.user = payload;

  next();
  return payload;
};
