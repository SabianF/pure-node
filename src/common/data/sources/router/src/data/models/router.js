import addMiddleware from "../../domain/usecases/add_middleware.js";
import addRequestHandler from "../../domain/usecases/add_request_handler.js";
import startServer from "../../domain/usecases/start_server.js";

/**
 * @typedef {import("./router.js").default} Router
 */

/**
 * @typedef {import("./types.js").HttpRequestHandler} HttpRequestHandler
 */

/**
 * @typedef {import("./types.js").ErrorHandlerFunction} ErrorHandlerFunction
 */

/**
 * @typedef {import("../../domain/repositories/routing.js").default} RoutingRepo
 */

/**
 * @typedef {object} RouterModelProps
 * @property {RoutingRepo} routing_repo
 * @property {Router} router
 */

export default class RouterModel {
  /**
   * @type {RoutingRepo}
   */
  #routing_repo;

  /**
   * @type {Router}
   */
  #router;

  /**
   *
   * @param {RouterModelProps} props
   */
  constructor({
    routing_repo,
    router,
  }) {
    this.#routing_repo = routing_repo;
    this.#router = router;
  }

  /**
   * Adds middleware, by creating a handler containing the handler_function and adding it to the handler array
   * @param {HttpRequestHandler} handler_function
   */
  use(handler_function) {
    addMiddleware(this.#router, handler_function);
  }

  /**
   * Adds a GET route which executes the provided handler_function
   * @param {string} url
   * @param {HttpRequestHandler} handler_function
   */
  get(url, handler_function) {
    addRequestHandler({
      router: this.#router,
      request_type: this.get.name.toUpperCase(),
      url: url,
      handler_function: handler_function,
    })
  }

  /**
   *
   * @param {ErrorHandlerFunction} error_handler_function
   */
  handleErrors(error_handler_function) {
    addErrorHandler({
      router: this.#router,
      error_handler_function: error_handler_function,
    });
  }

  /**
   *
   * @param {import("../../domain/entities/types.js").Server} server
   * @param {number} port
   * @param {HttpRequestHandler} listen_handler
   */
  listen(port, listen_handler) {
    startServer({
      server: this.#routing_repo.createServer(this.#router, "test"),
      port: port,
      listen_handler: listen_handler,
    })
  }
}
