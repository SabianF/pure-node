# Overview

A zero-dependency (totally internal) NodeJS server build

# Architecture

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Composable](https://www.storyblok.com/mp/composable-architecture)
- [DI (Dependency injection)](https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified)
- [SSR (Server-side rendering)](https://developer.mozilla.org/en-US/docs/Glossary/SSR)
- [HATEOAS (Hypermedia-as-the-engine-of-application-state)](https://htmx.org/essays/hateoas/)

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
        │   └───(unused; using SSR & HATEOAS)
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

The router serves static files when it is provided a `path` parameter by

1. Checking the path to expose if it exists, throwing an error if not
2. Normalizing the path to remove any extraneous characters
3. Sanitizing the client-requested path, to prevent unintended parent folder traversal
4. Checking if the client-requested path leads to a file, skipping if not
5. Checking if the file exists, returning 404 if not
6. Setting the response's `Content-Type` header according to the accessed file's extension
7. Reading the actual file data
8. Sending the file data in the response

## Component nesting

TODO: Write a case study for rendering nested components (binary tree? navigating nested structures, recursion)

# Resources

- https://medium.com/khojchakra/a-simple-nodejs-server-without-express-js-6773122d365f
- https://adrianmejia.com/building-a-node-js-static-file-server-files-over-http-using-es6/
