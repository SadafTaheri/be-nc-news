const { removeCommentId } = require("../models/comment-models");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentId(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};
