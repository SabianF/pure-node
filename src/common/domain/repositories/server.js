import { logRequests } from "../../data/repositories/middleware.js";
import { getHttpStatusCodes } from "../../data/sources/router/src/domain/repositories/utilities.js";
import blankPage from "../../presentation/pages/blank.js";
import rootPage from "../../presentation/pages/root.js";
import testPage from "../../presentation/pages/test.js";

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
      const home_page = rootPage();
      const rendered_home_page = await this.#rendering_repo.renderPage(home_page);
      if (rendered_home_page.has_error) {
        const error = rendered_home_page.error.message;
        response.setStatus(getHttpStatusCodes().codes.INTERNAL_SERVER_ERROR);
        response.writeHtml(error);
      }

      response.setStatus(getHttpStatusCodes().codes.OK);
      response.writeHtml(rendered_home_page.data);
    });

    router.get("/test", async (request, response) => {
      const test_page = testPage();
      const rendered_test_page = await this.#rendering_repo.renderPage(test_page);
      if (rendered_test_page.has_error) {
        const error = rendered_test_page.error.message;
        response.setStatus(getHttpStatusCodes().codes.INTERNAL_SERVER_ERROR);
        response.writeHtml(error);
      }

      response.setStatus(getHttpStatusCodes().codes.OK);
      response.writeHtml(rendered_test_page.data);
    });

    router.get("/blank", async (request, response) => {
      const blank_page = blankPage();
      const rendered_blank_page = await this.#rendering_repo.renderPage(blank_page);
      if (rendered_blank_page.has_error) {
        const error = rendered_blank_page.error.message;
        response.setStatus(getHttpStatusCodes().codes.INTERNAL_SERVER_ERROR);
        response.writeHtml(error);
      }

      response.setStatus(getHttpStatusCodes().codes.OK);
      response.writeHtml(rendered_blank_page.data);
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
