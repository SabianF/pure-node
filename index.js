import RoutingRepo from "./src/data/repositories/routing_repo.js";
import Router from "./src/data/sources/router.js";

function runApp() {
  const router_library = new Router();
  const routing_repo = new RoutingRepo({
    router_library: router_library,
  });

  const router = routing_repo.createRouter();
  const port = 3333;

  router.get("/", (request, response) => {
    response.write("<h1>Hello</h1>");
  });

  router.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
  });
}

runApp();
