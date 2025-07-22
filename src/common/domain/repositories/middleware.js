/**
 * @typedef {import("../entities/types.js").DataRepos} DataRepos
 */

import { logRequests } from "../../data/repositories/middleware.js";

/**
 * @typedef MiddlewareRepoProps
 * @property {DataRepos} data_repos
 */

export default class MiddlewareRepo {
  /**
   * @type {DataRepos}
   */
  #data_repos;

  /**
   *
   * @param {MiddlewareRepoProps} props
   */
  constructor({ data_repos }) {
    this.#data_repos = data_repos;
  }

  addMiddleware(router) {
    router.use(logRequests);
    router.use(this.#data_repos.routing.handleStatic(router, "public/"));
  }
}
