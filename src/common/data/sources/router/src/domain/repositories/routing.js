import { createHash } from "../../../../../../domain/repositories/utilities.js";
import ResponseModel from "../../data/models/response.js";
import http_status_codes from "../../data/sources/http_status_codes.js";
import RequestError from "../entities/request_error.js";
import addMiddleware from "../usecases/add_middleware.js";
import addRequestHandler from "../usecases/add_request_handler.js";
import handleStatic from "../usecases/handle_static.js";
import startServer from "../usecases/start_server.js";
import { getHttpStatusCodes, validateRequestMethod, validateRequestUrl } from "./utilities.js";

/**
 * @typedef {import("../entities/types.js").HttpRequest} HttpRequest
 */

/**
 * @typedef {import("../entities/types.js").ResponseModel} ResponseModel
 */

/**
 * @typedef {import("../entities/types.js").HttpRequestHandlerRaw} HttpRequestHandlerRaw
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

/**
 * @typedef {import("../entities/types.js").FileSystemRepo} FileSystemRepo
 */

/**
 * @typedef {import("../entities/types.js").HttpRepo} HttpRepo
 */

/**
 * @typedef {object} RoutingRepoProps
 * @property {FileSystemRepo} fs_repo
 * @property {HttpRepo} http_repo
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

  /**
   *
   * @param {RoutingRepoProps} param0
   */
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
    const request_handler = this.#createRequestHandler(
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
   * @returns {HttpRequestHandlerRaw}
   */
  #createRequestHandler(handlers, error_handlers) {
    return async (request, response) => {
      const response_model = new ResponseModel(response);

      try {
        await this.#executeHandlers(handlers, request, response_model);

      } catch (error) {
        await this.#executeErrorHandlers(error_handlers, error, request, response_model);

      } finally {
        this.#addDefaultHeaders(response_model);
        this.#handleNotModified(request, response_model);
        response_model.send();
      }
    }
  }

  /**
   *
   * @param {HttpRequest} request
   * @param {ResponseModel} response_model
   */
  #handleNotModified(request, response_model) {
    const request_etag = request.headers["if-none-match"];
    const response_etag = response_model.getHeader("ETag");

    if (request_etag === response_etag) {
      response_model.body = undefined;
      response_model.setStatus(
        getHttpStatusCodes().codes.NOT_MODIFIED,
      );
    }
  }

  /**
   *
   * @param {ResponseModel} response_model
   */
  #addDefaultHeaders(response_model) {
    const headers = new Map([
      ["Content-Type", "text/html; charset=utf-8"],
      ["Cache-Control", "private, max-age=5, must-revalidate"],
    ]);

    const response_data_hash = createHash(response_model.body);
    if (response_data_hash) {
      headers.set("ETag", response_data_hash);
    }

    for (const header of headers) {
      const key = header[0];
      const value = header[1];
      if (response_model.hasHeader(key) === false) {
        response_model.setHeader(key, value);
      }
    }
  }

  /**
   *
   * @param {Handler[]} handlers
   * @param {HttpRequest} request
   * @param {ResponseModel} response_model
   */
  async #executeHandlers(
    handlers,
    request,
    response_model,
  ) {
    const normalized_url = validateRequestUrl(request.url, response_model);
    const normalized_method = validateRequestMethod(request.method, response_model);

    for (const handler of handlers) {
      if (response_model.was_handled) {
        return;
      }

      if (handler.is_middleware) {
        await handler.handler_function(request, response_model);
        continue;
      }

      if (handler.url !== normalized_url) {
        continue;
      }

      if (handler.method !== normalized_method) {
        continue;
      }

      await handler.handler_function(request, response_model);
      response_model.was_handled = true;
      return;
    }

    if (response_model.was_handled === true) {
      return;
    }

    throw new RequestError({
      status_code: http_status_codes.codes.NOT_FOUND,
      message: http_status_codes.reasons.NOT_FOUND,
    });

  }

  /**
   *
   * @param {ErrorHandlerFunction[]} error_handlers
   * @param {RequestError} error
   * @param {HttpRequest} request
   * @param {ResponseModel} response_model
   */
  async #executeErrorHandlers(error_handlers, error, request, response_model) {
    for (const handleError of error_handlers) {
      await handleError(error, request, response_model);
    }

    if (
      error.status_code === http_status_codes.codes.NOT_FOUND &&
      !response_model.was_handled
    ) {
      return this.#handleNotFound(error, request, response_model);
    }
  }

  /**
   * @type {ErrorHandlerFunction}
   */
  #handleNotFound(error, request, response) {
    if (!error.status_code) {
      error.status_code = http_status_codes.codes.NOT_FOUND;
    }
    if (!error.message) {
      error.message = http_status_codes.reasons.NOT_FOUND;
    }

    response.setStatus(error.status_code);
    response.writeHtml(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport"  content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible"  content="ie=edge">
          <title>Error</title>
        </head>
        <body>
          <h1>${error.message}: ${request.url}</h1>
        </body>
      </html>
    `);
  }
}
