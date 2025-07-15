import { logRequests } from "./src/data/repositories/middleware.js";
import { initRepos } from "./src/data/repositories/repositories.js";
import loadHomePage from "./src/domain/usecases/load_home_page.js";
import loadTestPage from "./src/domain/usecases/load_test_page.js";

function runApp() {
  const repos = initRepos();

  repos.env.initEnv();

  const router = repos.routing.createRouter();
  const port = 3333;

  router.use(logRequests);
  router.use(repos.routing.handleStatic("public/"));

  router.get("/", loadHomePage({
    rendering_repo: repos.rendering,
  }));

  router.get("/test", loadTestPage({
    rendering_repo: repos.rendering,
  }));

  router.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
  });
}

runApp();
