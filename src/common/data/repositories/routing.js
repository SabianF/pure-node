import { validateType } from "../../domain/repositories/utilities.js";
import RouterLib from "../sources/router_lib.js";
import FileSystemRepo from "./file_system.js";

/**
 * @typedef {import("../../domain/entities/types.js").Router} Router
 */

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
    return this.#router_lib.createRouter();
  }

  createStaticHandler(base_path) {
    return this.#router_lib.createStaticHandler(base_path);
  }
}

function validateRouterLib(router_lib) {
  return validateType({ router_lib }, RouterLib.name);
}

function validateFsRepo(fs_repo) {
  return validateType({ fs_repo }, FileSystemRepo.name);
}
