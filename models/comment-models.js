const db = require("../db/connection");

exports.removeCommentId = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
    comment_id,
  ]);
};
