# url-shortener
Webserver to shorten url and redirect pages

## How does that work?
### Overview of the service
Go to the root page and enter an url to shorten:
![Enter an url](https://cldup.com/kAi-EIP-98.png)
After clicking on Submit, you get the shortened url:
![Shortened Url](https://cldup.com/AjAZU6eAy6-3000x3000.png)
This shortened url can now be used to be redirected to the full page.

After logging-in (`admin` / `password`),
![Login](https://cldup.com/c9nmQ_w8A8-3000x3000.png)
an admin page is accessible. It shows all the urls that have been shortened, and the number of views:
![Admin page](https://cldup.com/pub9IRyZFC-3000x3000.png)

There is also an **API** to:
- shorten an url: `POST /api/urls`
- retrieve information about a shortened url: `GET /api/urls/:id`

### Behind the scenes
The web service is built on top of **Node.js** and Express.js.

I chose to use **DynamoDB** as the persistent database. This is my first time using it, but its key-value solution sounded very appropriate for this use-case.

When a new url is submitted to the service, it creates randomly a unique `id` of a fixed size, check its uniqueness in the database, then creates a new entry in the table. So far, the `id` has a size of 6 characters, see Todo for improvement.

The **sessions**, used for keeping track of logged-in users, are local to the server/thread. That means that a user has to re-login after a server restart. Worse, that would be a big issue if we put this service behind a load balancer, with many instances. In that case, we would need to use Redis as a common store for the sessions.

### Structure of the directories
The configurations for various environments can be found in `./config/`.

The controllers, models, views and others small libraries can be found under `./app/`.

The tests are under `./test/`.

## Install
- Install dynamodb locally
```
brew install dynamodb-local
```
- Install Node.js and NPM, by downloading and installing from https://nodejs.org/en/
- Install Node.js modules for this project
```
npm install
```

## Tests
The tests are using a local dynamodb table for now in order to make sure everything is working perfectly with the database.
It should be better and the tests would run faster by stubbing the database's client.
To run them:
```
npm test
```

## Run server
```
npm run dev
```
And visit `http://localhost:3070`

## Database's content
To scan the content of the local database:
```
npm run dynamo:getAllLocalData
```
Or just go to the admin page.

## Done
+ Webserver which responds to a status page [GET /status]
+ Web page with a form to enter a full url [GET /]
+ Route to submit a new url [POST /url]
+ Route to redirect from shorten url to full url [GET /:id]
+ Admin page with the list of all shortened [GET /admin]
+ Change the local memory into a persistent one (DynamoDB)
+ Local cache in front of the database
+ API: shorten an url [POST /api/urls]
+ API: get information about an url [POST /api/urls/:id]
+ API: get all urls information [GET /api/urls]
+ Circle CI

## Debates
### Unique short url by full url
For now, each time a same url is requested to be shorten, a new short url is created.

In the case of the statistics (number of views) are available for the users, they might want to know how many times THEIR short url has been used.

Otherwise, the code should check if a key has already been associated to that url. But then, we would need a way to [lock](https://github.com/Philmod/node-redis-lock) the request for a specific url.

Another open question would be : "What about `http://` vs `https://`"? Do they have a different short url?

## Todo
- Deploy a live demo on AWS
- Make the admin session persistent and available across many servers/thread (Redis)
- Logout
- Docker
- API: restrict the getAll urls with the username/password
- Paginate the admin page, not to show all the urls
- If the service is very popular, and there is no more free unique id, increase the number of characters required for an id
- Right now, a new id is created randomly; it will take more and more time when the free space will reduce
- Use a Bloom Filter to check for the existence of a given id
- Buffer the incrementView calls (Redis), and so update one entry once for many views
- Stub the database's client for the tests
- Deal with DynamoDB's throughput limits
- Add a expire option
