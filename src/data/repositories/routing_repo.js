import { validateType } from "../../domain/repositories/utilities.js";
import Router from "../sources/router/index.js";
import FileSystemRepo from "../sources/router/src/data/repositories/file_system.js";
import handleStatic from "../sources/router/src/domain/usecases/handle_static.js";

/**
 * @typedef RoutingRepoProps
 * @property {Router} router_lib
 * @property {FileSystemRepo} fs_repo
 */

export default class RoutingRepo {
  /**
   * @type {Router} router
   */
  router_lib;

  /**
   * @type {FileSystemRepo}
   */
  fs_repo;

  /**
   *
   * @param {RoutingRepoProps} props
   */
  constructor({ router_lib, fs_repo }) {
    this.router_lib = validateRouterLib(router_lib);
    this.fs_repo = validateFsRepo(fs_repo);
  }

  createRouter() {
    return new Router();
  }

  /**
   *
   * @param {string} path
   */
  handleStatic(path) {
    return handleStatic({
      fs_repo: this.fs_repo,
      path: path,
    });
  }
}

function validateRouterLib(router_lib) {
  if (
    !router_lib ||
    typeof router_lib !== "object" ||
    router_lib.constructor.name !== Router.name
  ) {
    throw new Error(`No/invalid router_lib provided to ${RoutingRepo.name}: [${router_lib}]`);
  }

  return router_lib;
}

function validateFsRepo(fs_repo) {
  return validateType(fs_repo, FileSystemRepo.name);
}
