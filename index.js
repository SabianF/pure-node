import { logRequests } from "./src/data/repositories/middleware.js";
import { initRepos } from "./src/data/repositories/repositories.js";
import rootPage from "./src/presentation/pages/root.js";

function runApp() {
  const repos = initRepos();

  repos.env.initEnv();

  const router = repos.routing.createRouter();
  const port = 3333;

  router.use(logRequests);
  router.use(repos.routing.handleStatic("public/"));

  router.get("/", async (request, response) => {
    const page = await repos.rendering.renderPage(
      rootPage({
        message: "Greetings, humans!",
      }),
    );
    response.write(page);
  });

  router.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
  });
}

runApp();
