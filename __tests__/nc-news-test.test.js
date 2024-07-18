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
  test("response with the articles ordered by created_at by defult", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
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
        expect(body.msg).toBe("not-number is invalid");
      });
  });
});
