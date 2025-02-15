const articles = require("../db/data/test-data/articles");
const {
  selectArticleById,
  fetchArticles,
  fetchCommentByArticleId,
  addCommentToChoosenArticle,
  patchVotesOfArticle,
  insertArticle,
  getCommentCountByArticle,
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
  const { sort_by, order, topic } = req.query;
  // console.log(topic);

  fetchArticles(topic, sort_by, order)
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

exports.postCommentToChoosenArticle = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  const { comment_id } = req.body;

  if (comment_id !== undefined && !parseInt(comment_id)) {
    res.status(400).send({ msg: `${comment_id} is invalid` });
  }

  addCommentToChoosenArticle(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      if (err.code === "23503") {
        if (err.detail.includes(article_id)) {
          res
            .status(404)
            .send({ msg: `No article found under article_id ${article_id}` });
        } else if (err.detail.includes(username)) {
          res
            .status(400)
            .send({ msg: `No user found under this username ${username}` });
        } else {
          next(err);
        }
      } else {
        next(err);
      }
    });
};

exports.updatedArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  patchVotesOfArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  const {
    author,
    title,
    body,
    topic,
    article_img_url = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
  } = req.body;

  if (!author || !title || !body || !topic) {
    return res
      .status(400)
      .send({ msg: "400 - Bad Request: missing required fields" });
  }

  insertArticle(author, title, body, topic, article_img_url)
    .then((newArticle) => {
      return getCommentCountByArticle(newArticle.article_id).then(
        (commentCount) => {
          res.status(201).send({ ...newArticle, comment_count: commentCount });
        }
      );
    })
    .catch(next);
};
