import { logRequests } from "../../data/repositories/middleware.js";
import RoutingRepo from "../../data/repositories/routing.js";
import { getHttpStatusCodes } from "../../data/sources/pure-router/src/domain/repositories/utilities.js";
import blankPage from "../../presentation/pages/blank.js";
import rootPage from "../../presentation/pages/root.js";
import testPage from "../../presentation/pages/test.js";

/**
 * @typedef {import("../entities/types.js").HttpRequestHandler} HttpRequestHandler
 * @typedef {import("../entities/types.js").DataRepos} DataRepos
 * @typedef {import("../entities/types.js").RenderingRepo} RenderingRepo
 * @typedef {import("../entities/types.js").RoutingRepo} RoutingRepo
 * @typedef {import("../entities/types.js").Router} Router
 */

/**
 * @typedef ServerRepoProps
 * @property {RoutingRepo} routing_repo
 * @property {RenderingRepo} rendering_repo
 */

export default class ServerRepo {
  /**
   * @type {RoutingRepo}
   */
  #routing_repo;

  /**
   * @type {RenderingRepo}
   */
  #rendering_repo;

  /**
   *
   * @param {ServerRepoProps} props
   */
  constructor({ routing_repo, rendering_repo }) {
    if (!routing_repo || (routing_repo instanceof RoutingRepo) === false) {
      throw new Error("Missing/invalid routing_repo", { cause: routing_repo });
    }
    this.#routing_repo = routing_repo;

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
        response.sendHtml(error);
      }

      response.setStatus(getHttpStatusCodes().codes.OK);
      response.sendHtml(rendered_home_page.data);
    });

    router.get("/test", async (request, response) => {
      const test_page = testPage();
      const rendered_test_page = await this.#rendering_repo.renderPage(test_page);
      if (rendered_test_page.has_error) {
        const error = rendered_test_page.error.message;
        response.setStatus(getHttpStatusCodes().codes.INTERNAL_SERVER_ERROR);
        response.sendHtml(error);
      }

      response.setStatus(getHttpStatusCodes().codes.OK);
      response.sendHtml(rendered_test_page.data);
    });

    router.get("/blank", async (request, response) => {
      const blank_page = blankPage();
      const rendered_blank_page = await this.#rendering_repo.renderPage(blank_page);
      if (rendered_blank_page.has_error) {
        const error = rendered_blank_page.error.message;
        response.setStatus(getHttpStatusCodes().codes.INTERNAL_SERVER_ERROR);
        response.sendHtml(error);
      }

      response.setStatus(getHttpStatusCodes().codes.OK);
      response.sendHtml(rendered_blank_page.data);
    });
  }

  /**
   *
   * @param {Router} router
   */
  addMiddleware(router) {
    router.use(logRequests);
    router.use(this.#routing_repo.createStaticHandler("public/"));

    // router.handleError((error, request, response) => {
    //   if (error.status_code === getHttpStatusCodes().codes.NOT_FOUND) {
    //     response.setStatus(getHttpStatusCodes().codes.NOT_FOUND);
    //     response.sendHtml("<h1>Not found, bro</h1>");
    //   }
    // });
  }
}
