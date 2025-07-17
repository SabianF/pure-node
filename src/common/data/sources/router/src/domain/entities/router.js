import http from "http";
import Handler from "./handler.js";
import { addToArray } from "../repositories/utilities.js";
import createRequestHandler from "../repositories/request_handler.js";

/**
 * @typedef {import("./types.js").HttpRequestHandler} HttpRequestHandler
 */

/**
 * @typedef {import("./types.js").ErrorHandlerFunction} ErrorHandlerFunction
 */

export default class Router {
  /**
   * The handle all requests
   * @type {Handler[]}
   */
  #handlers;

  /**
   * @type {ErrorHandlerFunction[]}
   */
  #error_handlers;

  constructor() {
    this.#handlers = [];
    this.#error_handlers = [];
  }

  /**
   * Adds middleware, by creating a handler containing the handler_function and adding it to the handler array
   * @param {HttpRequestHandler} handler_function
   */
  use(handler_function) {
    addToArray(
      this.#handlers,
      new Handler({
        is_middleware: true,
        handler_function: handler_function,
      }),
    );
  }

  /**
   * Adds a GET route which executes the provided handler_function
   * @param {string} url
   * @param {HttpRequestHandler} handler_function
   */
  get(url, handler_function) {
    addToArray(
      this.#handlers,
      new Handler({
        method: this.get.name.toUpperCase(),
        url: url,
        handler_function: handler_function,
      }),
    );
  }

  /**
   *
   * @param {ErrorHandlerFunction} error_handler_function
   */
  handleErrors(error_handler_function) {
    addToArray(this.#error_handlers, error_handler_function);
  }

  /**
   *
   * @param {number} port
   * @param {HttpRequestHandler} listen_handler
   */
  listen(port, listen_handler) {
    const request_handler = createRequestHandler(this.#handlers, this.#error_handlers);
    const server = http.createServer(request_handler);

    server.listen(port, listen_handler);
  }
}
