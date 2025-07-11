import { logRequests } from "./src/data/repositories/middleware.js";
import RenderingRepo from "./src/data/repositories/rendering_repo.js";
import RoutingRepo from "./src/data/repositories/routing_repo.js";
import FileSystemIo from "./src/data/sources/file_system_io.js";
import HtmlRenderer from "./src/data/sources/html_renderer.js";
import Router from "./src/data/sources/router/index.js";
import rootPage from "./src/presentation/pages/root.js";

function runApp() {
  const router_library = new Router();
  const routing_repo = new RoutingRepo({
    router_library: router_library,
  });

  const file_system_io_library = new FileSystemIo();
  const html_renderer_library = new HtmlRenderer();
  const rendering_repo = new RenderingRepo({
    file_system_io_library,
    html_renderer_library,
  });

  const router = routing_repo.createRouter();
  const port = 3333;

  router.use(logRequests);

  router.get("/", async (request, response) => {
    const page = await rendering_repo.renderPage(
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
