# Hosting a PSQL DB using Supabase and Render

There are many ways to host APIs online. In these notes we will be using [Supabase](https://supabase.com/) to create an online location for your database, and [Render](https://render.com/) to host the API. Render also offers free postgres hosting, but only for 90 days so we'll use a separate service to host our database.

## 1. Setup a database instance using Supabase

- Create a [Supabase account](https://supabase.com/). You can sign up using your email address or alternatively sign in using an existing GitHub account.

- After logging in, you should be taken to a dashboard with the option to create a new project. If not, navigate to the All Projects tab in the sidebar. 

- Click the **+ New Project** button.

- Assuming this is your first time using Supabase, you will be prompted to create a new organisation.

- Give the organisation a name of your choosing. It doesn’t matter what this is called.

- Make sure that the type of organisation selected is **Personal** and that your choose the **Free** pricing plan option.

- Next, give your project a name and create a database password. **Copy this to your clipboard and paste it somewhere safe.** We will need it in a moment to connect to our hosted database instance and we won’t be able to retrieve it again if we forget it.

**The database password used must not contain symbols.** Alphanumeric characters only here, otherwise the connection string will not be parsed correctly from our .env file which can cause connection errors and prevent seeding from happening successfully.

- Select any region. This will be the location of your hosted server, so it may be slightly beneficial to choose a location closer to you. Confirm to create your project.

- If you make a mistake don’t worry, you can reset any of these settings including your database password in the project settings later.

- Now that we’ve created our database instance, we want to connect to it and seed our data.

- From the Project home page, select "Database" from the sidebar panel.

- Click the 'Connect' button in the top right corner and Ccpy the URI connection string (this will start with "postgres://..." ) to your clipboard, or keep this tab open whilst you move onto the next step!

## 2. Add your production .env file to your local repo

- We will need to provide an environment variable for our production DB called `DATABASE_URL`. This will provide the online location of the DB you have just created.

- Add a new .env file called `.env.production`. Which must be added to your .gitignore to prevent your production database url from being publicly exposed.

- In it, a variable of `DATABASE_URL` with value of the URI connection string you copied from the database configuration in the previous step.

- Make sure that you paste in your database password from earlier where directed in the connection string.

## 3. Update your connection pool

At the top of the file that creates and exports your connection pool (this may be called something like `connection.js`), assign the value of the NODE_ENV to a variable (you may have already created this variable):

```js
const ENV = process.env.NODE_ENV || 'development';
```

It is important to check that we have either the development/test PGDATABASE variable or the production DATABASE_URL. If both are missing from the `process.env`, then throw an error.

```js
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}
```

Next, add a `config` variable. If the `ENV` is "production", this variable should hold a config object, containing the `DATABASE_URL` at the `connectionString` key. This allows you to connect to the hosted database from your local machine. The `max` property limits how many connections the Pool will have available as free Elephant databases only support up to 5 concurrent connections. We're not using them all for the server so that we can manually connect if we need to.

```js
const ENV = process.env.NODE_ENV || 'development';
// ...
const config = {};

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config);
```

## 4. Add a listen file

If you haven't already, we will need to add a `listen.js` file at the top level of our folder, which we will provide to our hosting provider so they know how to get our app started.

```js
const app = require('./app.js');
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
```

## 5. Update your package.json

In your `package.json` file, set your "main" key to your listen.js file. Missing this will result in an error from our hosting provider, as it won't know where to enter the app.

```json
"main": "listen.js"
```

Add the following keys to the scripts:

```json
{
  "scripts": {
    "start": "node listen.js",
    "seed-prod": "NODE_ENV=production npm run seed"
  }
}
```

Also make sure your `dotenv` and `pg` dependencies are in your _dependencies_, not your _devDependencies_, as Render will need access to these libraries.

## 6. Commit your changes to GitHub

You need to make sure your GitHub repo contains the changes made to the files above.

Add, commit and push the changed files to your `main` branch on Github.

_If you've accidentally pushed these changes to a branch, you will need to create a pull request and merge them_

## 7. Seed your online database

Your `package.json` should have a `seed-prod` script (if it doesn't, check the previous step).

**Run the seed-prod script**

```bash
npm run seed-prod
```

This script should check whether you're in production, and if you are, it should connect to the production database. If you have other .env files (you might not!), leave them as they are.

You can test if this has worked by going to the "Table Editor" section in the sidebar of your Supabase project Dashboard. Here you can view your tables and data if the seed has been successful.


## 8. Get your API hosted using render

Sign up to [Render](https://render.com/). Once you're signed up, click on the "New +" button and create a new `Web Service`.

You can connect your github account and give the app permission to access your apps repo, alternatively you can paste in the URL of your git repository, providing it is a public repo

Once you have selected your repo, give your app a name. Most of the options can be left on their default settings, hosted in the EU using the main branch. The default commands can be left as is. (yarn is a package manager, an alternative to npm)

At the bottom, underneath the payment tier options you will have the option to provide some environment variables by clicking on the `Advanced` button.

You will need to add the following variables yourself using the `Add Environment Variable` button.

1. Set `DATABASE_URL` to your database's URL (the same one you put in your `.env.production`).
2. Set `NODE_ENV` to the string "production" (you won't need to add the quotes).

Create your service and it will begin the deploy process. This will take a few minutes the first time so be patient. If you have made a mistake, or forgotten to add environment variables you can select the `Environment` tab on your app dashboard. Once you have saved any changes Render will re-deploy your app with the new environment.

You can see the progress on this by following the links on the `Events` tab and any logs from your server are shown on the Logs tab.

## 9. Check your API online

There's a link to your hosted app at the top of the page. Check your endpoints are working, and you're good to go! 🎉

The link is to the `/` path which your server will correctly 404. Make a request to an existing endpoint such as `/api/users` to check you're getting data from the db correctly.

nb If your data is appearing on one line, it can be hard to read. You may find it easier to read by installing a JSON Formatter extension to your browser. We recommend [this one](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en) for Chrome.
