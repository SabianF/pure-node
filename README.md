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

## Initialization

The app is first initialized by
1. Injecting `Data sources` (titled as `[name]Lib`) into `Data repositories` (titled as `[name]Repo`)
2. Injecting `Data repositories` into `Domain repositories` (titled as `[name]Repo` and whose names are unique from `Data repositories`)
3. Injecting `Domain repositories` into `Usecases` which are interfaces for the client to trigger
4. TODO

# Features

## HTTP server + router

> Doing this more "manually" was an interesting challenge, as I previously had only used ExpressJS for convenience, without fully-understanding what it was doing. However, after digging through the fundamentals, I realized how a server router works is simple: listening on a port for HTTP request events, and handling these events.

- Rudimentary HTTP server that listens on the configured PORT
- Handles
  - Middleware
  - Routes
- Logs all requests
- Serves HTML

The HTTP server is started by

1. Instantiating the routing repository `src\data\repositories\routing_repo.js`
2. Instantiating a router `src\data\sources\router\src\domain\entities\router.js`
3. Adding handlers to the router for middleware (`use()`) and URLs (`get()`, `post()`, etc) `src\data\sources\router\src\domain\entities\handler.js`
4. Calling the router's `listen()` function with a port

The server handles requests by

1. Iterating through the router's array of handlers, executing any middleware, and executing the first matching route before sending the response
2. If no routes match the request, handles the "not found" case by default

### Static file serving

> This was fairly difficult for me, and took me about 2 hours of research and 2 hours of trial-and-error to figure out.

The router serves static files when the `handleStatic()` handler is added as middleware with a `path` parameter. What this handler exposes static files within this path and its subfolders by

1. Checking the provided base path if it exists, throwing an error if not
2. Normalizing the base path to remove any extraneous characters
3. Using the base path as a "top-level" directory, preventing the client from knowing or needing to provide it in the request
4. Sanitizing the client-requested path, to prevent unintended parent folder traversal
5. Checking if the client-requested path leads to a file, skipping if not
6. Checking if the file exists, returning 404 if not
7. Setting the response's `Content-Type` header according to the accessed file's extension
8. Reading the actual file data
9. Sending the file data in the response

// TODO: Document challenges with handling static file serving as middleware, error handling, returning 404, etc. Also document solutions (response wrapper, wsa_handled, etc)

### Caching

> After reading up on MDN, I understood how standard browser caching works using [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control) values, and how to refresh the cache if the server data has changed using [Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Last-Modified) and [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/If-Modified-Since) headers in [Conditional Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests).

For **static resources**, the router sets the `Cache-Control` header to stay fresh for 5 seconds with a `Last-Modified` header for files, which allows enough time for multiple near-simultaneous client requests to pull the same resources directly from the client cache, and also ensures the client checks with the server for any updates to these resources.

- If the requested resource has **not** been updated, the server sends a 304 and the client reuses its cached version
- If the requested resource **has** been updated, then the server returns the resource with a 200, and the client overwrites its cache with the new resource

// TODO: Webpage caching using hashes

## Component nesting

> This was very difficult for me, initially, and took me about 2 days (2-4 hours each) to figure out an algorithm.

Components are composed of 1-3 parts/files:

1. HTML template
2. CSS
3. Client-side JS

Components are managed like so:

1. An HTML file is created (e.g. `.../components/hat.html` -> `<div class="hat">I'm wearing a {{type}}</div>`)
2. A function is created to create a Component, identify the HTML template's placeholders with intellisense, and provide data for them (e.g. `.../components/hat.js` -> `hat(placeholders: HatPlaceholders): Component`)
3. The `Component` instance is provided to `RenderingRepo.renderComponent()` which
   1. Searches for the HTML file in `.../components` based on the `Component.name`
   2. Reads the file data as an HTML template
   3. Renders data into its placeholders, if any
   4. Returns rendered HTML

- This function also checks the `Component`'s placeholders for any nested `Component`s, and if it finds any, it
  1.  Recursively goes to the bottom of the tree of nested `Component`s
  2.  Renders the current (bottom) `Component`
  3.  Replaces the parent of the current component with the rendered `Component`
  4.  Recursively renders and replaces all nested `Component`s back up to the top of the tree
  5.  Returns the final rendered HTML
      > This was seriously the most difficult part for me. This nested recursion was about 95% of the 2 days I spent figuring this out.

# Resources

- https://medium.com/khojchakra/a-simple-nodejs-server-without-express-js-6773122d365f
- https://adrianmejia.com/building-a-node-js-static-file-server-files-over-http-using-es6/
- https://blog.frankel.ch/web-caching/client/
- https://dev.to/didof/the-art-of-efficient-web-browsing-public-resources-27hl
