const express = require("express");

const app = express();
const { getAllTopics } = require("./controllers/topics-controller");
const endpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", (request, response, next) => {
  response.status(200).send({ endpoints });
});
app.get("/api/topics", getAllTopics);

module.exports = app;
