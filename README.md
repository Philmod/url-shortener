# url-shortener
Webserver to shorten url and redirect pages

## How does that work?

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
- Create table in local dynamodb
```
npm run dynamo:createLocalTable
```

## Tests
The tests are using a local dynamodb table for now in order to make sure everything is working perfectly with the database.
It should be better and the tests would run faster by stubbing the database's client.
```
npm test
```

## Run server
```
npm start
```
And visit `http://localhost:3070`

## Database's content
To scan the content of the database:
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

## Debates
### Unique short url by full url
For now, each time a same url is requested to be shorten, a new short url is created.
In the case of the statistics (number of views) are available for the users, they might want to know how many times THEIR short url has been used.
Otherwise, the code should check if a key has already been associated to that url.
Another question is : "What about http:// vs https://"? Do they have a different short url?

## Todo
- Lock to avoid having the same url submitted at the same time
- Make the admin session persistent and available for many servers/thread (redis)
- Logout
- Circle CI
- Docker
- Add a expire option
- If the service is very popular, and there is no more free unique id, increase the number of characters of the id
- Right now, a new id is created randomly; it will take more and more time when the free space will reduce
- Use a Bloom Filter to check for the existence of a given id
- Buffer the incrementView calls (Redis), and so update one entry once for many views
- Stub the database's client for the tests
- Deal with DynamoDB's throughput limits
