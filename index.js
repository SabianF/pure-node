import DataRepos from "./src/common/data/repositories/repositories.js";
import DomainRepos from "./src/common/domain/repositories/repositories.js";

// TODO(router): implement caching
// https://blog.logrocket.com/intercepting-javascript-fetch-api-requests-responses/
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control

// TODO: try out request interception: https://medium.com/@maulanamaleek/intercept-http-request-using-serviceworker-b6ef23f97d1f

// TODO(file-mgmt): impl basic file upload, storage, display

function runApp() {
  const data_repos = new DataRepos();
  data_repos.env.initEnv();

  const domain_repos = new DomainRepos({
    data_repos: data_repos,
  });

  const router = data_repos.routing.createRouter();
  const port = process.env.PORT;

  domain_repos.middleware.addMiddleware(router);
  domain_repos.routes.addPublicRoutes(router);

  router.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
  });
}

runApp();
