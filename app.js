const express = require("express");

const app = express();
const { getAllTopics } = require("./controllers/topics-controller");
const {
  getArticleById,
  getAllArticles,
  getCommentByArticleId,
  postCommentToChoosenArticle,
  updatedArticleVotes,
  addArticle,
} = require("./controllers/articles-constroller");
const { getEndpoints } = require("./controllers/endpoints-controller");
const {
  deleteCommentById,
  updatedCommentVotes,
} = require("./controllers/comment-controller");
const {
  getAllUsers,
  getUserByUserName,
} = require("./controllers/users_controller");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentByArticleId);

app.post("/api/articles/:article_id/comments", postCommentToChoosenArticle);

app.patch("/api/articles/:article_id", updatedArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getAllUsers);

app.get("/api/users/:username", getUserByUserName);

app.patch("/api/comments/:comment_id", updatedCommentVotes);

app.post("/api/articles", addArticle);

app.use((err, req, res, next) => {
  // console.log(err);
  if (err.code === "22P02" || err.code === "23502") {
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
