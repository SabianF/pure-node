# Overview

A zero-dependency (totally internal) NodeJS server build

# Architecture

Clean Architecture (Uncle Bob)

## File structure

```
.
├───public
│   └───(static files)
└───src
    ├───data
    │   ├───models
    │   │   └───(for translating external data sources into entities)
    │   ├───repositories
    │   │   └───(internal libraries for parsing & validating external data, and error handling)
    │   └───sources
    │       ├───packages
    │       │   └───(localized npm packages)
    │       └───(interfaces and wrappers for external dependencies/libraries)
    ├───domain
    │   ├───entities
    │   │   └───(data models)
    │   ├───repositories
    │   │   └───(business logic for validated entities)
    │   └───usecases
    │       └───(client-side functionality)
    └───presentation
        ├───state
        │   └───(unused; using HATEOAS)
        ├───components
        │   └───(HTML, CSS, client-side JS)
        └───pages
            └───(HTML, CSS, client-side JS)
```

# Features

## HTTP server + router

- Rudimentary HTTP server that listens on the configured PORT
- Handles
  - Routes
  - Middleware
  - Endware (executes at end of request/response cycle, before response is sent)
- Logs all requests
- Serves HTML

The server is started by

1. Instantiating the routing repository `src\data\repositories\routing_repo.js`
2. Instantiating a router `src\data\sources\router\src\domain\entities\router.js`
3. Adding handlers to the router for middleware and URLs `src\data\sources\router\src\domain\entities\handler.js`
4. Calling the router's `listen` function with a port

The server handles requests by

1. Iterating through the router's array of handlers, executing any middleware, and executing the first matching route and returning
2. If no routes match the request, handles the "not found" case by default

## Static file server

TODO: Document static file server

## Component nesting

TODO: Write a case study for rendering nested components (binary tree? navigating nested structures, recursion)

# Resources

- https://medium.com/khojchakra/a-simple-nodejs-server-without-express-js-6773122d365f
- https://adrianmejia.com/building-a-node-js-static-file-server-files-over-http-using-es6/
