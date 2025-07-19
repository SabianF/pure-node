import FileSystemRepo from "../../data/repositories/file_system.js";
import HttpRepo from "../../data/repositories/http_repo.js";
import http_status_codes from "../../data/sources/http_status_codes.js";
import addMiddleware from "../usecases/add_middleware.js";
import addRequestHandler from "../usecases/add_request_handler.js";
import handleStatic from "../usecases/handle_static.js";
import startServer from "../usecases/start_server.js";
import { validateRequestMethod, validateRequestUrl } from "./utilities.js";

/**
 * @typedef {import("../entities/types.js").HttpRequest} HttpRequest
 */

/**
 * @typedef {import("../entities/types.js").HttpResponse} HttpResponse
 */

/**
 * @typedef {import("../entities/types.js").HttpRequestHandler} HttpRequestHandler
 */

/**
 * @typedef {import("../entities/types.js").ErrorHandlerFunction} ErrorHandlerFunction
 */

/**
 * @typedef {import("../entities/types.js").Handler} Handler
 */

/**
 * @typedef {import("../entities/types.js").RouterModel} RouterModel
 */

export default class RoutingRepo {
  /**
   * @type {FileSystemRepo}
   */
  #fs_repo;

  /**
   * @type {HttpRepo}
   */
  #http_repo;

  constructor({
    fs_repo,
    http_repo,
  }) {
    this.#fs_repo = fs_repo;
    this.#http_repo = http_repo;

    this.addMiddleware = addMiddleware;
    this.addRequestHandler = addRequestHandler;
    this.startServer = startServer;
  }

  handleStatic(base_path) {
    return handleStatic({
      fs_repo: this.#fs_repo,
      base_path,
    })
  }

  /**
   *
   * @param {RouterModel} router
   */
  createServer(router) {
    const request_handler = this.createRequestHandler(
      router.getRequestHandlers(),
      router.getErrorHandlers(),
    );
    const server = this.#http_repo.createServer(request_handler);
    return server;
  }

  /**
   *
   * @param {Handler[]} handlers
   * @param {ErrorHandlerFunction[]} error_handlers
   */
  createRequestHandler(handlers, error_handlers) {
    /**
     * @type {HttpRequestHandler}
     */
    const request_handler = async (request, response) => {
      response.setHeader("Content-Type", "text/html; charset=utf-8");

      const normalized_url = validateRequestUrl(request.url, response);
      const normalized_method = validateRequestMethod(request.method, response);

      /**
       * @type {Error}
       */
      let err;

      await this.executeHandlers(
        handlers,
        normalized_url,
        normalized_method,
        request,
        response,
        err,
      );

      if (response.writableEnded) {
        return;
      }

      this.executeErrorHandlers(error_handlers, err, request, response);

      response.end();
    };

    return request_handler;
  }

  /**
   *
   * @param {Handler[]} handlers
   * @param {string} normalized_url
   * @param {string} normalized_method
   * @param {HttpRequest} request
   * @param {HttpResponse} response
   * @param {Error} error
   */
  async executeHandlers(
    handlers,
    normalized_url,
    normalized_method,
    request,
    response,
    error,
  ) {
    for (const handler of handlers) {
      if (response.writableEnded) {
        break;
      }

      if (handler.is_middleware) {
        await handler.handler_function(request, response);
        continue;
      }

      if (handler.url !== normalized_url) {
        continue;
      }

      if (handler.method !== normalized_method) {
        continue;
      }

      await handler.handler_function(request, response);
      response.end();
      return;
    }

    error = new Error("Not found");
  }

  /**
   *
   * @param {ErrorHandlerFunction[]} error_handlers
   * @param {Error} err
   * @param {HttpRequest} request
   * @param {HttpResponse} response
   */
  executeErrorHandlers(error_handlers, err, request, response) {
    for (let i = 0; i < error_handlers.length; i++) {
      if (err) {
        break;
      }

      const error_handler = error_handlers[i];
      error_handler(err, request, response);
    }

    if (response.writableEnded) {
      return;
    }

    this.handleNotFound(request, response);
  }

  /**
   *
   * @param {Error} error
   * @param {http.ClientRequest} request
   * @param {http.ServerResponse<http.ClientRequest>} response
   */
  async handleNotFound(request, response) {
    const message = http_status_codes.reasons.NOT_FOUND;
    response.statusCode = http_status_codes.codes.NOT_FOUND;
    response.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport"  content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible"  content="ie=edge">
          <title>${message}</title>
        </head>
        <body>
          <h1>${message}: ${request.url}</h1>
        </body>
      </html>
    `);
  }
}
