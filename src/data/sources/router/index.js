import http from "http";
import Handler from "./src/domain/entities/handler.js";
import { addToArray, handleError, handleRequest } from "./src/domain/repositories/utilities.js";
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
    addToArray(this.middleware, new Handler({
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
    addToArray(this.handlers, new Handler({
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
    addToArray(this.endware, endware_handler_function);
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
