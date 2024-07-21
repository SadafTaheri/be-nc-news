const {
  removeCommentId,
  patchVotesOfComment,
} = require("../models/comment-models");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentId(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};

exports.updatedCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== "number") {
    return res
      .status(400)
      .send({ msg: "400 - Bad Request : comment_id must be a number" });
  }
  patchVotesOfComment(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
