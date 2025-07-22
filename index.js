import { logRequests } from "./src/common/data/repositories/middleware.js";
import DataRepos from "./src/common/data/repositories/repositories.js";
import DomainRepos from "./src/common/domain/repositories/repositories.js";

/**
 * @typedef {import("./src/common/data/repositories/routing.js").default} RoutingRepo
 * @typedef {import("./src/common/domain/entities/types.js").Router} Router
 */

// TODO(caching): implement caching
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control

// TODO(server-mocking): try out request interception: https://medium.com/@maulanamaleek/intercept-http-request-using-serviceworker-b6ef23f97d1f
// https://blog.logrocket.com/intercepting-javascript-fetch-api-requests-responses/

// TODO(file-mgmt): impl basic file upload, storage, display

// TODO: Refactor pure-node router request handler into modular subfunctions

function runApp() {
  const data_repos = new DataRepos();
  data_repos.env.initEnv();

  const domain_repos = new DomainRepos({
    data_repos: data_repos,
  });

  const router = data_repos.routing.createRouter();
  const port = process.env.PORT;

  addMiddleware(data_repos.routing, router);
  domain_repos.routes.addPublicRoutes(router);

  router.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
  });
}

/**
 *
 * @param {RoutingRepo} routing_repo
 * @param {Router} router
 */
export function addMiddleware(routing_repo, router) {
  router.use(logRequests);
  router.use(router.handleStatic("public/"));

  router.handleError((error, request, response) => {
    if (error.status_code === http_status_codes.codes.NOT_FOUND) {
      response.setStatus(http_status_codes.codes.NOT_FOUND);
      response.writeHtml("<h1>Not found, bro</h1>");
    }
  });
}

runApp();
