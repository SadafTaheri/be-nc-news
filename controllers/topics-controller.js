const { response } = require("../app");
const { fetchTopics } = require("../models/topics-models");
exports.getAllTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
