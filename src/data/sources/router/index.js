import http from "http";
import Handler from "./src/domain/entities/handler.js";
import { handleError, handleNotFound, handleRequest, validateRequestMethod, validateRequestUrl } from "./src/domain/repositories/utilities.js";
import server_listener from "./src/domain/repositories/server_listener.js";
import handleHttpRequests from "./src/domain/repositories/server_listener.js";

export default class Router {
  /**
   * These run before any requests are handled
   * @type {Handler[]}
   */
  middleware;

  /**
   * The handle all requests
   * @type {Handler[]}
   */
  handlers;

  /**
   * @type {handleError[]}
   */
  endware;

  constructor() {
    this.middleware = [];
    this.handlers = [];
    this.endware = [];
  }

  /**
   *
   * @param {handleRequest} handler_function
   */
  use(handler_function) {
    this.#addMiddleware(new Handler({
      is_middleware: true,
      handler_function: handler_function,
    }));
  }

  /**
   *
   * @param {string} method
   * @param {handleRequest} handler_function
   */
  get(url, handler_function) {
    this.#addHandler(new Handler({
      method: this.get.name.toUpperCase(),
      url: url,
      handler_function: handler_function,
    }));
  }

  /**
   *
   * @param {handleError} endware_handler_function
   */
  useAfterAll(endware_handler_function) {
    const already_exists = this.endware.includes(endware_handler_function);
    if (already_exists) {
      throw new Error(`Endware already exists: [${endware_handler_function}]`);
    }

    this.endware.push(endware_handler_function);
  }

  /**
   *
   * @param {Handler} handler
   */
  #addHandler(handler) {
    if (this.handlers.includes(handler)) {
      throw new Error(`Handler has already been added: [${handler.handler_function}]`);
    }

    this.handlers.push(handler);
  }

  /**
   *
   * @param {Handler} handler
   */
  #addMiddleware(handler) {
    if (this.middleware.includes(handler)) {
      throw new Error(`Middleware has already been added: [${handler.handler_function}]`);
    }

    this.middleware.push(handler);
  }

  /**
   *
   * @param {number} port
   * @param {handleRequest} listener_handler
   */
  listen(port, listener_handler) {
    const server = http.createServer(handleHttpRequests(
      this.handlers,
      this.middleware,
      this.endware,
    ));

    server.listen(port, listener_handler);
  }
}
