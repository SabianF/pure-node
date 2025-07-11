import FileSystemIo from "../sources/file_system_io.js";
import HtmlRenderer from "../sources/html_renderer.js";
import Router from "../sources/router/index.js";
import RenderingRepo from "./rendering_repo.js";
import RoutingRepo from "./routing_repo.js";

export function initRepos() {
  const routing = initRoutingRepo();
  const rendering = initRenderingRepo();

  return {
    routing,
    rendering,
  };
}

function initRoutingRepo() {
  const router_library = new Router();

  const routing = new RoutingRepo({
    router_library: router_library,
  });

  return routing;
}

function initRenderingRepo() {
  const file_system_io_library = new FileSystemIo();
  const html_renderer_library = new HtmlRenderer();

  const rendering = new RenderingRepo({
    file_system_io_library,
    html_renderer_library,
  });

  return rendering;
}
