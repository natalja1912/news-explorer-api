const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const { notFoundTextError } = require('../utils/constants');

router.all('*', () => {
  throw new NotFoundError(notFoundTextError);
});

module.exports = router;
