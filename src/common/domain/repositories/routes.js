import loadBlankPage from "../usecases/load_blank_page.js";
import loadHomePage from "../usecases/load_home_page.js";
import loadTestPage from "../usecases/load_test_page.js";

/**
 * @typedef {import("../entities/types.js").DataRepos} DataRepos
 */

/**
 * @typedef RoutesRepoProps
 * @property {DataRepos} data_repos
 */

export default class RoutesRepo {
  /**
   * @type {DataRepos}
   */
  #data_repos;

  /**
   *
   * @param {RoutesRepoProps} props
   */
  constructor({ data_repos }) {
    this.#data_repos = data_repos;
  }

  /**
   *
   * @param {import("../entities/types.js").Router} router
   */
  addPublicRoutes(router) {
    router.get("/", loadHomePage({
      rendering_repo: this.#data_repos.rendering,
    }));

    router.get("/test", loadTestPage({
      rendering_repo: this.#data_repos.rendering,
    }));

    router.get("/blank", loadBlankPage({
      rendering_repo: this.#data_repos.rendering,
    }));
  }
}
