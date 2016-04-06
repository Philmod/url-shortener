# url-shortener
Webserver to shorten url and redirect pages

## Done
+ Webserver which responds to a status page [GET /status]
+ Web page with a form to enter a full url [GET /]
+ Route to submit a new url [POST /url]
+ Route to redirect from shorten url to full url [GET /:id]
+ Admin page with the list of all shortened [GET /admin]

## Todo
- Change the local memory into a persistent one
- API: shorten an url [POST /api/urls]
- API: get information about an url [POST /api/urls/:id]
- API: get all urls information [GET /api/urls]
- Lock to avoid having the same url submitted at the same time
- Make the admin session persistent and available for many servers/thread (redis)
- Logout
- Circle CI
- Docker
- Add a expire option
