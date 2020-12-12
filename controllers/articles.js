const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');

module.exports.getArticles = (req, res, next) => {
  const ownerId = req.user._id;
  Article.find({ owner: ownerId })
    .then((items) => res.send({ data: items }))
    .catch(next);
};

// eslint-disable-next-line consistent-return
module.exports.createArticle = async (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  try {
    const item = await Article.create({
      keyword, title, text, date, source, link, image, owner,
    });
    if (!item) {
      throw new NotFoundError('Карточка не была создана, попробуйте еще раз');
    }
    return res.status(200).send({ data: item });
  } catch (err) {
    const ERROR_CODE = 400;
    if (err.name === 'ValidationError') {
      err.statusCode = ERROR_CODE;
      err.message = `message: ${Object.values(err.errors)}`;
    }
    next(err);
  }
};

// eslint-disable-next-line consistent-return
module.exports.deleteArticle = async (req, res, next) => {
  const owner = req.user._id;
  const id = req.params.articleId;
  try {
    const item = await Article.findOne({ _id: id });
    if (!item) {
      throw new NotFoundError('Карточка не была найдена, попробуйте еще раз');
    }
    if (item.owner.toString() !== owner) {
      return res.status(409).send({ message: 'Карточка была создана другим пользователем' });
    }
    return Article.findByIdAndRemove(req.params.articleId)
      .then((articleData) => res.send({ data: articleData }))
      .catch(next);
  } catch (err) {
    next(err);
  }
};
