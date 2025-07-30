import addErrorHandler from "../../domain/usecases/add_error_handler.js";
import addMiddleware from "../../domain/usecases/add_middleware.js";
import addRequestHandler from "../../domain/usecases/add_request_handler.js";
import startServer from "../../domain/usecases/start_server.js";

/**
 * @typedef {import("../../domain/entities/router.js").default} Router
 * @typedef {import("../../domain/entities/types.js").HttpRequestHandler} HttpRequestHandler
 * @typedef {import("../../domain/entities/types.js").ErrorHandlerFunction} ErrorHandlerFunction
 * @typedef {import("../../domain/entities/types.js").RoutingRepo} RoutingRepo
 * @typedef {import("../../domain/entities/types.js").Server} Server
 *
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
    });
  }

  handleStatic(base_path) {
    return this.#routing_repo.handleStatic(base_path);
  }

  /**
   *
   * @param {ErrorHandlerFunction} error_handler_function
   */
  handleError(error_handler_function) {
    return addErrorHandler({
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
    const create_server = this.#routing_repo.createServer(this.#router);
    if (create_server.has_error) {
      console.error(error);
      return error;
    }

    /**
     * @type {Server}
     */
    const server = create_server.data;

    startServer({
      server: server,
      port: port,
      listen_handler: listen_handler,
    })
  }

  getRequestHandlers() {
    return this.#router.getRequestHandlers();
  }

  getErrorHandlers() {
    return this.#router.getErrorHandlers();
  }
}
