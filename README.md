# News API

Welcome to NC News API project! This project is an API for accessing application data programmatically, mimicking a real-world backend service like Reddit.This is a RESTFUL API build with node.js, Express, and PostgreSQL.

Project Summary:
NC News is an API designed to access to articles, comments, topics, and users for a kind od news application.
Endpoints:
-Serving a list of articles or a single one by given Id.
-Posting new articles and comments
-Updating articles and comments.
-Filtering and fetching topics and theire information.

## Getting Started

Hosting:
This API hosted on render and can be accessed via this link:
https://be-nc-news-c79i.onrender.com

### Prerequisites

The minimum requirements:

- Node.js: v14 or Higher
- PostgreSQL: v12 or Higher

#### Installation

1.Clone the repository:
git clone https://github.com/SadafTaheri/be-nc-news.git
cd bc-nc-news

2.Creating the databases:
Create two .env files in the main directory.
.env.development => PGDATABASE=nc_news
.env.test => PGDATABASE=nc_news_test

3.install dependencies:
-npm install

4.Seed local database:
There is a db folder with some data, a setup.sql file and a seeds folder.
-npm run seed

5. Run test
   -npm test

6. Add a new .env file called `.env.production`. Which must be added to your .gitignore to prevent your production database url from being publicly exposed.

   - In it, a variable of `DATABASE_URL` with value of the URI connection string you copied from the database configuration in the previous step.

##### More Information

.husky
To ensure we are not committing broken code, this project makes use of git hooks.
The Husky documentation:(https://typicode.github.io/husky/#/) explains how to configure Husky for your own project, as well as creating your own custom hooks.

index.js
The job of index.js in each of the data folders is to export out all the data from that folder, currently stored in separate files.
-topicData
-articleData
-userData
-commentData
