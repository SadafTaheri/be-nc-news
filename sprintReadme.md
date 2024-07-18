# 📝 Task 1 📝
# Project Setup

## Making a public repo
Ensure that you have cloned down the repo first.

You will need to make your own public repo so that you can share this project as part of your portfolio by doing the following:

Create a new public GitHub repository. _Do not_ initialise the project with a `readme`, `.gitignore` or `license`.

From your cloned local version of this project you'll want to push your code to your new repository using the following commands:

```bash
git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main
```

## Creating the databases


We'll have two databases in this project: one for real-looking dev data, and another for simpler test data.

You will need to create two `.env` files for your project: `.env.test` and `.env.development`. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these `.env` files are `.gitignored`.

You'll need to run `npm install` at this point.

> Please do not install specific packages as you can do this down the line when you need them.

You have also been provided with a db folder with some data, a `setup.sql` file and a `seeds` folder.

Please take some to familiarise yourself with the project structure. The seed function has been written for you, but you should take a look at the table creations to see the structure of the database you'll be working with. You should also take a minute to familiarise yourself with the npm scripts you have been provided.

The job of `index.js` in each of the data folders is to export out all the data from that folder, currently stored in separate files. This is so that, when you need access to the data elsewhere, you can write one convenient require statement to the index file, rather than having to require each file individually. Think of it like the index of a book - a place to refer to! Make sure the index file exports an object with values of the data from that folder with the keys:

- `topicData`
- `articleData`
- `userData`
- `commentData`

## Update the readme

As `.env.*` is added to the `.gitignore`, anyone who wishes to clone your repo will not have access to the necessary environment variables. Update your readme to explain what files a developer must add in order to successfully connect to the two databases locally.

Edit the `README.md` to remove the link to the initial instructions. Replace this with instructions on how to create the environment variables for anyone who wishes to clone your project and run it locally.
___________________________________
# 📝 Task 2 📝
# CORE: GET /api/topics

Before you begin, don't forget to branch!

## Description

Should: 

- be available on endpoint `/api/topics`.
- get all topics. 

Responds with:

- an array of topic objects, each of which should have the following properties:

  - slug
  - description

As this is the first endpoint, you will need to set up your testing suite.

Consider what errors could occur with this endpoint. As this is your first endpoint you may wish to also consider any general errors that could occur when making _any_ type of request to your api. The errors that you identify should be fully tested for.

Note: although you may consider handling a 500 error in your app, we would not expect you to explicitly test for this.
___________________________________
# 📝 Task 3 📝
# CORE: GET /api

## Description

Should:

- be available on /api.
- provide a description of all other endpoints available.

Responds with:

An object containing all the available endpoints on your API
You can find an (incomplete) example of this response in the `endpoints.json` file which you should add to as more features are added to your app. This file is not just a guide for what your response should look like, but can also be used when implementing the endpoint. Use your knowledge of reading files in JavaScript to bring this into your code and send it as a response.

This `/api` endpoint will act as documentation detailing all the available endpoints and how they should be interacted with.

Each of your endpoints in this file should include:

- a brief description of the purpose and functionality of the endpoint.
- which queries are accepted.
- what format the request body needs to adhere to.
- what an example response looks like.

You will be expected to update this JSON object for every endpoint you complete, and to test that this endpoint responds with an accurate JSON object. Use your knowledge of reading files in JavaScript to ensure that the response in your test is the exact same as the file you are sending from your server - this will mean your test is dynamic and we do not need to add further tests for each endpoint set up.  

This resource will be helpful to your future self when it comes to using your API in the Front End block of the course.
___________________________________
# 📝 Task 4 📝
# CORE: GET /api/articles/:article_id

## Description

Should: 

- be available on `/api/articles/:article_id`.
- get an article by its `id`.

Responds with:

- an article object, which should have the following properties:

  - author
  - title
  - article_id
  - body
  - topic
  - created_at
  - votes
  - article_img_url

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 5 📝
# CORE: GET /api/articles

## Description

Should: 

- be available on `/api/articles`.
- get all articles.

Responds with:

