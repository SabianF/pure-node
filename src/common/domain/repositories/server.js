import { logRequests } from "../../data/repositories/middleware.js";
import { getHttpStatusCodes } from "../../data/sources/router/src/domain/repositories/utilities.js";
import loadPage from "../usecases/load_page.js";

/**
 * @typedef {import("../entities/types.js").HttpRequestHandler} HttpRequestHandler
 * @typedef {import("../entities/types.js").DataRepos} DataRepos
 * @typedef {import("../entities/types.js").RenderingRepo} RenderingRepo
 * @typedef {import("../entities/types.js").Router} Router
 */

/**
 * @typedef ServerRepoProps
 * @property {RenderingRepo} rendering_repo
 */

export default class ServerRepo {
  /**
   * @type {RenderingRepo}
   */
  #rendering_repo;

  /**
   *
   * @param {ServerRepoProps} props
   */
  constructor({ rendering_repo }) {
    this.#rendering_repo = rendering_repo;
  }

  /**
   *
   * @param {Router} router
   */
  addPublicRoutes(router) {
    router.get("/", async (request, response) => {
      const home_page = loadPage("ROOT");
      const rendered_home_page = await this.#rendering_repo.renderPage(home_page);
      response.writeHtml(rendered_home_page);
    });

    router.get("/test", async (request, response) => {
      const test_page = loadPage("TEST");
      const rendered_test_page = await this.#rendering_repo.renderPage(test_page);
      response.writeHtml(rendered_test_page);
    });

    router.get("/blank", async (request, response) => {
      const blank_page = loadPage("BLANK");
      const rendered_blank_page = await this.#rendering_repo.renderPage(blank_page);
      response.writeHtml(rendered_blank_page);
    });
  }

  /**
   *
   * @param {RoutingRepo} routing_repo
   * @param {Router} router
   */
  addMiddleware(router) {
    router.use(logRequests);
    router.use(router.handleStatic("public/"));

    router.handleError((error, request, response) => {
      if (error.status_code === getHttpStatusCodes().codes.NOT_FOUND) {
        response.setStatus(getHttpStatusCodes().codes.NOT_FOUND);
        response.writeHtml("<h1>Not found, bro</h1>");
      }
    });
  }
}
