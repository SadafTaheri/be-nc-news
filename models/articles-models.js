const db = require("../db/connection");
const { fetchTopics } = require("./topics-models");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title,articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count From articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found article under ${article_id}`,
        });
      }
      return rows[0];
    });
};

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const greenList = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validQuery = ["asc", "desc"];

  if (!greenList.includes(sort_by) || !validQuery.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort | order by query",
    });
  }

  return fetchTopics().then((topics) => {
    const allExistsTopics = topics.map((topic) => topic.slug);
    if (topic && !allExistsTopics.includes(topic)) {
      return Promise.reject({
        status: 404,
        msg: "Not Found",
      });
    }

    let queryStr = `SELECT articles.author, articles.title,articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

    const queryTopic = [];
    if (topic) {
      queryStr += `WHERE articles.topic = $1 `;
      queryTopic.push(topic);
    }

    queryStr += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

    return db.query(queryStr, queryTopic).then((result) => {
      return result.rows;
    });
  });
};

exports.fetchCommentByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id From comments WHERE article_id =$1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comments not found",
        });
      }
      return result.rows;
    });
};

exports.addCommentToChoosenArticle = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1,$2,$3) RETURNING *;",
      [article_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.patchVotesOfArticle = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes+ $1 WHERE article_id = $2 RETURNING *",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article not found under ${article_id} article_id`,
        });
      }
      return rows[0];
    });
};

exports.insertArticle = (author, title, body, topic, article_img_url) => {
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url ) VALUES ($1,$2,$3,$4,$5) RETURNING *;`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.getCommentCountByArticle = (article_id) => {
  return db
    .query(
      `SELECT COUNT(*) AS comment_count FROM comments WHERE article_id =$1`,
      [article_id]
    )
    .then(({ rows }) => {
      return parseInt(rows[0].comment_count, 10);
    });
};
