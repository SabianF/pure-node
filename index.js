import initRepos from "./src/common/data/repositories/repositories.js";

/**
 * @typedef {import("./src/common/data/repositories/routing.js").default} RoutingRepo
 * @typedef {import("./src/common/domain/entities/types.js").Router} Router
 */

// TODO(server-mocking): try out request interception: https://medium.com/@maulanamaleek/intercept-http-request-using-serviceworker-b6ef23f97d1f
// https://blog.logrocket.com/intercepting-javascript-fetch-api-requests-responses/

// TODO(file-mgmt): impl basic file upload, storage, display

function runApp() {
  const {
    data_repos,
    domain_repos,
  } = initRepos();

  const init_env = data_repos.env.initEnv();
  if (init_env.has_error) {
    return console.error(init_env.error);
  }

  const router = data_repos.routing.createRouter();
  const port = process.env.PORT;

  domain_repos.server.addMiddleware(router);
  domain_repos.server.addPublicRoutes(router);

  router.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
  });
}

runApp();
