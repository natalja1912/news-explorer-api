const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/bad-request');
const { cardNotCreatedError, cardNotFoundError, cardCreatedByAnotherUser } = require('../utils/constants');

const getArticles = (req, res, next) => {
  const ownerId = req.user._id;
  Article.find({ owner: ownerId })
    .then((items) => res.send({ data: items }))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  return Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((item) => {
      if (!item) {
        throw new NotFoundError(cardNotCreatedError);
      }
      return res.status(200).send({
        keyword: item.keyword,
        title: item.title,
        text: item.text,
        date: item.date,
        source: item.source,
        link: item.link,
        image: item.image,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`message: ${Object.values(err.errors).map((error) => (error.message)).join(', ')}`);
      }
      next(err);
    });
};

const deleteArticle = async (req, res, next) => {
  const owner = req.user._id;
  const id = req.params.articleId;
  return Article.findOne({ _id: id }).select('+owner')
    .then((item) => {
      if (!item) {
        throw new NotFoundError(cardNotFoundError);
      }
      if (item.owner.toString() !== owner) {
        throw new ForbiddenError(cardCreatedByAnotherUser);
      }
      return Article.findByIdAndRemove(req.params.articleId)
        .then((articleData) => res.send({ data: articleData }))
        .catch(next);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
