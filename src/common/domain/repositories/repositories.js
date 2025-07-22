import ServerRepo from "./server.js";

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

    this.server = this.#initServerRepo(data_repos.rendering);
  }

  #initServerRepo(rendering_repo) {
    return new ServerRepo({
      rendering_repo: rendering_repo,
    });
  }
}
