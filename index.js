import { logRequests } from "./src/common/data/repositories/middleware.js";
import DataRepos from "./src/common/data/repositories/repositories.js";
import DomainRepos from "./src/common/domain/repositories/repositories.js";

//? HTMX: onGet(url, callback) is a global function that intercepts `hx-get`
//? to the `url` and executes the `callback`. All the functions are
//? - `onDelete()`
//? - `onGet()`
//? - `onPost()`
//? - `onPut()`

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
