const express = require("express");

const app = express();
const { getAllTopics } = require("./controllers/topics-controller");
const { getArticleById } = require("./controllers/articles.constroller");
const endpoints = require("./endpoints.json");

app.get("/api", (request, response, next) => {
  response.status(200).send({ endpoints });
}); // It should move to controller and remove from here
app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

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