- an articles array of article objects, each of which should have the following properties:

  - author
  - title
  - article_id
  - topic
  - created_at
  - votes
  - article_img_url
  - comment_count, which is the total count of all the comments with this article_id. You should make use of queries to the database in order to achieve this.

In addition: 

  - the articles should be sorted by date in descending order.
  - there should not be a body property present on any of the article objects.

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 6 📝
# CORE: GET /api/articles/:article_id/comments

## Description

Should: 

- be available on `/api/articles/:article_id/comments`.
- get all comments for an article.

Responds with:

- an array of comments for the given article_id of which each comment should have the following properties:

  - comment_id
  - votes
  - created_at
  - author
  - body
  - article_id

Comments should be served with the most recent comments first.

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 7 📝
# CORE: POST /api/articles/:article_id/comments

## Description

Should:

- be available on `/api/articles/:article_id/comments`.
- add a comment for an article.

Request body accepts:

- an object with the following properties:

  - username
  - body

Responds with:

- the posted comment.

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 8 📝
# CORE: PATCH /api/articles/:article_id

## Description

Should: 

- be available on `/api/articles/:article_id`.
- update an article by `article_id`.

Request body accepts:

- an object in the form `{ inc_votes: newVote }`.

- `newVote` will indicate how much the votes property in the database should be updated by, e.g.

  - `{ inc_votes : 1 }` would increment the current article's vote property by 1

  - `{ inc_votes : -100 }` would decrement the current article's vote property by 100

Responds with:

- the updated article

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 9 📝
# CORE: DELETE /api/comments/:comment_id

## Description

Should:

- be available on `/api/comments/:comment_id`.
- delete the given comment by `comment_id`.

Responds with:

- status 204 and no content.

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 10 📝
# CORE: GET /api/users

## Description

Should: 

- be available on `/api/users`.
- get all users.

Responds with:

- an array of objects, each object should have the following properties:
  - username
  - name
  - avatar_url

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 11 📝
# CORE: GET /api/articles (sorting queries)

## Description

FEATURE REQUEST
The endpoint should also accept the following queries:

- `sort_by`, which sorts the articles by any valid column (defaults to the `created_at` date).
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending).

Consider what errors could occur with this endpoint, and make sure to test for them.

You should not have to amend any previous tests. 

Remember to add a description of this endpoint to your `/api` endpoint. 


___________________________________
# 📝 Task 12 📝
# CORE: GET /api/articles (topic query)

## Description

FEATURE REQUEST
The endpoint should also accept the following query:

- `topic`, which filters the articles by the topic value specified in the query. If the query is omitted, the endpoint should respond with all articles.

Consider what errors could occur with this endpoint, and make sure to test for them.

You should not have to amend any previous tests. 

Remember to add a description of this endpoint to your `/api` endpoint. 

## ADVANCED: GET /api/articles (sorting queries)

### Description

FEATURE REQUEST
The endpoint should also accept the following queries:

- `sort_by`, which sorts the articles by any valid column (defaults to the `created_at` date).
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending).

Consider what errors could occur with this endpoint, and make sure to test for them.

You should not have to amend any previous tests. 

Remember to add a description of this endpoint to your `/api` endpoint. 

___________________________________
# 📝 Task 13 📝
# CORE: GET /api/articles/:article_id (comment_count)

## Description

FEATURE REQUEST
An article response object should also now include:

- `comment_count`, which is the total count of all the comments with this `article_id`. You should make use of queries to the database in order to achieve this.
___________________________________
# 📝 Task 14 📝
# CORE: Host application

## Description

Let's give the public what they want! Time to host v1 of our app!

Follow the instructions at https://notes.northcoders.com/courses/js-back-end/api-hosting.
___________________________________
# 📝 Task 15 📝
# CORE: Complete README

## Description

Nearly there!

The `README` is targeted at people who will come to your repo (potentially from your CV or portfolio website). They'll want to see what you have created and try it out for themselves (not just to look at your code!).

You should consider that the person reading your `README` is another developer, and so you can use high-level language to describe your project.

You should include: 

