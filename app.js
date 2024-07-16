const express = require("express");

const app = express();
const { getAllTopics } = require("./controllers/topics-controller");
const {
  getArticleById,
  getAllArticles,
  getCommentByArticleId,
} = require("./controllers/articles.constroller");
const { getEndpoints } = require("./controllers/endpoints-controller");

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentByArticleId);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "400 - Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
