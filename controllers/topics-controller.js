const { response } = require("../app");
const { fetchTopics } = require("../models/topics-models");
exports.getAllTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};
