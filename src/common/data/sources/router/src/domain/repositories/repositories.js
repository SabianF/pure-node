import RoutingRepo from "./routing.js";

export default class DomainRepos {
  /**
   *
   * @param {import("../entities/types.js").DataRepos} data_repos
   */
  constructor({ data_repos }) {
    this.routing_repo = new RoutingRepo({
      http_repo: data_repos.http_repo,
      fs_repo: data_repos.fs_repo,
    });
  }
}
