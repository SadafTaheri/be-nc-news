const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  it("respond with a json detailing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET /api/topics", () => {
  test("status: 200 response with all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        // console.log(body.topics);
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status: 200 responds with requested atricle by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "11",
        });
      });
  });

  test("Status: 400 bad request when article id is not valid", () => {
    return request(app)
      .get("/api/articles/popsicle")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });

  test("Status: 404 when passed a valid id but article id does not exist", () => {
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found article under 9999999");
      });
  });
});

describe("GET /api/articles", () => {
  test("status: 200 response with all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("?sort_by= Status: 200 response with the articles ordered by created_at by defult", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("?sort_by= status:200 responds with an array of articles sorted by any valid column & order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("title", { ascending: true });
      });
  });

  test("?sort_by= status: 400 responds err mgs when provide invalid_column sorted_by", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_input_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort | order by query");
      });
  });

  test("?order= status: 400 responds err mgs when provide invalid order", () => {
    return request(app)
      .get("/api/articles?order=invalid_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort | order by query");
      });
  });

  test("?topic= status: 200 responds with an array of articles filtered by given topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  test("?topic= status: 200 responds with an array of articles filtered by given topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("?topic= status: 200 responds with an array of articles filtered by given topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("paper");
        });
      });
  });

  test("?topic= status: 400 responds err when topic is not valid", () => {
    return request(app)
      .get("/api/articles?topic=456")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("?topic= status: 404 topic is valid but not exists", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status: 200 responds with an array of comments of the article with given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("response with the comments ordered by created_at by defult", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("status: 404 when article_id not exist", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comments not found");
      });
  });

  test("status: 400 when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status: 201 responds with new comment posted by user", () => {
    const postObj = {
      username: "icellusedkars",
      body: "I like it.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postObj)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "icellusedkars",
          body: "I like it.",
          article_id: 1,
        });
      });
  });

  test("status: 400 when posted comment has missing required information", () => {
    const postObj = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });

  test("status: 404 when posted comment is valid but article_id does not exists", () => {
    const postObj = {
      username: "icellusedkars",
      body: "I like it.",
    };
    return request(app)
      .post("/api/articles/99999/comments")
      .send(postObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found under article_id 99999");
      });
  });

  test("status: 400 when username is not exist", () => {
    const postObj = {
      username: "popsicle",
      body: "I like it.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found under this username popsicle");
      });
  });

  test("status: 400 when comment_is is invalid- not a number", () => {
    const postObj = {
      username: "icellusedkars",
      body: "I like it.",
      comment_id: "ice_cream",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("ice_cream is invalid");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status: 200 responds with updated article by article_id", () => {
    const patchObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 101,
          article_img_url: expect.any(String),
        });
      });
  });

  test("status: 400 when required information inc_votes is not provided", () => {
    const patchObj = {};
    return request(app)
      .patch("/api/articles/1")
      .send(patchObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });

  test("status: 400 when inc_votes not a number- invalid data", () => {
    const patchObj = { inc_votes: "popsicle" };
    return request(app)
      .patch("/api/articles/1")
      .send(patchObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });

  test("status: 400 when inc_votes key is incorrect key name", () => {
    const patchObj = { votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });

  test("status: 404 when article_id is valid but not exist", () => {
    const patchObj = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/99999")
      .send(patchObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found under 99999 article_id");
      });
  });

  test("Status: 400 bad request when article id is not valid", () => {
    const patchObj = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/sadaf")
      .send(patchObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status: 204 return empty object when comment is deleted succesfully", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("status: 404 when comment is valid but does not exist for deleting", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Comment found under 99999");
      });
  });

  test("status:400 when comment_id in invalid", () => {
    return request(app)
      .delete("/api/comments/not-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("status: 200 responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toEqual({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("status: 200 return a user by given username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        //console.log(body.user);
        expect(body.user).toEqual({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });

  test("Status: 404 when username is not valid", () => {
    return request(app)
      .get("/api/users/12345")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found user under 12345");
      });
  });

  test("Status: 404 when passed a valid username but username does not exist", () => {
    return request(app)
      .get("/api/users/non-exist-user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found user under non-exist-user");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("status:200 update the votes for a comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });

  test("status: 400 bad request when comment_id is valid but inc_votes is not a number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "not_number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "400 - Bad Request : comment_id must be a number"
        );
      });
  });

  test("status: 400 bad request when comment_id is invalid", () => {
    return request(app)
      .patch("/api/comments/invalid_id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });

  test("status: 404 when comment_id is valid but not-exist", () => {
    return request(app)
      .patch("/api/comments/99999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found under 99999 comment_id");
      });
  });
});

describe("POST /api/articles", () => {
  test("status: 201 should create a new article and responds with new article added by user check all property available", () => {
    const newArticleObj = {
      author: "icellusedkars",
      title: "New Article Title",
      body: "This is a new body",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticleObj)
      .expect(201)
      .then(({ body }) => {
        // console.log(body);
        expect(body).toHaveProperty("article_id");
        expect(body.author).toBe(newArticleObj.author);
        expect(body.title).toBe(newArticleObj.title);
        expect(body.body).toBe(newArticleObj.body);
        expect(body.topic).toBe(newArticleObj.topic);
        expect(body.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(body).toHaveProperty("votes");
        expect(body).toHaveProperty("created_at");
        expect(body).toHaveProperty("comment_count");
      });
  });

  test("status: 201 should create a new article and responds with new article added by user if url provided by user", () => {
    const newArticleObj = {
      author: "icellusedkars",
      title: "New Article Title",
      body: "This is a new body",
      topic: "mitch",
      article_img_url: "123",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticleObj)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          article_id: expect.any(Number),
          title: "New Article Title",
          topic: "mitch",
          author: "icellusedkars",
          body: "This is a new body",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: "123",
          comment_count: 0,
        });
      });
  });

  test("status: 400 return a bad request when required fiels are missing", () => {
    const newArticleObj = {
      author: "icellusedkars",
      title: "New Article Title",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticleObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request: missing required fields");
      });
  });

  test("status: 400 return a bad request when author is not provided", () => {
    const newArticleObj = {
      title: "New Article Title",
      body: "This is a new body",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticleObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request: missing required fields");
      });
  });
});
