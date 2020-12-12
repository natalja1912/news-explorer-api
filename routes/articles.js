const router = require('express').Router();
const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articles');
const { validateArticleBody, validateArticleId } = require('../middlewares/validations');

router.get('/articles', getArticles);

router.post('/articles', validateArticleBody, createArticle);

router.delete('/articles/:articleId', validateArticleId, deleteArticle);

module.exports = router;
