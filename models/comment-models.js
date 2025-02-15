const db = require("../db/connection");

exports.removeCommentId = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No Comment found under ${comment_id}`,
        });
      }
      return rows[0];
    });
};

exports.patchVotesOfComment = (comment_id, inc_votes) => {
  return db
    .query(
      "UPDATE comments SET votes = votes+ $1 WHERE comment_id = $2 RETURNING *",
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `comment not found under ${comment_id} comment_id`,
        });
      }
      return rows[0];
    });
};