- A link to the hosted version.
- A summary of what the project is.
- Clear instructions of how to clone, install dependencies, seed local database, and run tests.
- Information about how to create the two `.env` files. 
- The minimum versions of `Node.js`, and `Postgres` needed to run the project.
___________________________________
# 📝 Task 16 📝
# ADVANCED: Express Routers

## Description

It has come to our attention that this project is going to deal with a fair few endpoints. It's been decided that we should make use of routers to help break down the logic into sub routers.

[NC notes](https://notes.northcoders.com/courses/js-back-end/routers) covers how they can be used to make our applications more maintainable.

They are also covered in-depth in the [Express docs](https://expressjs.com/en/guide/routing).
___________________________________
# 📝 Task 17 📝
# ADVANCED: GET /api/users/:username

## Description

Should:

- be available on `/api/users/:username`.
- return a user by `username`.

Responds with:

- a user object which should have the following properties:
  - username
  - avatar_url
  - name

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 18 📝
# ADVANCED: PATCH /api/comments/:comment_id

## Description

Should: 

- be available on `/api/comments/:comment_id`.
- update the votes on a comment given the comment's `comment_id`.

Request body accepts:

- an object in the form `{ inc_votes: newVote }`:

`newVote` will indicate how much the votes property in the database should be updated by, e.g.

  `{ inc_votes : 1 }` would increment the current comment's vote property by 1

  `{ inc_votes : -1 }` would decrement the current comment's vote property by 1

Responds with:

- the updated comment.

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 19 📝
# ADVANCED: POST /api/articles

## Description

Should: 

- be available on `/api/articles`.
- add a new article.

Request body accepts:

- an object with the following properties:

  - author
  - title
  - body
  - topic
  - `article_img_url` - will default if not provided

Responds with:

- the newly added article, with all the above properties, as well as:

  - article_id
  - votes
  - created_at
  - comment_count

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 20 📝
# ADVANCED: GET /api/articles (pagination)

## Description

To make sure that an API can handle large amounts of data, it is often necessary to use pagination. Head over to [Google](https://www.google.co.uk/search?q=cute+puppies), and you will notice that the search results are broken down into pages. It would not be feasible to serve up all the results of a search in one go. The same is true of websites / apps like Facebook or Twitter (except they hide this by making requests for the next page in the background, when we scroll to the bottom of the browser). We can implement this functionality on our `/api/articles` endpoint.

Accepts the following queries:

- `limit`, which limits the number of responses (defaults to 10).
- `p`, stands for page and specifies the page at which to start (calculated using limit).

Responds with: 

- the articles paginated according to the above inputs.
- `total_count` property, displaying the total number of articles (this should display the total number of articles with any filters applied, discounting the limit).

Consider what errors could occur with this endpoint, and make sure to test for them.

Note: This is a new behaviour which may break previous behaviours you have inferred. 

Remember to add a description of this endpoint to your `/api` endpoint. 

___________________________________
# 📝 Task 21 📝
# ADVANCED: GET /api/articles/:article_id/comments (pagination)

## Description

Should: 

- be available on `/api/articles/:article_id/comments`.
- add pagination when retrieving comments for an article. 

Accepts the following queries:

- `limit`, which limits the number of responses (defaults to 10).
- `p`, stands for page and specifies the page at which to start (calculated using limit).

Responds with: 

- the comments paginated according to the above inputs.

Consider what errors could occur with this endpoint, and make sure to test for them.

Your previous test cases should not need amending. 

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 22 📝
# ADVANCED: POST /api/topics

## Description

Should: 

- be available on `/api/topics`.
- add new topic.

Request body accepts:

- an object in the form:
  ```js
  {
    "slug": "topic name here",
    "description": "description here"
  }
  ```

Responds with:

- a topic object containing the newly added topic.

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________
# 📝 Task 23 📝
# ADVANCED: DELETE /api/articles/:article_id

## Description

Should: 

- be available on `/api/articles/:article_id`.
- delete an article based on an `id`, and its respective comments. 

Respond with:

- status 204 and no content.

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your `/api` endpoint. 
___________________________________