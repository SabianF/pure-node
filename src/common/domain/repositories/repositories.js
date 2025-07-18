import MiddlewareRepo from "./middleware.js";
import RoutesRepo from "./routes.js";

/**
 * @typedef {import("../entities/types.js").DataRepos} DataRepos
 */

/**
 * @typedef DomainReposProps
 * @property {DataRepos} data_repos
 */

export default class DomainRepos {
  /**
   * @type {DataRepos}
   */
  #data_repos;

  /**
   *
   * @param {DomainReposProps} props
   */
  constructor({
    data_repos,
  }) {
    this.#data_repos = data_repos;

    this.middleware = this.#initMiddlewareRepo(data_repos);
    this.routes = this.#initRoutesRepo(data_repos);
  }

  #initMiddlewareRepo(data_repos) {
    return new MiddlewareRepo({
      data_repos: data_repos,
    });
  }

  #initRoutesRepo(data_repos) {
    return new RoutesRepo({
      data_repos: data_repos,
    });
  }
}
