const articles = require("../db/data/test-data/articles");
const {
  selectArticleById,
  fetchArticles,
  fetchCommentByArticleId,
} = require("../models/articles-models");
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
