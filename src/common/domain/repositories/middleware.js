import { logRequests } from "../../data/repositories/middleware.js";
import http_status_codes from "../../data/sources/packages/http_status_codes.js";

/**
 * @typedef {import("../entities/types.js").DataRepos} DataRepos
 */

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

  /**
   *
   * @param {import("../entities/types.js").Router} router
   */
  addMiddleware(router) {
    router.use(logRequests);
    router.use(this.#data_repos.routing.handleStatic(router, "public/"));

    router.handleError((error, request, response) => {
      if (error.status_code === http_status_codes.codes.NOT_FOUND) {
        response.setStatus(http_status_codes.codes.NOT_FOUND);
        response.writeHtml("<h1>Not found, bro</h1>");
      }
    });
  }
}
