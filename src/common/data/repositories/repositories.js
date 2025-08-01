import FileSystemLib from "../sources/file_system_lib.js";
import HtmlRenderingLib from "../sources/html_rendering_lib.js";
import EnvLib from "../sources/env_lib.js";
import EnvRepo from "./environment.js";
import RenderingRepo from "./rendering.js";
import RoutingRepo from "./routing.js";
import FileSystemRepo from "./file_system.js";
import ServerRepo from "../../domain/repositories/server.js";
import RouterLib from "../sources/router_lib.js";

/**
 * @typedef Repositories
 * @property {DataRepos} data_repos
 * @property {DomainRepos} domain_repos
 */

/**
 * @callback InitReposFunction
 * @returns {Repositories}
 */

/**
 * @type {InitReposFunction}
 */
export default function initRepos() {
  const data_repos = new DataRepos();

  const domain_repos = new DomainRepos({
    data_repos: data_repos,
  });

  return {
    data_repos: data_repos,
    domain_repos: domain_repos,
  };
}

class DataRepos {
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
  const router_lib = new RouterLib();

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
    components_dirs: [
      "src/common/presentation/components",
      "src/common/presentation/pages",
    ],
  };

  const rendering = new RenderingRepo({
    file_system_io_library,
    html_renderer_library,
    config,
  });

  return rendering;
}

/**
 * @typedef DomainReposProps
 * @property {DataRepos} data_repos
 */

class DomainRepos {
  /**
   * @type {ServerRepo}
   */
  server;

  /**
   *
   * @param {DomainReposProps} props
   */
  constructor({
    data_repos,
  }) {
    this.server = new ServerRepo({
      routing_repo: data_repos.routing,
      rendering_repo: data_repos.rendering,
    });
  }
}
