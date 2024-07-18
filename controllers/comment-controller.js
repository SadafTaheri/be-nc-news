const { removeCommentId } = require("../models/comment-models");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  if (!parseInt(comment_id)) {
    res.status(400).send({ msg: `${comment_id} is invalid` });
  }

  removeCommentId(comment_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res
          .status(404)
          .send({ msg: `No Comment found under ${comment_id}` });
      }
      res.status(204).send({});
    })
    .catch(next);
};
