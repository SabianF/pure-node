import loadPage from "../usecases/load_page.js";

/**
 * @typedef {import("../entities/types.js").HttpRequestHandler} HttpRequestHandler
 */

/**
 * @typedef {import("../entities/types.js").DataRepos} DataRepos
 */

/**
 * @typedef ServerRepoProps
 * @property {DataRepos} data_repos
 */

export default class ServerRepo {
  /**
   * @type {DataRepos}
   */
  #data_repos;

  /**
   *
   * @param {ServerRepoProps} props
   */
  constructor({ data_repos }) {
    this.#data_repos = data_repos;
  }

  /**
   *
   * @param {import("../entities/types.js").Router} router
   */
  addPublicRoutes(router) {
    router.get("/", async (request, response) => {
      const home_page = loadPage("ROOT");
      const rendered_home_page = await this.#data_repos.rendering.renderPage(home_page);
      response.writeHtml(rendered_home_page);
    });

    router.get("/test", async (request, response) => {
      const test_page = loadPage("TEST");
      const rendered_test_page = await this.#data_repos.rendering.renderPage(test_page);
      response.writeHtml(rendered_test_page);
    });

    router.get("/blank", async (request, response) => {
      const blank_page = loadPage("BLANK");
      const rendered_blank_page = await this.#data_repos.rendering.renderPage(blank_page);
      response.writeHtml(rendered_blank_page);
    });
  }
}
