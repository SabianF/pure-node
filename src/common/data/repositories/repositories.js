import FileSystemLib from "../sources/file_system_lib.js";
import HtmlRenderingLib from "../sources/html_rendering_lib.js";
import EnvLib from "../sources/env_lib.js";
import Router from "../sources/router/index.js";
import EnvRepo from "./environment.js";
import RenderingRepo from "./rendering.js";
import RoutingRepo from "./routing_repo.js";
import FileSystemRepo from "./file_system.js";

export default class DataRepos {
  constructor() {
    this.env = initEnvRepo();
    this.fs = initFsRepo();
    this.routing = initRoutingRepo(this.fs);
    this.rendering = initRenderingRepo();
  }
}

function initEnvRepo() {
  const env_lib = new EnvLib();
  const env_repo = new EnvRepo({
    env_lib,
  });

  return env_repo;
}

function initFsRepo() {
  const fs_lib = new FileSystemLib();

  const fs_repo = new FileSystemRepo({
    fs_lib,
  });

  return fs_repo;
}

/**
 *
 * @param {FileSystemRepo} fs_repo
 */
function initRoutingRepo(fs_repo) {
  const router_lib = new Router();

  const routing = new RoutingRepo({
    router_lib,
    fs_repo,
  });

  return routing;
}

function initRenderingRepo() {
  const file_system_io_library = new FileSystemLib();
  const html_renderer_library = new HtmlRenderingLib();
  /**
   * @type {import("./rendering.js").RenderingRepoConfig}
   */
  const config = {
    components_dir: "src/common/presentation/components",
    pages_dir: "src/common/presentation/pages",
  };

  const rendering = new RenderingRepo({
    file_system_io_library,
    html_renderer_library,
    config,
  });

  return rendering;
}
