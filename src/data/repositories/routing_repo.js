import { validateType } from "../../domain/repositories/utilities.js";
import RouterLib from "../sources/router/index.js";
import FileSystemRepo from "../sources/router/src/data/repositories/file_system.js";
import handleStatic from "../sources/router/src/domain/usecases/handle_static.js";

/**
 * @typedef RoutingRepoProps
 * @property {RouterLib} router_lib
 * @property {FileSystemRepo} fs_repo
 */

export default class RoutingRepo {
  /**
   * @type {RouterLib} router
   */
  #router_lib;

  /**
   * @type {FileSystemRepo}
   */
  #fs_repo;

  /**
   *
   * @param {RoutingRepoProps} props
   */
  constructor({ router_lib, fs_repo }) {
    this.#router_lib = validateRouterLib(router_lib);
    this.#fs_repo = validateFsRepo(fs_repo);
  }

  createRouter() {
    return this.#router_lib.create();
  }

  /**
   *
   * @param {string} base_path
   */
  handleStatic(base_path) {
    return handleStatic({
      fs_repo: this.#fs_repo,
      base_path: base_path,
    });
  }
}

function validateRouterLib(router_lib) {
  return validateType({ router_lib }, RouterLib.name);
}

function validateFsRepo(fs_repo) {
  return validateType({ fs_repo }, FileSystemRepo.name);
}
